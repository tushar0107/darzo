import { IonTabBar, IonTabButton } from "@ionic/react";

interface ContainerProps { }

const Footer: React.FC<ContainerProps> = () => {
  return (<>
    <IonTabBar slot="bottom">
      <IonTabButton tab="home" href="/home">Home</IonTabButton>
      <IonTabButton tab="videos" href="/videos">
        Videos
      </IonTabButton>
      <IonTabButton tab="profile" href="/profile">
        Profile
      </IonTabButton>
    </IonTabBar>
    </>
  );
};

export default Footer;
