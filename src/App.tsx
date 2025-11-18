import { Redirect, Route, useHistory } from "react-router-dom";
import { IonApp, IonButton, IonFooter, IonIcon, IonRouterOutlet, IonSplitPane, IonTabBar, IonTabButton, IonTabs, IonToast, setupIonicReact, useIonAlert, useIonLoading, useIonToast } from "@ionic/react";
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
// import "./theme/variables.css";
import Home from "./pages/Home";
import Register from "./pages/Register";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import UserProfile from "./pages/UserProfile";
import { login, storeUserData } from "./redux/user/authSclice";
import { PushNotifications } from "@capacitor/push-notifications";
import { FilePicker } from "@capawesome/capacitor-file-picker";
import { ApiUrl, headers, WebSocketUrl } from "./components/GlobalVars";
import { callOutline, chatbubbleEllipsesOutline, personOutline, settingsOutline } from "ionicons/icons";
import WebSocketContext from "./contextapi/WebSocketContext";
import Menu from "./components/Menu";
import { Calls } from "./pages/Calls";
import { CustomFooter } from "./components/CustomFooter";
import axios from "axios";
import { setWebSocket } from "./redux/user/websocketSlice";

setupIonicReact();


const App: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false);
	const { isAuthenticated, user } = useSelector((state: any) => state.auth);
	const [socket, setSocket] = useState<any>(null);
	const [present,dismiss] = useIonLoading();
	const [presentAlert] = useIonAlert();
	const [presentToast] = useIonToast();

	const history = useHistory();

	var ws: any;

	if (ws) {
		ws.onerror = ws.onopen = ws.onclose = null;
		ws.close();
	}

	const dispatch = useDispatch();

	const [mobile, setMobile] = useState<any>("");
	const [password, setPassword] = useState('');

	const token = localStorage.getItem('notificationToken');

	document.addEventListener("ionBackButton", (ev: any) => {
		ev.detail.register(1, () => {
			if (window.location.pathname === "/home") {
				CapApp.exitApp();
			}
			else {
				history.goBack();
			}
		});
	});


	const checkPermissions = async () => {
		try {
			const result = await FilePicker.checkPermissions();
			if (result) {
				alert(JSON.stringify('filepicker permission: ' + result));
			}
		} catch (err: any) {
			console.log(err.message);
		}
	};
	const requestPermissions = async () => {
		try {
			const result = await FilePicker.requestPermissions();
		} catch (err: any) {
			console.log(err.message);
		}
	};



	useEffect(() => {
		const userData: any = localStorage.getItem("user");
		if (userData) {
			const user = JSON.parse(userData);
			dispatch(storeUserData(user));
			var ws: any = new WebSocket(`${WebSocketUrl}/${user.mobile}`);
			setSocket(ws);
		} else {
			localStorage.setItem('user', JSON.stringify({}));
		}
		checkPermissions();
		requestPermissions();

	}, [isAuthenticated]);

	const handleLogin = () => {
		if (mobile && password) {
			// dispatch(login());
			// dispatch(storeUserData({ mobile: parseInt(mobile) }));
			axios.post(`${ApiUrl}/api/chat-login`, { mobile: mobile, password: password }, { headers: headers }).then((res) => {
				if (res.data.user) {
					dispatch(login());
					dispatch(storeUserData(res.data.user));
					var ws = new WebSocket(`${WebSocketUrl}/${res.data.user.mobile}`);
					setSocket(ws);
					dismiss();
					presentAlert({
						header: "Login",
						message: "Hello " + res.data.user.first_name + "!",
						buttons: ["Hi!"],
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
				presentAlert({
					header: "Error!!",
					message: "Server error",
					buttons: ["OK"],
				});
				console.error(err);
			});
		}else{
			presentToast({message:'Please fill mobile and password',duration:2000});
		}
	};
	if (isAuthenticated) {
		return (
			<WebSocketContext.Provider value={socket}>
				<IonApp>
					<IonReactRouter>
						<IonSplitPane contentId="main-content">
							<Menu />
							<IonTabs>
								<IonRouterOutlet id="main-content">
									<Route exact path="/">
										<Redirect from="/" to="/home" />
									</Route>
									<Route exact path="/home">
										<Home />
									</Route>
									<Route exact path="/register">
										<Register />
									</Route>
									<Route exact path="/calls">
										<Calls />
									</Route>
									<Route exact path="/profile">
										<UserProfile />
									</Route>
								</IonRouterOutlet>
								<IonTabBar slot="bottom">
									<IonTabButton tab="/home" href="/home" className={``}>
										<IonIcon icon={chatbubbleEllipsesOutline} />
									</IonTabButton>
									<IonTabButton tab="/calls" href="/calls" className={``}>
										<IonIcon icon={callOutline} />
									</IonTabButton>
									<IonTabButton tab="/profile" href="/profile" className={``}>
										<IonIcon icon={personOutline} />
									</IonTabButton>
									<IonTabButton tab="/settings" href="/settings" className={``}>
										<IonIcon icon={settingsOutline} />
									</IonTabButton>
								</IonTabBar>
							</IonTabs>
						</IonSplitPane>
					</IonReactRouter>
				</IonApp>

				<IonToast
					isOpen={isOpen}
					message={'Push notification enabled'}
					onDidDismiss={() => setIsOpen(false)}
					duration={3000}
					buttons={[
						{ text: 'Dismiss', role: 'cancel' }
					]}
				></IonToast>
			</WebSocketContext.Provider>
		);
	} else {
		return (
			<IonApp>
				<div id="login-form">
					<h1>Login</h1>
					<input type="number" onChange={(e) => setMobile(e.target.value)} name="mobile" id="mobile" value={mobile} placeholder="Enter mobile"></input>
					<input type="password" onChange={(e) => setPassword(e.target.value)} name='password' id='password' value={password} placeholder="Password"></input>
					<IonButton onClick={handleLogin} color="primary">
						<strong>Sign in</strong>
					</IonButton>
					<IonButton onClick={() => history.push('/register')} color="primary">
						<strong>Register</strong>
					</IonButton>
				</div>
			</IonApp>
		);
	}
}
export default App;

