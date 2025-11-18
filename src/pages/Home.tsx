import { IonApp, IonButton, IonButtons, IonCol, IonContent, IonHeader, IonIcon, IonRow, IonTitle, IonToolbar } from "@ionic/react";
import UserPage from "../components/UserPage";
import "./Home.css";

import { search } from "ionicons/icons";
import { Stories } from "../components/Stories";
import { useHistory } from "react-router";


const Home: React.FC = () => {
    const history = useHistory();
    return (
            <IonApp>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Home</IonTitle>
                        <IonButtons slot="end">
                            <IonButton onClick={() => {history.push('/calls') }}>
                                <IonIcon icon={search}></IonIcon>
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen>
                    <Stories />
                    <IonRow className="ion-padding-horizontal ion-margin-top text-medium">
                        <IonCol size="3"><strong>Chats</strong></IonCol>
                    </IonRow>
                    <UserPage />
                </IonContent>
            </IonApp>
    );
};

export default Home;
