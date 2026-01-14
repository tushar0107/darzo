import { Capacitor } from "@capacitor/core";
import { IonButton, IonButtons, IonCol, IonContent, IonIcon, IonLabel, IonModal, IonNote, IonRow, IonTitle, IonToolbar } from "@ionic/react";
import { chevronBackOutline, videocamOutline, callOutline } from "ionicons/icons";
import { useContext, useEffect, useRef } from "react";
import WebSocketContext from "../contextapi/WebSocketContext";
import { useSelector } from "react-redux";
import sample1 from "/sample1.mp4";
import sample2 from "/sample2.mp4";

interface CallPageProps {
    callProfile: [
        profile: any,
        setProfile: (value: any) => void
    ];
}

const iceServers = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        {
            urls: "turn:frozzy-videochat-app:3478",
            username: "frozzy",
            credential: "Tushar@2001"
        }
    ]
};

const api_key = import.meta.env.VITE_METERED_API_KEY;

export const CallPage: React.FC<CallPageProps> = ({ callProfile }) => {
    const self = useSelector((state: any) => state.auth.user);
    const [profile, setProfile] = callProfile;
    const socket = useContext(WebSocketContext);
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const pcRef = useRef<RTCPeerConnection | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const pendingIce = useRef<any[]>([]);
    const iceQueue = useRef<RTCIceCandidate[]>([]);
    
    // create a connection to servers
    const createPeerConnection = async() => {
        const response = await fetch("https://frozzysserver.metered.live/api/v1/turn/credentials?apiKey="+api_key);
        const iceServers = await response.json();
        pcRef.current = new RTCPeerConnection(iceServers);

        // listener for incoming video streams
        pcRef.current.ontrack = (event) => {
            if (remoteVideoRef.current) {
                console.log("REMOTE TRACK RECEIVED", event.streams);
                remoteVideoRef.current.srcObject = event.streams[0];
            }
        };

        // listener for new connection 
        pcRef.current.onicecandidate = (event) => {
            if (event.candidate) {
                socket.send(JSON.stringify({
                    type: "ice-candidate",
                    candidate: event.candidate,
                    sender: self.mobile,
                    receiver: profile.mobile
                }));
            }
        };

    };


    // reset camera streams when video chat is closed
    function stopCamera() {
        if (localStreamRef.current) {
            // Get all tracks in the stream and stop each one
            localStreamRef.current.getTracks().forEach((track: MediaStreamTrack) => {
                track.stop();
            });
            // Optional: clear the local video stream
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = null;
            }
            console.log('Media stream stopped and devices released.');
        } else {
            console.log('No active stream to stop.');
        }
    }

    const getMedia = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localStreamRef.current = stream;
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
                localVideoRef.current.style.border = '1px solid red';
                stream.getTracks().forEach(track => {
                    pcRef.current!.addTrack(track, stream);
                });
            }
        } catch (err) {
            console.error('Error accessing media devices:', err);
            localVideoRef.current!.src = sample1;
            const stream = await getMediaFromVideo();
            stream.getTracks().forEach(track => {
                pcRef.current!.addTrack(track, stream);
            });
        }
    };

    const getMediaFromVideo = async () => {
        return new Promise<MediaStream>((resolve) => {
            const video:any = localVideoRef.current;
            video.onloadedmetadata = () => {
                video.play();
                const stream = video.captureStream();
                resolve(stream);
            };
        });
    };


    // send a call request
    const makeCall = async () => {
        if (!pcRef.current) return;
        getMedia();

        const offer = await pcRef.current.createOffer();
        await pcRef.current.setLocalDescription(offer);
        // Apply buffered ICE
        pendingIce.current.forEach((c) =>{
                pcRef.current?.addIceCandidate(c);
            }
        );
        pendingIce.current = [];
        socket.send(JSON.stringify({
            type: "offer",
            offer: offer,
            sender: self.mobile,
            receiver: profile.mobile,
            name: self.name,
        }));
    }

    // receive a call request
    const receiveCall = async (message: any) => {
        if (!pcRef.current) return;
        await pcRef.current.setRemoteDescription(message.offer);
        getMedia();

        const answer = await pcRef.current.createAnswer();
        await pcRef.current.setLocalDescription(answer);

        // Apply buffered ICE
        pendingIce.current.forEach((c) =>{
                pcRef.current?.addIceCandidate(c);
            }
        );
        pendingIce.current = [];


        socket.send(JSON.stringify({
            type: "answer",
            answer: answer,
            sender: self.mobile,
            receiver: message.sender
        }));
    }

    // answer an incoming call
    const answerCall = async (message: any) => {
        await pcRef.current?.setRemoteDescription(new RTCSessionDescription(message.answer));
    }

    async function handleIceCandidate(candidate: any) {
        if (pcRef.current?.remoteDescription) {
            await pcRef.current.addIceCandidate(candidate);
        } else {
            pendingIce.current.push(candidate);
        }
    }

    useEffect(() => {
        if (!profile) return;

        createPeerConnection();

        return () => {
            pcRef.current?.close();
            pcRef.current = null;
        };
    }, [profile]);

    useEffect(() => {
        if (!socket) return;

        socket.onmessage = async (data: any) => {
            const message = JSON.parse(data.data);
            console.log(message);

            switch (message.type) {
                case "offer":
                    await receiveCall(message);
                    break;
                case "answer":
                    await answerCall(message);
                    break;
                case "ice-candidate":
                    await handleIceCandidate(message.candidate);
                    break;
            }
        };
    }, [socket]);

    const clearPage = () => {
        stopCamera();
        setProfile(null);
    }


    if (profile) {
        return (
            <IonModal isOpen={profile != null} onDidDismiss={() => clearPage()}>
                <IonToolbar>
                    <IonRow slot="start">
                        <IonCol size="4">
                            <IonButton fill="clear" onClick={() => clearPage()}><IonIcon icon={chevronBackOutline} /></IonButton>
                        </IonCol>
                        <IonTitle>{profile.first_name}</IonTitle>
                    </IonRow>
                    <IonButton onClick={makeCall}>Call</IonButton>
                </IonToolbar>
                <IonContent fullscreen>

                    <div className="video-container">
                        <video ref={remoteVideoRef} id="remote-video" autoPlay loop playsInline />
                        <video ref={localVideoRef} id="self-video" autoPlay loop playsInline muted />
                    </div>
                </IonContent>
            </IonModal>
        );
    }
}