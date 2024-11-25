import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import Menu from "../components/Menu";
import {
    IonButton,
    IonButtons,
    IonContent,
    IonFooter,
    IonIcon,
    IonImg,
    IonLabel,
    IonPage,
} from "@ionic/react";
import Header from "../components/Header";

import "../theme/chatpage.css";
import {
    closeCircle,
    images,
    playCircle,
    sendSharp,
} from "ionicons/icons";
import { useSelector } from "react-redux";
import axios from "axios";
import { urls } from "../components/GlobalVars";
import { FilePicker } from "@capawesome/capacitor-file-picker";

const ChatSocket: React.FC = () => {
    const user = useSelector((state: any) => state.user.user);
    const socket = useSelector((state: any) => state.websocket.websocket);
    const contacts = useSelector((state: any) => state.contacts.contacts);
    const popInfo = useRef(null);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [popText, setPopText] = useState("");
    const [name, setName] = useState("");
    const [previews, setPreviews] = useState<any>([]);

    const params: any = useParams();

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
        contacts.forEach((element: any) => {
            if (element.mobile === params.mobile) {
                setName(element.first_name + " " + element.last_name);
            }
        });

        if (params) {
            axios.post(`${urls.ApiUrl}/api/get-messages`, {
                sender: user.mobile,
                receiver: params.mobile,
            }).then((res) => {
                setChats(res.data.messages);
            }).catch((e) => {
                console.log(e);
            });
        }

        if (socket.readyState === WebSocket.OPEN) {
            const data = {receiver:params.mobile,sender:user.mobile,check:'ping'};
            socket.send(JSON.stringify(data));
        } else if (socket.readyState === WebSocket.CLOSED) {
            notify("Not Connected");
        }
    }, [socket]);

    socket.onmessage = (data: any) => {
        var message = JSON.parse(data.data);
        if(message.ping===true){
            setStatus('Online');
        }else if(message.ping===false){
            setStatus(null);
        }else{
            if (message.sender === params.mobile) {
                const newchat = [message, ...chats];
                setChats(newchat);
                setStatus('Online');
            }
        }
    };


    //on send by the user the chat is pushed to the chat array and saved to the localstorage
    const sendMsg = () => {
        var time = new Date();
        var meridian = time.getHours() > 11 ? " PM" : " AM";
        const data: any = {
            sent: time.getHours() + ":" + time.getMinutes() + meridian,
            sender: user.mobile,
            receiver: params.mobile,
            name: user.first_name + " " + user.last_name,
            msg: text,
            status: "sent",
            read: false,
        };

        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(data));
            setText("");
            setChats([data, ...chats]);
            setText("");
        } else if (socket.readyState === WebSocket.CLOSED) {
            notify("Offline");
        }
    };

    const sendMedia = () => {
        const formData = new FormData();
        var time = new Date();
        var meridian = time.getHours() > 11 ? " PM" : " AM";
        const data: any = {
            sent: time.getHours() + ":" + time.getMinutes() + meridian,
            sender: user.mobile,
            receiver: params.mobile,
            name: user.first_name + " " + user.last_name,
            msg: text
        };

        if(previews.length){
            formData.append('media',JSON.stringify(previews));
            formData.append('nsme','dfgdf');
            axios.post(urls.ApiUrl+'/api/send-media',formData,{headers:{'accept': 'application/json','Content-Type':'multipart/form-data'}}).then((res:any)=>{
                console.log('res',res.data);
                if(res.data.status){
                    const tempArr:any = previews.map((file:any)=>{
                        const fileMsg = {...data};
                        delete fileMsg.msg;
                        fileMsg['file'] = urls.ApiUrl+'/'+file.name;
                        fileMsg['filetype'] = file.type;
                        if (socket.readyState === WebSocket.OPEN) {
                            socket.send(JSON.stringify(fileMsg));
                        } else if (socket.readyState === WebSocket.CLOSED) {
                            notify("Offline");
                        }
                        return fileMsg;
                    });
                    setChats([...tempArr, ...chats]);
                    setText('');
                    setPreviews([]);
                }else{
                    notify("Failed");
                }
            }).catch(e=>{console.log(e.message)});
        }
    };

    const convertImagetoBlob = (mediaFiles: any) => {
        var rawFiles: any = [...previews];

        for (let i = 0; i < mediaFiles.length; i++) {
            if(mediaFiles[i].size<(26000000)){
                const {blob,data,mimeType,name} = mediaFiles[i];
                const timestamp = Date.now();
                if(blob){
                    const reader = new FileReader();
                    reader.readAsDataURL(blob);
                    reader.onloadend = function () {
                        rawFiles.push({
                            blob: reader.result,
                            type: mimeType.split("/")[0],
                            name: timestamp+'-'+name,
                        });
                    };
                }else if(data){
                    rawFiles.push({
                        blob: 'data:'+mimeType+';base64,'+data,
                        type: mimeType.split("/")[0],
                        name: timestamp+'-'+name,
                    });
                }
                console.log(rawFiles);
                if(rawFiles.length === mediaFiles.length) {
                    setPreviews(rawFiles);
                }
            }else{
                notify('File Limit Exceeds 25MB');
            }
        }
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

    return (
        <>
            <Menu />
            <IonPage id="main-content">
                <Header title={name} status={status} />
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
                                        <div key={key} className={params.mobile == msg.sender? "received message": "sent message"}>
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
                            {/* <IonTextarea id="message" 
              autoGrow={true} 
              autoCapitalize={'sentence'}
              rows={1}
              value={text}
              onChange={(e: any) => setText(e.target.value)} 
              placeholder="Message.."></IonTextarea> */}
                            <IonButtons>
                                <IonButton onClick={() => fileSelect()}>
                                    <IonIcon color="white" icon={images}></IonIcon>
                                </IonButton>
                                <IonButton onClick={() => {previews.length ? sendMedia() : sendMsg();}}>
                                    <IonIcon color="white" icon={sendSharp}></IonIcon>
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



