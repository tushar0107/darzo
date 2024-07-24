import {
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
  IonNote,
  IonBadge,
  useIonAlert,
} from "@ionic/react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const UserPage: React.FC = () => {
  const user = useSelector((state: any) => state.user.user);
  const contacts = useSelector((state:any)=> state.contacts.contacts);
  const socket = useSelector((state:any)=>state.websocket.websocket);
  const [newMsg, setNewMsg] = useState(false);

  socket.onmessage = (data:any)=>{
    console.log(data);
    var message = JSON.parse(data.data);
    contacts.forEach((contact:any)=>{
      if(contact.mobile===message.mobile){
        contact.msg = message.msg;
      }
    });
  }
  
  
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
                      <IonNote>{contact.msg ? contact.msg: ''}</IonNote>
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
