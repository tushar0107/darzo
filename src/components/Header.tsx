import { IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonMenuButton, IonTitle, IonPopover, IonContent, useIonLoading } from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import { personOutline, reload } from "ionicons/icons";
import { useDispatch, useSelector } from "react-redux";
import { urls } from "./GlobalVars";
import axios from "axios";
import { storeContacts } from "../redux/user/contactSlice";

interface UserProps{
  title: string;
}

const Header: React.FC<UserProps> = (props:any) => {
  const dispatch = useDispatch();
  const [loader,dismiss] = useIonLoading();

  const getContacts = async()=>{
    loader({message:'Fetching Contacts...'});
    await axios
      .get(`${urls.ApiUrl}/api/chat-users`)
      .then((res) => {
        if(res.data.status===true){
          localStorage.setItem('contacts',JSON.stringify(res.data.result));
          dispatch(storeContacts(res.data.result));
        }
        dismiss();
      })
      .catch((err) => {
        dismiss();
        console.log(err);
      });
  }

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="end">
            {
              window.location.pathname==='/home'?
              <IonButton onClick={getContacts}>
                <IonIcon icon={reload}></IonIcon>
              </IonButton>:null
            }
            <IonButton routerLink="/home/profile" routerDirection="forward">
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
