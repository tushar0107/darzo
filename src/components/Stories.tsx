import { IonIcon, IonImg, IonLabel, IonText } from "@ionic/react";
import { add } from "ionicons/icons";


export const Stories:React.FC = ()=>{
    const storiesCollection = [
        {
            name: 'Steven',
            profile: 'https://picsum.photos/200/300.jpg?=1',
            viewed: true,
        },
        {
            name: 'Elektra',
            profile: 'https://picsum.photos/200/300.jpg?=2',
            viewed: false,
        },
        {
            name: 'Mathhew',
            profile: 'https://picsum.photos/200/300.jpg?=3',
            viewed: false,
        },
        {
            name: 'Marc',
            profile: 'https://picsum.photos/200/300.jpg?=4',
            viewed: false,
        },
        {
            name: 'Foggy',
            profile: 'https://picsum.photos/200/300.jpg?=5',
            viewed: true,
        },
        {
            name: 'Karen',
            profile: 'https://picsum.photos/200/300.jpg?=6',
            viewed: false,
        },
    ]

    return(
        <div className="stories-container">
            <div className={'stories-item first-item'}>
                <IonLabel><IonIcon icon={add} size="large"/></IonLabel>
                <IonText>Add Story</IonText>
            </div>
            {
                storiesCollection.map((sto:any,ind:number)=>{
                    return(
                        <div className={`stories-item ${sto.viewed?'':'not-viewed'}`} key={ind}>
                            <IonImg src={sto.profile} alt="" />
                            <IonText>{sto.name}</IonText>
                        </div>
                    )
                })
            }
        </div>
    );
}