import { IonTabBar, IonTabButton, IonIcon } from "@ionic/react";
import { chatbubbleEllipsesOutline, callOutline, personOutline, settingsOutline } from "ionicons/icons";
import { useHistory } from "react-router";


export const CustomFooter = ()=>{
    const history = useHistory();
    
    return(
        <>
                    <IonTabButton tab="home" href="home" selected={history.location.pathname=='/home'} className={``}>
                        <IonIcon icon={chatbubbleEllipsesOutline} />
                    </IonTabButton>
                    <IonTabButton tab="calls" href="calls" selected={history.location.pathname=='/calls'} className={``}>
                        <IonIcon icon={callOutline} />
                    </IonTabButton>
                    <IonTabButton tab="profile" href="profile" selected={history.location.pathname=='/profile'} className={``}>
                        <IonIcon icon={personOutline} />
                    </IonTabButton>
                    <IonTabButton tab="settings" href="settings" selected={history.location.pathname=='/settings'} className={``}>
                        <IonIcon icon={settingsOutline} />
                    </IonTabButton>
                </>
    );
}