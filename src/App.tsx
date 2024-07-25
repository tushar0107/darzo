import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact, useIonAlert } from "@ionic/react";
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
import { useEffect } from "react";
import { storeContacts } from "./redux/user/contactSlice";
import UserProfile from "./pages/UserProfile";
import vars from './components/GlobalVars';
import { setWebSocket } from "./redux/user/websocketSlice";
import { storeUserData } from "./redux/user/userSlice";
import { login } from "./redux/user/authSclice";

setupIonicReact();


const App: React.FC = () => {
  var ws: any;

  if (ws) {
    ws.onerror = ws.onopen = ws.onclose = null;
    ws.close();
  }

  const dispatch = useDispatch();
  const user = useSelector((state:any)=>state.user.user);
  if(user){
      var ws:any = new WebSocket(`${vars.WebSocketUrl}/${user.mobile}`);
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
    </IonApp>
  );
};

export default App;
