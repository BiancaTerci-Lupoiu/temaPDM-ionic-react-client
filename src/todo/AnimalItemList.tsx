import {
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonList,
  IonLoading,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useContext } from "react";
import { getLogger } from "../core";
import AnimalItem from "./AnimalItem";
import { add } from "ionicons/icons";
import { AnimalItemContext } from "./AnimalItemProvider";
import { RouteComponentProps } from "react-router";

const log = getLogger("AnimalItemList");

// history tine cumva history-ul paginilor
const AnimalItemList: React.FC<RouteComponentProps> = ({ history }) => {
  const { animals, fetching, fetchingError } = useContext(AnimalItemContext);
  log("render");

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Animals Resort</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLoading isOpen={fetching} message="Fetching items" />
        {animals && (
          <IonList>
            {animals.map(({ id, name, age, dateOfBirth, hasAllergies }) => (
              <AnimalItem
                key={id}
                id={id}
                name={name}
                age={age}
                dateOfBirth={dateOfBirth}
                hasAllergies={hasAllergies}
                onEdit={(id) => history.push(`/animals/${id}`)}
              />
            ))}
          </IonList>
        )}
        {fetchingError && (
          <div>{fetchingError.message || "Failed to fetch animals"}</div>
        )}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => history.push("/animals")}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default AnimalItemList;
