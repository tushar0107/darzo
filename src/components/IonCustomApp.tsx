import { IonApp, IonFooter, IonIcon, IonTabBar, IonTabButton, IonTabs, useIonRouter } from "@ionic/react";
import { chatbubbleEllipsesOutline, callOutline, personOutline, settingsOutline } from "ionicons/icons";
import { useHistory } from "react-router";


interface IonAppProps{
    children: React.ReactNode;
}

export const IonCustomApp:React.FC<IonAppProps> = ({children})=>{
    const history = useHistory();
    const router = useIonRouter();

    return(
        <IonApp>
            {children}

            <IonFooter>
                <IonTabBar slot="bottom">
                    <IonTabButton tab="home" href="home" routerOptions={{}} onClick={()=>router.push("/home")} selected={history.location.pathname=='/home'} className={``}>
                        <IonIcon icon={chatbubbleEllipsesOutline} />
                    </IonTabButton>
                    <IonTabButton tab="calls" href="calls" onClick={()=>router.push("/calls")} selected={history.location.pathname=='/calls'} className={``}>
                        <IonIcon icon={callOutline} />
                    </IonTabButton>
                    <IonTabButton tab="profile" href="profile" selected={history.location.pathname=='/profile'} className={``}>
                        <IonIcon icon={personOutline} />
                    </IonTabButton>
                    <IonTabButton tab="settings" href="settings" selected={history.location.pathname=='/settings'} className={``}>
                        <IonIcon icon={settingsOutline} />
                    </IonTabButton>
                </IonTabBar>
            </IonFooter>
        </IonApp>
    );
}