import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonItem,
} from "@ionic/react";
import React, { useCallback } from "react";
import { getLogger } from "../core";
import { AnimalItemProps } from "./AnimalItemProps";

const log = getLogger("AnimalItem");

interface AnimalItemPropsExt extends AnimalItemProps {
  onEdit: (id?: string) => void;
}

const AnimalItem: React.FC<AnimalItemPropsExt> = ({
  id,
  name,
  age,
  dateOfBirth,
  hasAllergies,
  onEdit,
}) => {
  log(`render ${name}`);
  const handleEdit = useCallback(() => onEdit(id), [id, onEdit]);
  return (
    <IonItem onClick={handleEdit}>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>
            <b>{name}</b>
          </IonCardTitle>
          <IonCardSubtitle>
            Birth Date: <i>{new Date(dateOfBirth).toLocaleDateString()}</i>
          </IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          This cute animal is {age} years old. Does it have allergies?{" "}
          {hasAllergies === true ? "Yes :(" : "Nope :)"}
        </IonCardContent>
      </IonCard>
    </IonItem>
  );
};

export default AnimalItem;
