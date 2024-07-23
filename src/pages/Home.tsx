import { IonButton, IonContent, IonPage, useIonAlert } from "@ionic/react";
import { CapacitorSQLite, SQLiteConnection } from "@capacitor-community/sqlite";
import Header from "../components/Header";
import Menu from "../components/Menu";
import "./Home.css";
import { useContext, useEffect, useState } from "react";
import UserPage from "../components/UserPage";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { storeUserData } from "../redux/user/userSlice";
import { login } from "../redux/user/authSclice";
import vars from "../components/GlobalVars";

import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from "@capacitor/push-notifications";
import { initializeConnect } from "react-redux/es/components/connect";
import { setWebSocket } from "../redux/user/websocketSlice";
import WebSocketContext from "../contextapi/WebSocketContext";
import { Route } from "react-router";
import ChatSocket from "./ChatSocket";
import UserProfile from "./UserProfile";

const Home: React.FC = () => {
  const user = useSelector((state: any) => state.user.user);
  const loginStatus = useSelector((state: any) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  const [mobile, setMobile] = useState<any>("");
  const [password,setPassword] = useState('');

  const [presentAlert] = useIonAlert();

  var ws: any;

  if (ws) {
    ws.onerror = ws.onopen = ws.onclose = null;
    ws.close();
  }
  

  const handleLogin = () => {
    console.log("logging in...");
    axios
      .post(`${vars.ApiUrl}/api/login`, { mobile:mobile,password:password }, { headers: vars.headers })
      .then((res) => {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        dispatch(storeUserData(res.data.user));
        dispatch(login(res.data.user));
        ws = new WebSocket(`${vars.WebSocketUrl}/${res.data.user.mobile}`);
        dispatch(setWebSocket(ws));
        presentAlert({
          header: "Login",
          subHeader: "Hello " + res.data.user.first_name + "!",
          buttons: ["OK"],
        });
      })
      .catch((err) => {
        presentAlert({
          header: "Error!!",
          subHeader: "Server error",
          buttons: ["OK"],
        });
        console.error(err);
      });
  };

  useEffect(() => {
    const userData: any = localStorage.getItem("user");
    const user = JSON.parse(userData);
    if (userData !== null) {
      dispatch(storeUserData(user));
      dispatch(login(user));
      ws = new WebSocket(`${vars.WebSocketUrl}/${user.mobile}`);
      dispatch(setWebSocket(ws));
    }

    
    
  }, [dispatch]);

  return (
    <>
      <Menu />
      <IonPage id="main-content">
        <Header title="Home" />
        <IonContent fullscreen>
          {loginStatus ? (
            <>
                <UserPage />
            </>
          ) : (
            <>
              <div id="login-form">
                <h1>Login</h1>
                <input
                  type="number"
                  onChange={(e) => setMobile(e.target.value)}
                  name="mobile"
                  id="mobile"
                  value={mobile}
                  placeholder="Enter mobile"
                ></input>
                <input type="password" onChange={(e)=>setPassword(e.target.value)} name='password' id='password' value={password} placeholder="Password"></input>
                <IonButton onClick={handleLogin} color="primary">
                  <strong>Sign in</strong>
                </IonButton>
              </div>
            </>
          )}
        </IonContent>
      </IonPage>
    </>
  );
};

export default Home;
