import { IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonTitle, useIonLoading, } from "@ionic/react";
import React from "react";
import { logOutOutline, personOutline, reload } from "ionicons/icons";
import { useDispatch, useSelector } from "react-redux";
import { urls } from "./GlobalVars";
import axios from "axios";
import { storeContacts } from "../redux/user/contactSlice";
import { clearUserData } from "../redux/user/userSlice";
import { logout } from "../redux/user/authSclice";

interface UserProps{
  title: string;
  status:string | null;
}

const Header: React.FC<UserProps> = (props:any) => {
  const loginStatus = useSelector((state: any) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const [loader,dismiss] = useIonLoading();

  const getContacts = async()=>{
    loader({message:'Fetching Contacts...'});
    await axios
      .get(`${urls.ApiUrl}/api/chat-users`)
      .then((res) => {
        if(res.data.status===true){
          localStorage.setItem('contacts',JSON.stringify(res.data.result));
          dispatch(storeContacts(res.data.result));
        }
        dismiss();
      })
      .catch((err) => {
        dismiss();
        console.log(err);
      });
  }

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="end">
            {loginStatus?
            <>
              {
                window.location.pathname==='/home'?
                <IonButton onClick={getContacts}>
                  <IonIcon icon={reload}></IonIcon>
                </IonButton>:null
              }
              <IonButton routerLink="/profile" routerDirection="forward">
                <IonIcon icon={personOutline}></IonIcon>
              </IonButton>
              <IonButton routerLink="/" routerDirection="root" onClick={()=>{dispatch(clearUserData());dispatch(logout())}}>
                <IonIcon icon={logOutOutline}></IonIcon>
              </IonButton>
            </>
            :null}
          </IonButtons>
        <IonTitle>{props.title}{props.status?<span style={{display:'inline-block',width:'10px',height:'10px',marginInlineStart:'5px',backgroundColor:'#00ff00',borderRadius:'20px',}}></span>:null}</IonTitle>
        </IonToolbar>
      </IonHeader>
    </>
  );
};

export default Header;
