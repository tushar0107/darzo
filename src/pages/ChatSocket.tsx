import React, { useEffect, useMemo, useRef, useState } from "react";
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
  IonList,
  IonNote,
  IonPage,
  IonText,
  IonTextarea,
  useIonLoading,
} from "@ionic/react";
import Header from "../components/Header";

import "../theme/chatpage.css";
import { close, closeCircle, images, pin, sendSharp, time } from "ionicons/icons";
import { useSelector } from "react-redux";
import axios from "axios";
import { urls } from "../components/GlobalVars";
import { FilePicker } from "@capawesome/capacitor-file-picker";
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
  const [previews,setPreviews] = useState<any>([]);
  
  const params: any = useParams();

  //to set chats array
  const [chats, setChats] = useState<any[]>([]);
  //to set msg input
  const [text, setText] = useState("");
  //to store a static array of current chats to update on every send


  useEffect(() => {
    loading({message:'Loading...'});
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
        console.log(e);
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

  }, [socket]);
    
  socket.onmessage = (data: any) => {
    var message = JSON.parse(data.data);
	  console.log('message',message);
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

  //on send by the user the chat is pushed to the chat array and saved to the localstorage
  const sendMsg = () => {
    var time = new Date();
    var meridian = time.getHours()>11? ' PM':' AM';
    const data:any = {
	  	sent: time.getHours()+':'+time.getMinutes()+meridian,
	  	sender: user.mobile,
	  	receiver: params.mobile,
	  	name:user.first_name+" "+user.last_name,
	  	msg: text,
	  	status:'sent',
	  	read:false
	  };

		if(previews){
			for(let i=0;i<previews.length;i++){
				var file = previews[i];
				var timestmp = Date.now();
				var ext = file.name.split('.').pop();
				file['name'] = timestmp+'.'+ext;
				file['url'] = urls.ApiUrl+'/'+file.name;
				data['media'] = file;
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
      }
		}else{
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
		}
		setPreviews([]);
    
  };

  const convertImagetoBlob = (mediaFiles:any)=>{
	var rawFiles:any = [];

	for (let i=0;i<mediaFiles.length;i++){
	  	const reader = new FileReader();
	  	reader.readAsDataURL(mediaFiles[i].blob);
	  	reader.onloadend = function(){
			rawFiles.push({
				blob:reader.result,
				type:mediaFiles[i].mimeType.split('/')[0],
				name:mediaFiles[i].name
			});
		  	if(rawFiles.length===mediaFiles.length){
				setPreviews(rawFiles);
		  	}
	  }
	}
};


  const fileSelect = ()=>{
      FilePicker.pickMedia().then((res:any)=>{
		convertImagetoBlob(res.files);
      }).catch((e:any)=>{console.log(e.message)});
  }


  const cancelSelection = ()=>{
	  setPreviews([]);
  }


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
                          {msg.media ? <IonImg src={msg.media.url} onError={(e)=>{console.log('img')}} alt=''></IonImg>:null}
                          <span>{msg.msg}</span>
                          <br />
                          <span className="time">{msg.sent}</span>
                        </div>
                      );
                  })
                : null}
            </div>
          </div>
          
        </IonContent>
        <IonFooter>
        <div style={{position:'relative'}}>
          { 
            Array.isArray(previews) && previews.length>0 ?
              <div id="image-select-slider">
                {previews.map((file:any,index:any)=>{
                  if(file.type === "image"){
                    return(
                      <IonImg src={file.blob} key={index} alt=""></IonImg>
                    );
                  }else{
                    return(
                      <video src={file.blob} key={index}></video>
                    )
                  }
                  })
                }
				<IonIcon icon={closeCircle} onClick={cancelSelection}></IonIcon>
              </div> : null
          }
          <IonLabel id="chat-actions">
              {/* <input type="text" name="message" id="message" value={text} onChange={(e: any) => setText(e.target.value)} placeholder="Message.."/> */}
              <IonTextarea id="message" 
              autoGrow={true} 
              autoCapitalize={'sentence'}
              rows={1}
              value={text}
              onIonInput={(e: any) => setText(e.target.value)} 
              placeholder="Message.."></IonTextarea>
            <IonButtons>
              <IonButton onClick={()=>fileSelect()}><IonIcon color="white" icon={images}></IonIcon></IonButton>
              <IonButton onClick={()=>{(text||previews)?sendMsg():null}}>
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