import { IonButton, IonContent, IonPage, useIonAlert, useIonLoading, useIonToast } from "@ionic/react"
import axios from "axios";
import { ApiUrl, headers, WebSocketUrl } from "../components/GlobalVars";
import { login, storeUserData } from "../redux/user/authSclice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";


export const Login:React.FC = ()=>{
	const [present,dismiss] = useIonLoading();
	const [presentAlert] = useIonAlert();
	const [presentToast] = useIonToast();

	const [mobile, setMobile] = useState<number>();
	const [password, setPassword] = useState('');
	const [socket, setSocket] = useState<any>(null);
	const dispatch = useDispatch();
	const token = localStorage.getItem('notificationToken');

	const history = useHistory();

	const handleLogin = () => {
		present({message:"Signing in ..."});
		if (mobile && password) {
			axios.post(`${ApiUrl}/api/chat-login`, { mobile: mobile, password: password }, { headers: headers }).then((res) => {
				if (res.data.user) {
					dispatch(storeUserData(res.data.user));
					var ws = new WebSocket(`${WebSocketUrl}/${res.data.user.mobile}`);
					setSocket(ws);
					history.replace('/');
					dismiss();
					presentAlert({
						header: "Login",
						message: "Hello " + res.data.user.first_name + "!",
						buttons: [{
                            text:"Hi!",
                            role: "confirm",
                            handler: ()=>{
                                history.push("/");
                            }
                        }]
					});
				} else {
					dismiss();
					presentAlert({
						header: "Login error!",
						message: res.data.message,
						buttons: ["OK"],
					});
				}
			}).then(() => {
				if (token) {
					axios.post(`${ApiUrl}/api/get-token`, { 'mobile': mobile, 'token': token }).then((res: any) => {
						if (res.data.status === true) {
						} else {
						}
					}).catch(e => console.log(e));
				}
			})
			.catch((err) => {
				dismiss();
                if(err.response){
                    presentAlert({
                        header: "Error!!",
                        message: err.response.data.message || "Server error",
                        buttons: ["OK"],
                    });
                }else{
                    presentAlert({
                        header: "Error!!",
                        message: err.message,
                        buttons: ["OK"],
                    });
                }
				console.error(err);
			});
		}else{
			presentToast({message:'Please fill mobile and password',duration:2000});
		}
	};

    useEffect(()=>{
        console.log("in login page");
    },[]);
	

    return(
        <IonPage>
            <IonContent fullscreen>
				<div id="login-form">
					<h1>Login</h1>
					<input type="number" onChange={(e) => setMobile(Number(e.target.value))} name="mobile" id="mobile" value={mobile} placeholder="Enter mobile"></input>
					<input type="password" onChange={(e) => setPassword(e.target.value)} name='password' id='password' value={password} placeholder="Password"></input>
					<IonButton onClick={handleLogin} color="primary">
						<strong>Sign in</strong>
					</IonButton>
					<IonButton onClick={() => history.push('/register')} color="primary">
						<strong>Register</strong>
					</IonButton>
				</div>
            </IonContent>
        </IonPage>
    )
}