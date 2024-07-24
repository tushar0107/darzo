import { IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonMenuButton, IonTitle, IonPopover, IonContent } from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import { personOutline, reload } from "ionicons/icons";
import { useDispatch, useSelector } from "react-redux";
import vars from "./GlobalVars";
import axios from "axios";
import { storeContacts } from "../redux/user/contactSlice";

interface UserProps{
  title: string;
}

const Header: React.FC<UserProps> = (props:any) => {
  const dispatch = useDispatch();

  const getContacts = async()=>{
    await axios
      .get(`${vars.ApiUrl}/api/all-users`)
      .then((res) => {
        if(res.data.status===true){
          localStorage.setItem('contacts',JSON.stringify(res.data.result));
          dispatch(storeContacts(res.data.result));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="end">
            {window.location.pathname==='/home'?<IonButton onClick={getContacts}>
              <IonIcon icon={reload}></IonIcon>
            </IonButton>:null}
            <IonButton routerLink="/profile">
              <IonIcon icon={personOutline}></IonIcon>
            </IonButton>
            <IonMenuButton/>
          </IonButtons>
        <IonTitle>{props.title}</IonTitle>
        </IonToolbar>
      </IonHeader>
    </>
  );
};

export default Header;
