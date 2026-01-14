import { IonApp, IonAvatar, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonModal, IonNote, IonTitle, IonToolbar } from "@ionic/react";
import { checkmarkDoneOutline, chevronBackOutline, imageOutline, searchOutline } from "ionicons/icons";
import { useHistory } from "react-router";
import {useEffect, useState} from "react";
import axios from "axios";
import { ApiUrl } from "../components/GlobalVars";
import { useSelector } from "react-redux";
import { CallPage } from "../components/CallPage";


export const Calls:React.FC =  ()=>{
    const { user } = useSelector((state: any) => state.auth);
    const history = useHistory();
    const [contacts, setContacts] = useState<any>([]);
    const [callWith,setCallWith] = useState(null);

    useEffect(() => {
        axios.get(`${ApiUrl}/api/chat-users`).then((res) => {
            setContacts(res.data.result);
        }).catch((err) => {
            console.log(err);
        });
    }, []);

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
                <IonList lines="full" typeof="ios" className="chat-list">
                    {contacts?.length ? contacts?.map((contact: any, key: any) => {
                        if (contact.mobile != user.mobile) {
                            return (
                                <IonItem onClick={() => { setCallWith(contact) }} key={key}>
                                    <IonAvatar>
                                        <img src="profile.webp" alt="" className="profile-image" />
                                    </IonAvatar>
                                    <div className="item-details">
                                        <IonLabel>{contact.first_name + " " + contact.last_name}</IonLabel>
                                    </div>
                                </IonItem>
                            )
                        }
                    })
                    : null}
                </IonList>
            </IonContent>
            <CallPage callProfile={[callWith,setCallWith]}/>
        </IonApp>
    );
}