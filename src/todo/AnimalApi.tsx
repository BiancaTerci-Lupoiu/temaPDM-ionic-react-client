import axios from "axios";
import { getLogger } from "../core";
import { AnimalItemProps } from "./AnimalItemProps";

const log = getLogger("animalApi");

const baseUrl = "localhost:3000";
const animalsUrl = `http://${baseUrl}/animals`;

interface ResponseProps<T> {
  data: T;
}

function withLogs<T>(
  promise: Promise<ResponseProps<T>>,
  fnName: string
): Promise<T> {
  log(`${fnName} - started`);
  return promise
    .then((res) => {
      log(`${fnName} - succeeded`);
      return Promise.resolve(res.data);
    })
    .catch((err) => {
      log(`${fnName} - failed`);
      return Promise.reject(err);
    });
}

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

export const getAnimals: () => Promise<AnimalItemProps[]> = () => {
  return withLogs(axios.get(animalsUrl, config), "getAnimals");
};

export const createAnimal: (
  animal: AnimalItemProps
) => Promise<AnimalItemProps[]> = (animal) => {
  return withLogs(axios.post(animalsUrl, animal, config), "createAnimal");
};

export const updateAnimal: (
  animal: AnimalItemProps
) => Promise<AnimalItemProps[]> = (animal) => {
  return withLogs(
    axios.put(`${animalsUrl}/${animal.id}`, animal, config),
    "updateAnimal"
  );
};

interface MessageData {
  event: string;
  payload: {
    animal: AnimalItemProps;
  };
}

export const newWebSocket = (onMessage: (data: MessageData) => void) => {
  const ws = new WebSocket(`ws://${baseUrl}`);
  ws.onopen = () => {
    log("web socket onopen");
  };
  ws.onclose = () => {
    log("web socket onclose");
  };
  ws.onerror = (error) => {
    log("web socket onerror", error);
  };
  ws.onmessage = (messageEvent) => {
    log("web socket onmessage");
    onMessage(JSON.parse(messageEvent.data));
  };
  return () => {
    ws.close();
  };
};
