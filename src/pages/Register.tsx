import React, { useEffect } from "react";
import Menu from "../components/Menu";
import { IonButton, IonContent, IonPage } from "@ionic/react";
import Header from "../components/Header";
import vars from "../components/GlobalVars";

import "../pages/Home.css";
import { useHistory } from "react-router";
import axios from "axios";

const Register: React.FC = () => {

  var loginData = {
      name:'',
      username:'',
      email:'',
      mobile:undefined,
      password:'',
    };

  const history = useHistory();

  const handleInput = (e:any)=>{
    if(e.target.name==='name'){
      loginData.name = e.target.value;
    }
    if(e.target.name==='username'){
      loginData.username = e.target.value;
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
      axios.post(`${vars.ApiUrl}/register`,{loginData},{headers:vars.headers})
      .then((res)=>{
        console.log(res.data);
        history.push('/');
      })
      .catch((err)=>{
        console.log(err);
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
            <input type="text" onChange={handleInput} name="name" id="name" placeholder="Enter name"></input>
            <input type="text" onChange={handleInput} name="username" id="username" placeholder="Enter username"></input>
            <input type="text" onChange={handleInput} name="email" id="email" placeholder="Enter Email"></input>
            <input type="number" onChange={handleInput} name="mobile" id="mobile" placeholder="Enter mobile"></input>
            <input type="text" onChange={handleInput} name="password" id="password" placeholder="Enter password"></input>
            
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
