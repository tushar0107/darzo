import {
    IonList,
    IonItem,
    IonAvatar,
    IonLabel,
    IonNote,
    IonIcon,
    IonFab,
    IonFabButton,
    IonTitle,
} from "@ionic/react";
import { addOutline, checkmarkDoneOutline, imageOutline } from "ionicons/icons";
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ChatSocket from "../pages/ChatSocket";
import WebSocketContext from "../contextapi/WebSocketContext";
import axios from "axios";
import { ApiUrl } from "./GlobalVars";

let users: any = {
    "5558765432": {
        first_name: "Karen",
        last_name: 'Page',
        mobile: 5558765432,
        lastMsg: ["Thank You Karen!!"],
        time: '02:11',
        sendStatus: 'rec'
    },
    "7304431820": {
        first_name: "Foggy",
        last_name: 'Nelson',
        mobile: 7304431820,
        lastMsg: [],
        time: '02:11',
        sendStatus: ''
    },
    "9876598765": {
        first_name: "Roger",
        last_name: 'Steve',
        mobile: 9876598765,
        lastMsg: ["Buy back 10k gallons, top up credit, basdfsdhf dj a asdkd"],
        time: '02:11',
        sendStatus: 'sent'
    },
    "9998887776": {
        first_name: "Steven",
        last_name: 'Grant',
        mobile: 9998887776,
        lastMsg: ["That old pigeon is still haunting me!!"],
        time: '08:12',
        sendStatus: 'rec'
    },
    "9912345123": {
        first_name: "Peter",
        last_name: 'Parker',
        mobile: 9912345123,
        lastMsg: ["Heyy, Man!! Have seen that movie??"],
        time: '06:50',
        sendStatus: 'rec'
    }
};

const UserPage: React.FC = () => {
    const { user } = useSelector((state: any) => state.auth);
    const [chatWith, setChatWith] = useState<any>(null);
    const socket = useContext(WebSocketContext);
    const [newMsg, setNewMsg] = useState<any>();
    const [contacts, setContacts] = useState<any>([]);

    useEffect(() => {
        if(!socket){return}
        socket.onmessage = (data: any) => {
            var message = JSON.parse(data.data);
            console.log(message);
            setNewMsg(message);
        }
        axios.get(`${ApiUrl}/api/chat-users`).then((res) => {
            let arr: any = {};
            res.data.result.forEach((ele: any, ind: number) => {
                ele['lastMsg'] = [];
                ele['sendStatus'] = '';
                ele['time'] = Math.floor(Math.random() * 100 % 12) + ":" + Math.floor(Math.random() * 100 % 60);
                arr[ele.mobile] = ele;
            });
            setContacts(arr);
        }).catch((err) => {
            console.log(err);
        });
    }, [socket]);

    useEffect(() => {
        if (chatWith) {
            let cont = contacts;
            if (cont[chatWith.mobile].lastMsg.length > 1) {
                cont[chatWith.mobile].lastMsg = cont[chatWith.mobile].lastMsg.slice(-1);
                cont[chatWith.mobile].sendStatus = '';
            }
            setContacts(cont);
        }
    }, [chatWith]);


    return (
        <>
            {Object.values(contacts).length != 0 ?
                <IonList lines="full" typeof="ios" className="chat-list">
                    {Object.values(contacts).map((contact: any, key: any) => {
                        if (contact.mobile != user.mobile) {
                            return (
                                <IonItem onClick={() => { setChatWith(contact) }} key={key}>
                                    <IonAvatar>
                                        <img src="profile.webp" alt="" className="profile-image" />
                                    </IonAvatar>
                                    <div className="item-details">
                                        <IonLabel>{contact.first_name + " " + contact.last_name}</IonLabel>
                                        <IonNote>{
                                            contact.sendStatus == 'sent' ? <IonIcon icon={checkmarkDoneOutline} /> :
                                                contact.sendStatus == 'file' ? <IonIcon icon={imageOutline} /> : null} {contact.lastMsg?.slice(-1)[0]?.slice(0, 24)}</IonNote>
                                    </div>
                                    <div slot="end" className="text-right">
                                        <IonNote>{contact.time}</IonNote>
                                        {contact.lastMsg.length > 0 && (contact.sendStatus == 'rec' || contact.sendStatus == 'file') ? <div className="msg-count">{contact.lastMsg.length}</div> : null}
                                    </div>
                                </IonItem>
                            )
                        }
                    })
                    }
                </IonList>
                : <IonTitle color="medium">Add contact to start a chat</IonTitle>}
            <IonFab slot="fixed" horizontal="end" vertical="bottom">
                <IonFabButton><IonIcon icon={addOutline} /></IonFabButton>
            </IonFab>
            <ChatSocket contact={chatWith} closeChat={setChatWith} newMsg={newMsg} />
        </>
    );
};

export default UserPage;
