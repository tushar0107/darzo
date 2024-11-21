import React from "react";
import {
  IonContent,
  IonHeader,
  IonMenu,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
} from "@ionic/react";
import { cardOutline, logOutOutline } from "ionicons/icons";
import { clearUserData } from "../redux/user/userSlice";
import { useHistory } from "react-router";

const Menu: React.FC = () => {
  const history = useHistory();
  return (
    <IonMenu side="end" contentId="main-content">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Menu</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding-top">
        <IonList>
          <IonItem routerLink="/register" routerDirection="forward">
            <IonIcon icon={cardOutline}></IonIcon>
            <IonLabel class="ion-padding-start">Register</IonLabel>
          </IonItem>
          <IonItem
            routerLink="/home"
            routerDirection="back"
            onClick={() => {
              clearUserData();
              localStorage.removeItem("user");
              history.push("/");
              window.location.reload();
            }}
          >
            <IonIcon icon={logOutOutline}></IonIcon>
            <IonLabel class="ion-padding-start">Logout</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
