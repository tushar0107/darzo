import React, { useEffect } from "react";
import Menu from "../components/Menu";
import { IonButton, IonContent, IonPage, useIonAlert, useIonLoading } from "@ionic/react";
import Header from "../components/Header";
import {headers, urls} from "../components/GlobalVars";

import "../pages/Home.css";
import { useHistory } from "react-router";
import axios from "axios";

const Register: React.FC = () => {

  var loginData = {
      first_name:'',
      last_name:'',
      email:'',
      mobile:undefined,
      password:'',
    };

  const history = useHistory();
  const [loader,dismiss] = useIonLoading();
  const [presentAlert] = useIonAlert();


  const handleInput = (e:any)=>{
    if(e.target.name==='first_name'){
      loginData.first_name = e.target.value;
    }
    if(e.target.name==='last_name'){
      loginData.last_name = e.target.value;
    }
    if(e.target.name==='email'){
      loginData.email = e.target.value;
    }
    if(e.target.name==='mobile'){
      loginData.mobile = e.target.value;
    }
    if(e.target.name==='password'){
      loginData.password = e.target.value;
    }
  }

  const handleLogin = ()=>{
    loader({message:'Signing up...'});
      axios.post(`${urls.ApiUrl}/api/chat-register`,{...loginData},{headers:headers})
      .then((res)=>{
        if(res.data.status===true){
          console.log(res.data);
          dismiss();
          presentAlert({
            header:'Success!!',
            onDidDismiss:function(){
              history.push('/');
            }
          });
        }else{
          dismiss();
          presentAlert({
            header:'Error!!',
            message:res.data.message,
            buttons:['OK']
          });
        }
      })
      .catch((err)=>{
          dismiss();
          presentAlert({
            header:'Error!!',
            message:err.message,
            buttons:['OK']
          });
      })
      console.log(loginData);
  }
  

  useEffect(() => {
    if (localStorage.getItem("userId") !== null) {
      // setUserId(localStorage.getItem("userId"));
      // setLogin(true);
    }
  }, []);
  return (
    <>
      <Menu />
      <IonPage id="main-content">
        <Header title="login" />
        <IonContent fullscreen>
          <div id="login-form">
            <h1>Register</h1>
            <input type="text" onChange={handleInput} name="first_name" id="name" placeholder="Enter name"></input>
            <input type="text" onChange={handleInput} name="last_name" id="last_name" placeholder="Enter Lastname"></input>
            <input type="text" onChange={handleInput} name="email" id="email" placeholder="Enter Email"></input>
            <input type="number" onChange={handleInput} name="mobile" id="mobile" placeholder="Enter mobile"></input>
            <input type="password" onChange={handleInput} name="password" id="password" placeholder="Enter password"></input>
            
            <IonButton onClick={handleLogin} color="primary">
              <strong>Sign up</strong>
            </IonButton>
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Register;
