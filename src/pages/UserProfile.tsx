import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { storeUserData, clearUserData } from "../redux/user/userSlice";

import { IonPage, IonContent } from "@ionic/react";
import Header from "../components/Header";
import Menu from "../components/Menu";

const UserProfile: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);
  const loginStatus = useSelector((state:any)=>state.auth.isAuthenticated);

  useEffect(() => {
    const userData:any =  localStorage.getItem('user');
    console.log(JSON.parse(userData));
    dispatch(storeUserData(JSON.parse(userData)));

  }, [dispatch]);

  return (
    <>
      <Menu />
      <IonPage id="main-content">
        <Header title="User Profile" />
        <IonContent fullscreen className="ion-padding">
          {loginStatus ?
          <>
            <h4>id: {user.id}</h4>
            <h4>name: {user.name}</h4>
            <h4>email: {user.email}</h4>
            <h4>username: {user.username}</h4>
            <h4>mobile: {user.mobile}</h4>
          </>
          :null}
        </IonContent>
      </IonPage>
    </>
  );
};

export default UserProfile;
