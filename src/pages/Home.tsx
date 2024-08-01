import { IonButton, IonContent, IonPage, useIonAlert, useIonLoading } from "@ionic/react";
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
import {headers, urls} from "../components/GlobalVars";

import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from "@capacitor/push-notifications";
import { initializeConnect } from "react-redux/es/components/connect";
import { setWebSocket } from "../redux/user/websocketSlice";

const Home: React.FC = () => {
  const user = useSelector((state: any) => state.user.user);
  const loginStatus = useSelector((state: any) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  const [mobile, setMobile] = useState<any>("");
  const [password,setPassword] = useState('');

  const [presentAlert] = useIonAlert();
  const [loader,dismiss] = useIonLoading();

  

  const handleLogin = () => {
    loader({message:"Logging in..."});
    axios
      .post(`${urls.ApiUrl}/api/chat-login`, { mobile:mobile,password:password }, { headers: headers })
      .then((res) => {
        if(res.data.user){
          localStorage.setItem("user", JSON.stringify(res.data.user));
          dispatch(storeUserData(res.data.user));
          dispatch(login(res.data.user));
          var ws = new WebSocket(`${urls.WebSocketUrl}/${res.data.user.mobile}`);
          dispatch(setWebSocket(ws));
          dismiss();
          presentAlert({
            header: "Login",
            message: "Hello " + res.data.user.first_name + "!",
            buttons: ["OK"],
          });
        }else{
          dismiss();
          presentAlert({
            header: "Login error!",
            message: res.data.message,
            buttons: ["OK"],
          });
        }
      })
      .catch((err) => {
          dismiss();
          presentAlert({
          header: "Error!!",
          message: "Server error",
          buttons: ["OK"],
        });
        console.error(err);
      });
  };

  useEffect(() => {
    

    
    
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
