import { IonButton, IonContent, IonPage, IonTab, IonTabBar, IonTabButton, IonTabs, useIonAlert, useIonLoading } from "@ionic/react";
import Header from "../components/Header";
import Menu from "../components/Menu";
import "./Home.css";
import { useEffect, useState } from "react";
import UserPage from "../components/UserPage";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { storeUserData } from "../redux/user/userSlice";
import { login } from "../redux/user/authSclice";
import {headers, urls} from "../components/GlobalVars";

import { setWebSocket } from "../redux/user/websocketSlice";
import Footer from "../components/Footer";


const Home: React.FC = () => {
  const user = useSelector((state: any) => state.user.user);
  const loginStatus = useSelector((state: any) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  const [mobile, setMobile] = useState<any>("5558765432");
  const [password,setPassword] = useState('123456');

  const [presentAlert] = useIonAlert();
  const [loader,dismiss] = useIonLoading();

  const token = localStorage.getItem('notificationToken');  

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
      }).then(()=>{
        if(token){
          axios.post(`${urls.ApiUrl}/api/get-token`,{'mobile':mobile,'token':token}).then((res:any)=>{
            if(res.data.status===true){
              console.log(res.data);
            }else{
              console.log(res.data);
            }
          }).catch(e=>console.log(e));
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
        <Footer/>
      </IonPage>
    </>
  );
};

export default Home;
