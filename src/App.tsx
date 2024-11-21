import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, IonToast, setupIonicReact, useIonAlert } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
import { App as CapApp } from "@capacitor/app";

/* Theme variables */
import "./theme/variables.css";
import Home from "./pages/Home";
import ChatSocket from "./pages/ChatSocket";
import Register from "./pages/Register";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { storeContacts } from "./redux/user/contactSlice";
import UserProfile from "./pages/UserProfile";
import { urls } from './components/GlobalVars';
import { setWebSocket } from "./redux/user/websocketSlice";
import { storeUserData } from "./redux/user/userSlice";
import { login } from "./redux/user/authSclice";
import { ActionPerformed, PushNotifications, PushNotificationSchema, Token } from "@capacitor/push-notifications";
import axios from "axios";

setupIonicReact();


const App: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  var ws: any;

  if (ws) {
    ws.onerror = ws.onopen = ws.onclose = null;
    ws.close();
  }

  const dispatch = useDispatch();
  const user = useSelector((state:any)=>state.user.user);

  if(user){
      var ws:any = new WebSocket(`${urls.ApiUrl}/${user.mobile}`);
      dispatch(setWebSocket(ws));
    }
  document.addEventListener("ionBackButton", (ev: any) => {

    ev.detail.register(1, () => {
      if (window.location.pathname === "/home") {
        CapApp.exitApp();
      }
      else{
        history.back();
      }
    });
  });


    PushNotifications.checkPermissions().then((res) => {
      console.log('checkpermission',res);
    });
    PushNotifications.requestPermissions().then(async(res) => {
      console.log('requestpermission',res);
      if (res.receive !== 'denied'){
        // Register with Apple / Google to receive push via APNS/FCM
        await PushNotifications.register().then(async(res)=>{
          console.log('requestpermission',res);
        });

        // On success, we should be able to receive notifications
        await PushNotifications.addListener("registration", (token: Token) => {
          console.log('token: ',token);
          localStorage.setItem("notificationToken", token.value);
        });
      
        await PushNotifications.addListener('registrationError',
          (error: any) => {
            console.log('Error on registration: ' + JSON.stringify(error));
          }
        );
      
        // await PushNotifications.addListener('pushNotificationReceived',
        //   (notification: PushNotificationSchema) => {
        //     console.log('Push received: ' + JSON.stringify(notification));
        //   }
        // );
      
        // await PushNotifications.addListener('pushNotificationActionPerformed',
        //   (notification: ActionPerformed) => {
        //     // alert('Push action performed: ' + JSON.stringify(notification));
        //   }
        // );
      
        // Some issue with our setup and push will not work
        await PushNotifications.addListener("registrationError", (error: any) => {
          console.log(error.message);;
        });
      
        // // Show us the notification payload if the app is open on our device
        // await PushNotifications.addListener(
        //   "pushNotificationReceived",
        //   async (notification: any) => {}
        // );
      
        // // Method called when tapping on a notification
        // await PushNotifications.addListener(
        //   "pushNotificationActionPerformed",
        //   (notification: ActionPerformed) => {
        //     // do action
        //   }
        // );
      }
    });
    // PushNotifications.register();

    // // On success, we should be able to receive notifications
    // PushNotifications.addListener("registration", (token: Token) => {
    //   console.log('token: ',token);
    //   localStorage.setItem("notificationToken", token.value);
    //   axios.post(`${urls.ApiUrl}/api/get-token`,{'mobile':user?.mobile,'token':token}).then((res:any)=>{
    //     if(res.data.status===true){
    //       console.log(res.data);
    //     }else{
    //       console.log(res.data);
    //     }
    //   }).catch(e=>console.log(e));
    // });

  useEffect(()=>{
    var localContacts:any = localStorage.getItem('contacts');
    var localContactsArr = JSON.parse(localContacts);
    if(localContacts!==null){
      dispatch(storeContacts(localContactsArr));
    }
    const userData: any = localStorage.getItem("user");
    const user = JSON.parse(userData);
    if (userData) {
      dispatch(storeUserData(user));
      dispatch(login(user));
    }



    return()=>{
      PushNotifications.removeAllListeners();
    }    
   
  },[]);

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
              <Route exact path="/home">
                <Home/>
              </Route>
              <Route exact path="/">
                <Redirect to="/home" />
              </Route>
              <Route path="/register">
                <Register />
              </Route>
              <Route path="/chat/:mobile">
                <ChatSocket />
              </Route>
              <Route path="/profile">
                <UserProfile/>
              </Route>
        </IonRouterOutlet>
      </IonReactRouter>
      <IonToast
          isOpen={isOpen}
          message={'Push notification enabled'}
          onDidDismiss={() => setIsOpen(false)}
          duration={3000}
          buttons={[
            {text:'Dismiss',role:'cancel'}
          ]}
        ></IonToast>
    </IonApp>
  );
};

export default App;

