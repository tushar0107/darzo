import {
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
  IonNote,
  IonBadge,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const UserPage: React.FC = () => {
  const user = useSelector((state: any) => state.user.user);
  const contacts = useSelector((state:any)=> state.contacts.contacts);
  const socket = useSelector((state:any)=>state.websocket.websocket);
  const [newMsg, setNewMsg] = useState<any>();

  socket.onmessage = (data:any)=>{
    var message = JSON.parse(data.data);
    setNewMsg(message);
  }

  
  
  return (
    <>
      {contacts.length!=0?<IonList lines="full" typeof="ios" className="chat-list">
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
                      <IonNote>{newMsg && newMsg.sender==contact.mobile?newMsg.msg:''}</IonNote>
                    </div>
                    <div slot="end">
                      <IonNote>{newMsg && newMsg.sender==contact.mobile?new Date(newMsg.sent).toLocaleTimeString().slice(0,5):''}</IonNote>
                    </div>
                  </IonItem>
                )
              }
            })
          : null}
      </IonList>: <IonNote color="medium">Tap the refresh icon in the header</IonNote>}
    </>
  );
};

export default UserPage;
