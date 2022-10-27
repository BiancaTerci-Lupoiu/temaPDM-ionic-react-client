import React, { useCallback, useEffect, useReducer } from "react";
import PropTypes from "prop-types";
import { getLogger } from "../core";
import { AnimalItemProps } from "./AnimalItemProps";
import {
  createAnimal,
  getAnimals,
  newWebSocket,
  updateAnimal,
} from "./AnimalApi";

const log = getLogger("AnimalProvider");

type SaveAnimalItemFn = (animal: AnimalItemProps) => Promise<any>;

export interface AnimalItemsState {
  animals?: AnimalItemProps[];
  fetching: boolean;
  fetchingError?: Error | null;
  saving: boolean;
  savingError?: Error | null;
  saveAnimal?: SaveAnimalItemFn;
}

interface ActionProps {
  type: string;
  payload?: any;
}

const initialState: AnimalItemsState = {
  fetching: false,
  saving: false,
};

const FETCH_ITEMS_STARTED = "FETCH_ITEMS_STARTED";
const FETCH_ITEMS_SUCCEEDED = "FETCH_ITEMS_SUCCEEDED";
const FETCH_ITEMS_FAILED = "FETCH_ITEMS_FAILED";
const SAVE_ITEM_STARTED = "SAVE_ITEM_STARTED";
const SAVE_ITEM_SUCCEEDED = "SAVE_ITEM_SUCCEEDED";
const SAVE_ITEM_FAILED = "SAVE_ITEM_FAILED";

const reducer: (
  state: AnimalItemsState,
  action: ActionProps
) => AnimalItemsState = (state, { type, payload }) => {
  switch (type) {
    case FETCH_ITEMS_STARTED:
      return { ...state, fetching: true, fetchingError: null };
    case FETCH_ITEMS_SUCCEEDED:
      return { ...state, animals: payload.animals, fetching: false };
    case FETCH_ITEMS_FAILED:
      return { ...state, fetchingError: payload.error, fetching: false };
    case SAVE_ITEM_STARTED:
      return { ...state, savingError: null, saving: true };
    case SAVE_ITEM_SUCCEEDED:
      const animals = [...(state.animals || [])];
      const animal = payload.animal;
      const index = animals.findIndex((it) => it.id === animal.id);
      if (index === -1) {
        // face add pe pozitia 0 la noul animal
        animals.splice(0, 0, animal);
      } else {
        animals[index] = animal;
      }
      return { ...state, animals, saving: false };
    case SAVE_ITEM_FAILED:
      return { ...state, savingError: payload.error, saving: false };
    default:
      return state;
  }
};

export const AnimalItemContext =
  React.createContext<AnimalItemsState>(initialState);

interface AnimalItemProviderProps {
  children: PropTypes.ReactNodeLike;
}

export const AnimalItemProvider: React.FC<AnimalItemProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { animals, fetching, fetchingError, saving, savingError } = state;
  useEffect(getAnimalsEffect, []);
  useEffect(wsEffect, []);
  const saveAnimal = useCallback<SaveAnimalItemFn>(saveAnimalCallback, []);
  const value = {
    animals,
    fetching,
    fetchingError,
    saving,
    savingError,
    saveAnimal,
  };
  log("returns");
  return (
    <AnimalItemContext.Provider value={value}>
      {children}
    </AnimalItemContext.Provider>
  );

  function getAnimalsEffect() {
    let canceled = false;
    fetchAnimals();
    return () => {
      canceled = true;
    };

    async function fetchAnimals() {
      try {
        log("fetchAnimals started");
        dispatch({ type: FETCH_ITEMS_STARTED });
        const animals = await getAnimals();
        log("fetchAnimals succeeded");
        if (!canceled) {
          dispatch({ type: FETCH_ITEMS_SUCCEEDED, payload: { animals } });
        }
      } catch (error) {
        log("fetchAnimals failed");
        dispatch({ type: FETCH_ITEMS_FAILED, payload: { error } });
      }
    }
  }

  async function saveAnimalCallback(animal: AnimalItemProps) {
    try {
      log("saveAnimal started");
      dispatch({ type: SAVE_ITEM_STARTED });
      const savedAnimal = await (animal.id
        ? updateAnimal(animal)
        : createAnimal(animal));
      log("saveAnimal succeeded");
      dispatch({ type: SAVE_ITEM_SUCCEEDED, payload: { animal: savedAnimal } });
    } catch (error) {
      log("saveAnimal failed");
      dispatch({ type: SAVE_ITEM_FAILED, payload: { error } });
    }
  }

  function wsEffect() {
    let canceled = false;
    log("wsEffect - connecting");
    const closeWebSocket = newWebSocket((message) => {
      if (canceled) {
        return;
      }
      const {
        event,
        payload: { animal },
      } = message;
      log(`ws message, animal ${event}`);
      if (event === "created" || event === "updated") {
        dispatch({ type: SAVE_ITEM_SUCCEEDED, payload: { animal } });
      }
    });
    return () => {
      log("wsEffect - disconnecting");
      canceled = true;
      closeWebSocket();
    };
  }
};
