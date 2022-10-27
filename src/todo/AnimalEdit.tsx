import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonDatetime,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonLoading,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { getLogger } from "../core";
import { RouteComponentProps } from "react-router";
import { AnimalItemContext } from "./AnimalItemProvider";
import { AnimalItemProps } from "./AnimalItemProps";

const log = getLogger("AnimalEdit");

interface AnimalEditProps
  extends RouteComponentProps<{
    id?: string;
  }> {}

const AnimalItemEdit: React.FC<AnimalEditProps> = ({ history, match }) => {
  const { animals, saving, savingError, saveAnimal } =
    useContext(AnimalItemContext);
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [dateOfBirth, setDateOfBirth] = useState(new Date(Date.now()));
  const [hasAllergies, setHasAllergies] = useState(false);
  const [animal, setAnimal] = useState<AnimalItemProps>();
  useEffect(() => {
    log("useEffect");
    const routeId = match.params.id || "";
    console.log(routeId);
    const animal = animals?.find((it) => it.id === routeId);
    setAnimal(animal);
    if (animal) {
      setName(animal.name);
      setAge(animal.age);
      setDateOfBirth(animal.dateOfBirth);
      setHasAllergies(animal.hasAllergies);
    }
  }, [match.params.id, animals]);
  const handleSave = useCallback(() => {
    const editedAnimal = animal
      ? { ...animal, name, age, dateOfBirth, hasAllergies }
      : { name, age, dateOfBirth, hasAllergies };
    saveAnimal && saveAnimal(editedAnimal).then(() => history.goBack());
  }, [animal, saveAnimal, name, age, dateOfBirth, hasAllergies, history]);
  log("render");
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Edit</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleSave}>Save</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonItem>
          <IonLabel position="floating">Name:</IonLabel>
          <IonInput
            value={name}
            onIonChange={(e) => setName(e.detail.value || "")}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Age:</IonLabel>
          <IonInput
            type="number"
            value={age}
            onIonChange={(e) =>
              setAge(Number.parseInt(e.detail.value ? e.detail.value : "0"))
            }
          />
        </IonItem>

        <IonItem>
          <IonLabel position="floating">BirthDate:</IonLabel>
          <IonDatetime
            value={new Date(dateOfBirth).toLocaleDateString()}
            onIonChange={(e) =>
              setDateOfBirth(
                e.detail.value ? new Date(e.detail.value) : new Date(Date.now())
              )
            }
          />
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Allergies:</IonLabel>
          <IonCheckbox
            checked={hasAllergies}
            onIonChange={(e) => setHasAllergies(e.detail.checked)}
          ></IonCheckbox>
        </IonItem>

        <IonLoading isOpen={saving} />
        {savingError && (
          <div>{savingError.message || "Failed to save item"}</div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default AnimalItemEdit;
