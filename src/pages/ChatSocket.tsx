import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import Menu from "../components/Menu";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonIcon,
  IonLabel,
  IonPage,
  useIonLoading,
} from "@ionic/react";
import Header from "../components/Header";

import "../theme/chatpage.css";
import { sendSharp } from "ionicons/icons";
import { useSelector } from "react-redux";
import axios from "axios";
import { urls } from "../components/GlobalVars";
// import { SQLiteConnection, SQLiteDBConnection } from "@capacitor-community/sqlite";
// import useSQLiteDB from "../components/Database/LocalDB";

const ChatSocket:React.FC = ()=>{
  const user = useSelector((state:any)=>state.user.user);
  const socket = useSelector((state:any)=>state.websocket.websocket);
  const contacts = useSelector((state:any)=>state.contacts.contacts);
  const popInfo = useRef(null);
  const [loading,dismiss] = useIonLoading();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popText, setPopText] = useState('');
  const [name, setName] = useState('');
  const input = useRef<any>(null);
  input.current?.focus();

  // const { performSQLAction, initialized } = useSQLiteDB();
  
  const params: any = useParams();

  //to set chats array
  const [chats, setChats] = useState<any[]>([]);
  //to set msg input
  const [text, setText] = useState("");
  //to store a static array of current chats to update on every send



  useEffect(() => {
    loading({message:'loading...'});
    contacts.forEach((element:any) => {
      if(element.mobile===params.mobile){
        setName(element.first_name+' '+element.last_name);
      }
    });

    if(params){

      axios.post(`${urls.ApiUrl}/api/get-messages`,{sender:user.mobile,receiver:params.mobile}).then((res)=>{
        setChats(res.data.messages);
        dismiss();
      }).catch(e=>{
        dismiss();
        console.log(e)
      });
      
    }


    if(socket.readyState===WebSocket.OPEN){
      setPopText('Connected');
      setPopoverOpen(true);
      setTimeout(()=>{
        setPopoverOpen(false);
      },2000);
    }else if(socket.readyState===WebSocket.CLOSED){
      setPopText('Not Connected');
      setPopoverOpen(true);
      setTimeout(()=>{
        setPopoverOpen(false);
      },2000);
    }
  }, []);
  
  
  socket.onmessage = (data: any) => {
    var message = JSON.parse(data.data);
    if(message.status ==='offline' || message.status ==="Not connected"){
      setPopText('User Offline');
      setPopoverOpen(true);
      setTimeout(()=>{
        setPopoverOpen(false);
      },2000);
    }else if(message.sender === params.mobile){
      const newchat = [{ ...message }, ...chats];
      setChats(newchat);
    }
  };
  // socket.onclose = function () {
  //   socket.null;
  // };

  


  //on send by the user the chat is pushed to the chat array and saved to the localstorage
  const sendMsg = () => {
    
    const data = {sent: new Date(),sender: user.mobile, receiver: params.mobile,name:name, msg: text, status:'sent',read:false};
    if(socket.readyState === WebSocket.OPEN){
      socket.send(JSON.stringify(data));
      setText('');
      const newchat = [{ ...data },...chats];
      setChats(newchat);
      setText('');
    }else if(socket.readyState === WebSocket.CLOSED){
      setPopText('Offline');
      setPopoverOpen(true);
      setTimeout(()=>{
        setPopoverOpen(false);
      },2000);
    }
  };

  return (
    <>
      <Menu />
      <IonPage id="main-content">
        <Header title={name}/>
        <IonContent>
          {popoverOpen ? <div ref={popInfo} className="status">
            {popText}
          </div> : null}
          <div id="chat-container">
            <div id="chat-section">
              {Array.isArray(chats)
                ? chats.map((msg: any, key: any) => {
                      return (
                        <div key={key} className={params.mobile==msg.sender?'received message':'sent message'}>
                          <span>{msg.msg}</span>
                        </div>
                      );
                  })
                : null}
            </div>
          </div>
          
        </IonContent>
        <IonFooter>
        <div>
          <IonLabel id="chat-actions">
              <input
                type="text"
                name="message"
                id="message"
                value={text}
                onChange={(e: any) => setText(e.target.value)}
                ref={input}
              />
            <IonButtons>
              <IonButton onClick={() => sendMsg()}>
                <IonIcon color="primary" icon={sendSharp}></IonIcon>
              </IonButton>
            </IonButtons>
            </IonLabel>
          </div>
        </IonFooter>
      </IonPage>
      
    </>
  );
};

export default ChatSocket;


// code from: https://github.com/aaronksaunders/ionic7-react-sqlite/blob/main/src/pages/Home.tsx