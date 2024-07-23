import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import Menu from "../components/Menu";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonIcon,
  IonPage,
} from "@ionic/react";
import Header from "../components/Header";

import "../theme/chatpage.css";
import { sendSharp } from "ionicons/icons";
import { useSelector } from "react-redux";
// import { SQLiteConnection, SQLiteDBConnection } from "@capacitor-community/sqlite";
// import useSQLiteDB from "../components/Database/LocalDB";

const ChatSocket:React.FC = ()=>{
  const user = useSelector((state:any)=>state.user.user);
  const socket = useSelector((state:any)=>state.websocket.websocket);
  const contacts = useSelector((state:any)=>state.contacts.contacts);
  const popInfo = useRef(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popText, setPopText] = useState('');
  const [name, setName] = useState('');

  // const { performSQLAction, initialized } = useSQLiteDB();
  
  const params: any = useParams();

  //to set chats array
  const [chats, setChats] = useState<any[]>([]);
  //to set msg input
  const [text, setText] = useState("");
  //to store a static array of current chats to update on every send



  useEffect(() => {
    contacts.forEach((element:any) => {
      if(element.mobile===params.mobile){
        setName(element.first_name+' '+element.last_name);
      }
    });

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
    if(message.status ==='offline'){
      setPopText('Offline');
      setPopoverOpen(true);
      setTimeout(()=>{
        setPopoverOpen(false);
      },2000);
    }else if(message.sender === params.mobile){
      let msg = {type: "received", msg: message.msg};
      const newchat = [...chats, { ...msg }];
      setChats(newchat);
    }
  };
  // socket.onclose = function () {
  //   socket.null;
  // };

  


  //on send by the user the chat is pushed to the chat array and saved to the localstorage
  const sendMsg = () => {
    const data = {sender: user.mobile, receiver: params.mobile, msg: text,type: "sent"};
    if(socket.readyState === WebSocket.OPEN){
      socket.send(JSON.stringify(data));
      setText('');
      const newchat = [...chats, { ...data }];
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
        <IonContent fullscreen>
          {popoverOpen ? <div ref={popInfo} className="status">
            {popText}
          </div> : null}
          <div id="chat-section">
            {Array.isArray(chats)
              ? chats.map((msg: any, key: any) => {
                    return (
                      <div key={key} className={"message "+msg.type}>
                        <span>{msg.msg}</span>
                      </div>
                    );
                })
              : null}
          </div>
          
        </IonContent>
        <IonFooter>
        <div id="chat-actions">
            <form action="" method="get">
              <input
                type="text"
                name="message"
                id="message"
                value={text}
                onChange={(e: any) => setText(e.target.value)}
              />
            </form>
            <IonButtons>
              <IonButton onClick={() => sendMsg()}>
                <IonIcon color="primary" icon={sendSharp}></IonIcon>
              </IonButton>
            </IonButtons>
          </div>
        </IonFooter>
      </IonPage>
      
    </>
  );
};

export default ChatSocket;


// code from: https://github.com/aaronksaunders/ionic7-react-sqlite/blob/main/src/pages/Home.tsx