import {
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
  IonNote,
  IonBadge,
  useIonAlert,
} from "@ionic/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import WebSocketContext from "../contextapi/WebSocketContext";
import ChatSocket from "../pages/ChatSocket";
import { Route } from "react-router";
import { storeContacts } from "../redux/user/contactSlice";

const UserPage: React.FC = () => {
  const user = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch();
  const contacts = useSelector((state:any)=> state.contacts.contacts);
  
  
  return (
    <>
      <IonList lines="full" typeof="ios" className="chat-list">
        {Array.isArray(contacts)
          ? contacts.map((contact:any, key:any) => {
              if(contact.mobile!==user.mobile){
                return (
                  <IonItem routerLink={`/chat/${contact.mobile}`} key={key}>
                    <IonAvatar>
                      <img src="profile.webp" alt="" className="profile-image" />
                    </IonAvatar>
                    <div className="item-details">
                      <IonLabel>{contact.first_name}</IonLabel>
                      <IonNote>Text 1</IonNote>
                    </div>
                    <div slot="end">
                      <IonNote>12:56</IonNote>
                      <br />
                      <IonBadge color="success" className="chat-badge">
                        5
                      </IonBadge>
                    </div>
                  </IonItem>
                )
              }
            })
          : null}
      </IonList>
    </>
  );
};

export default UserPage;
