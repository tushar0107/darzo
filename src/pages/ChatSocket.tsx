import React, { useContext, useEffect, useRef, useState } from "react";
import {
    IonButton,
    IonButtons,
    IonCol,
    IonContent,
    IonFooter,
    IonHeader,
    IonIcon,
    IonImg,
    IonLabel,
    IonModal, IonNote, IonRow, IonTitle,
    IonToolbar
} from "@ionic/react";

import "../theme/chatpage.css";
import {
    callOutline,
    chevronBackOutline,
    closeCircle,
    images, imagesOutline, paperPlaneOutline, playCircle, sendSharp,
    videocamOutline
} from "ionicons/icons";
import { useSelector } from "react-redux";
import { FilePicker } from "@capawesome/capacitor-file-picker";
import WebSocketContext from "../contextapi/WebSocketContext";
import axios from "axios";
import { ApiUrl } from "../components/GlobalVars";

interface ContactProps{
    contact: any;
    closeChat: (value:any)=>void;
    newMsg:any;
}

const ChatSocket: React.FC<ContactProps> = ({contact,closeChat,newMsg}) => {
    const self = useSelector((state: any) => state.auth.user);
    const socket = useContext(WebSocketContext);
    const popInfo = useRef(null);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [popText, setPopText] = useState("");
    const [name, setName] = useState("");
    const [previews, setPreviews] = useState<any>([]);


    //to set chats array
    const [chats, setChats] = useState<any[]>([]);
    //to set msg input
    const [text, setText] = useState("");
    //to store a static array of current chats to update on every send
    const [status, setStatus] = useState<string|null>(null);

    const notify = (msg:string)=>{
        setPopText(msg);
        setPopoverOpen(true);
        setTimeout(() => {
            setPopoverOpen(false);
        }, 1500);
    }
    
    useEffect(() => {
        if(contact){
            // send a ping message to check for online status of the user
            if (socket?.readyState === WebSocket.OPEN) {
                const data = {receiver:contact?.mobile,sender:self.mobile,type:'ping'};
                socket.send(JSON.stringify(data));
            } else if (socket?.readyState === WebSocket.CLOSED) {
                notify("Not Connected");
            }
            axios.post(`${ApiUrl}/api/get-messages`,{sender:self.mobile,receiver:contact?.mobile}).then((res)=>{
                setChats([...res.data.messages,...chats]);
            }).catch((err)=>{console.log(err.message)});
        }
    }, [socket,contact]);

    useEffect(() => {
        if(newMsg && newMsg.sender==contact?.mobile){
            setChats([...chats,newMsg]);
        }
    },[newMsg]);
    

    //on send by the self the chat is pushed to the chat array and saved to the localstorage
    const sendMsg = () => {
        if(!text){return;}
        var time = new Date();
        var meridian = time.getHours() > 11 ? " PM" : " AM";
        const data: any = {
            sent: time.getHours() + ":" + time.getMinutes() + meridian,
            sender: self.mobile,
            receiver: contact.mobile,
            name: self.name,
            msg: text,
            status: "sent",
            read: false,
            type: "msg"
        };

        if ( socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(data));
            setChats([...chats,data]);
            setText("");
        } else if (socket.readyState === WebSocket.CLOSED) {
            notify("Offline");
        }
    };

    const sendMedia = () => {
        var time = new Date();
        var meridian = time.getHours() > 11 ? " PM" : " AM";
        const data: any = {
            sent: time.getHours() + ":" + time.getMinutes() + meridian,
            sender: self.mobile,
            receiver: contact.mobile,
            name: self.first_name + " " + self.last_name,
            type: "file"
        };

        if(previews.length){
            const tempArr:any = previews.map((file:any)=>{
                const fileMsg = {...data};
                fileMsg['file'] = file.blob;
                fileMsg['filetype'] = file.type;
                if (socket.readyState === WebSocket.OPEN) {
                    socket.send(JSON.stringify(fileMsg));
                } else if (socket.readyState === WebSocket.CLOSED) {
                    notify("Offline");
                }
                return fileMsg;
            });
            setChats([...tempArr, ...chats]);
            setPreviews([]);
        }
    };

    const convertImagetoBlob = (mediaFiles: any) => {
        var rawFiles: any = [...previews];

        for (let i = 0; i < mediaFiles.length; i++) {
            if(mediaFiles[i].size<(10485760)){
                const {blob,data,mimeType,name} = mediaFiles[i];
                const timestamp = Date.now();
                if(data){
                    rawFiles.push({
                        blob: 'data:'+mimeType+';base64,'+data,
                        type: mimeType.split("/")[0],
                        name: timestamp+'-'+name,
                    });
                }
            }else{
                notify('File Limit Exceeds 10MB');
            }
        }
        setPreviews(rawFiles);
    };

    const fileSelect = () => {
        FilePicker.pickMedia({readData:true})
            .then((res: any) => {
                var files:any = [];
                for(let i=0;i<res.files;i++){
                    files[i] = res.files[i];
                    var timestamp = Date.now();
                    var name = res.files[i].name;
                    files[i].name = timestamp+'.'+name.split('.').pop();
                }
                convertImagetoBlob(res.files);
            })
            .catch((e: any) => {
                console.log(e.message);
            });
    };

    const clearPage = ()=>{
        closeChat(null);
        setChats([]);
    }

    return (
        <IonModal isOpen={contact!==null} onDidDismiss={()=>clearPage()}>
            <IonHeader>
                <IonToolbar>
                    <IonRow slot="start">
                        <IonCol size="4">
                            <IonButton fill="clear" onClick={()=>clearPage()}><IonIcon icon={chevronBackOutline}/></IonButton>
                        </IonCol>
                        <IonLabel>
                            <IonTitle className="ion-no-padding">{contact?.first_name}
                                <br /><IonNote>{contact?.mobile}</IonNote>
                            </IonTitle>
                        </IonLabel>
                    </IonRow>
                    <IonButtons slot="end">
                        <IonButton onClick={()=>{}}><IonIcon icon={videocamOutline}></IonIcon></IonButton>
                        <IonButton onClick={()=>{}}><IonIcon icon={callOutline}></IonIcon></IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {popoverOpen ? (
                    <div ref={popInfo} className="status">
                        {popText}
                    </div>
                ) : null}
                <div id="chat-container">
                    <div id="chat-section">
                        {Array.isArray(chats)
                            ? chats.map((msg: any, key: any) => {
                                return (
                                    <div key={key} className={contact?.mobile == msg.sender? "received message": "sent message"}>
                                        {msg.file ? 
                                            msg.filetype==='image'?
                                                (<IonImg src={msg.file} onError={(e) => {console.log("img");}} alt=""></IonImg>)
                                            : msg.filetype==='video'?
                                                (<>
                                                <video src={msg.file}></video>
                                                <IonIcon icon={playCircle} size="small" color="white"></IonIcon>
                                                </>)
                                            : null
                                        : null}
                                        <span>{msg.msg}</span><br />
                                        <span className="time">{msg.sent}</span>
                                    </div>
                                );
                            })
                            : null}
                    </div>
                </div>
            </IonContent>
            <IonFooter>
                <div style={{ position: "relative" }}>
                    {Array.isArray(previews) && previews.length > 0 ? (
                        <div id="image-select-slider">
                            {previews.map((file: any, index: any) => {
                                if (file.type === "image") {
                                    return <IonImg src={file.blob} key={index} alt=""></IonImg>;
                                } else {
                                    return <video src={file.blob} key={index}></video>;
                                }
                            })}
                            <IonIcon icon={closeCircle} onClick={()=>setPreviews([])}></IonIcon>
                        </div>
                    ) : null}
                    <IonLabel id="chat-actions">
                        <input
                            type="text"
                            name="message"
                            id="message"
                            value={text}
                            onChange={(e: any) => setText(e.target.value)}
                            placeholder="Message.."
                        />
                        <IonButtons className="">
                            <IonButton onClick={() => fileSelect()}>
                                <IonIcon color="white" icon={imagesOutline}></IonIcon>
                            </IonButton>
                            <IonButton onClick={() => {previews.length ? sendMedia() : sendMsg();}}>
                                <IonIcon color="white" icon={paperPlaneOutline}></IonIcon>
                            </IonButton>
                        </IonButtons>
                    </IonLabel>
                </div>
            </IonFooter>
        </IonModal>
    );
};

export default ChatSocket;