import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import Menu from "../components/Menu";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonIcon,
  IonPage,
} from "@ionic/react";
import Header from "../components/Header";

import "../theme/chatpage.css";
import { sendSharp } from "ionicons/icons";

const Chat: React.FC = () => {
  const params: any = useParams();

  //to create a msg object
  const [msg, setMsg] = useState({});
  //to set chats for currend id
  const [chats, setChats] = useState<any[]>([{}]);
  //to set msg input
  const [text, setText] = useState("");
  //to store a static array of current chats to update on every send
  var chat: any = [];

  useEffect(() => {
    if (localStorage.getItem(`chat-${params.id}`) === null) {
      localStorage.setItem(`chat-${params.id}`, JSON.stringify(""));
    } else {
      let localchat: any = localStorage.getItem(`chat-${params.id}`);
      setChats(JSON.parse(localchat));
    }
  }, []);

  //gets the input through user
  const getMsg = (e: any) => {
    setText(e.target.value);
    let str = { type: "sent", msg: e.target.value };
    setMsg(str);
  };

  //on send by the user the chat is pushed to the chat array and saved to the localstorage
  const sendMsg = () => {
    const newchat = [...chats, { ...msg }];
    setChats(newchat);
    setText("");
    localStorage.setItem(`chat-${params.id}`, JSON.stringify(newchat));
  };

  return (
    <>
      <Menu />
      <IonPage id="main-content">
        <Header userId={453} title={params.id} />
        <IonContent fullscreen>
          <div id="chat-section">
            {Array.isArray(chats)
              ? chats.map((ele: any, key: any) => {
                  if (ele.type === "rec") {
                    return (
                      <div key={key} className="message received">
                        <span>{ele.msg}</span>
                      </div>
                    );
                  } else if (ele.type === "sent") {
                    return (
                      <div key={key} className="message sent">
                        <span>{ele.msg}</span>
                      </div>
                    );
                  }
                })
              : null}
          </div>
          <div id="chat-actions">
            <form action="" method="get">
              <input
                type="text"
                name="message"
                id="message"
                value={text}
                onChange={(e: any) => getMsg(e)}
              />
            </form>
            <IonButtons>
              <IonButton onClick={() => sendMsg()}>
                <IonIcon color="primary" icon={sendSharp}></IonIcon>
              </IonButton>
            </IonButtons>
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Chat;

// {
// type: "rec",
// msg: "hii",
// },
// {
// type: "sent",
// msg: "hello",
// },
// {
// type: "rec",
// msg: "abc",
// },
// {
// type: "sent",
// msg: "def",
// },
