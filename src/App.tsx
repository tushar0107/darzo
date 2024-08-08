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
import { ActionPerformed, PushNotifications, Token } from "@capacitor/push-notifications";
import axios from "axios";

setupIonicReact();


const App: React.FC = () => {
  const [notificationCheck,setNotificationCheck]=useState(false);
  const [chatNotify,setChatNotify]=useState<any>("/chat/5559876543");
  const [isOpen, setIsOpen] = useState(false);
  const [notificationRes,setNotificationRes] = useState('');

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


  // const register = () => {
  //   // Register with Apple / Google to receive push via APNS/FCM
  //   PushNotifications.register();

  //   // On success, we should be able to receive notifications
  //   PushNotifications.addListener("registration", (token: Token) => {
  //     localStorage.setItem("notificationToken", token.value);
  //     axios.post(`${urls.ApiUrl}/api/chat-notification/token`,{'mobile':user?.mobile,'token':token}).then((res:any)=>{
  //       if(res.data.status===true){
  //         setNotificationRes(res.data.message || 'Push notification is enabled');
  //         setIsOpen(true);
  //       }else{
  //         setNotificationRes(res.data.message);
  //         setIsOpen(true);
  //       }
  //     }).catch(e=>console.log(e));
  //   });

  //   // Some issue with our setup and push will not work
  //   PushNotifications.addListener("registrationError", (error: any) => {
  //     setNotificationRes(error.message || 'Error in enabling push notification');
  //     setIsOpen(true);
  //   });

  //   // Show us the notification payload if the app is open on our device
  //   PushNotifications.addListener(
  //     "pushNotificationReceived",
  //     async (notification: any) => {}
  //   );

  //   // Method called when tapping on a notification
  //   PushNotifications.addListener(
  //     "pushNotificationActionPerformed",
  //     (notification: ActionPerformed) => {
  //       setNotificationCheck(true);
  //       setChatNotify(notification.notification.data.targetPage);
  //     }
  //   );
  // };

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

    //push notifications
  //   PushNotifications.checkPermissions().then((res) => {
  //     if (res.receive !== 'granted') {
  //       PushNotifications.requestPermissions().then((res) => {
  //         if (res.receive === 'denied') {
  //         }else {
  //           register();
  //         }
  //       });
  //     }else {
  //       register();
  //     }
  // });
   
  },[]);

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
              <Route exact path="/home">
                <Home />
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
              <Route path="/home/profile">
                <UserProfile/>
              </Route>
        </IonRouterOutlet>
      </IonReactRouter>
      <IonToast
          isOpen={isOpen}
          message={notificationRes}
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

