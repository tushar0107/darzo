import { IonApp, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar } from "@ionic/react";
import { chevronBackOutline, searchOutline } from "ionicons/icons";
import { useHistory } from "react-router";



export const Calls:React.FC =  ()=>{
    const history = useHistory();
    return (
        <IonApp>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton onClick={() => history.goBack()}><IonIcon icon={chevronBackOutline} /></IonButton>
                        <IonTitle>Calls</IonTitle>
                    </IonButtons>
                    <IonButtons slot="end">
                        <IonButton><IonIcon icon={searchOutline}/></IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>

            </IonContent>
        </IonApp>
    );
}