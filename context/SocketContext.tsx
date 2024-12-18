import { OngoingCall, Participants, SocketUser } from "@/types";
import { useUser } from "@clerk/nextjs";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { io, Socket } from "socket.io-client";

// Define the SocketContext Interface
interface ISocketContext {
  onlineUsers: SocketUser [] | null;
  ongoingCall: OngoingCall | null;
  localStream: MediaStream | null;
  handleCall: (user: SocketUser) => void;
}

// Create the SocketContext with default null value
export const SocketContext = createContext<ISocketContext | null>(null);

export const SocketContextProvider = ({ children,}: {children: React.ReactNode ;}) => {

  const {user} = useUser();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [onlineUsers, setOnlineUSer] = useState<SocketUser [] | null>(null)
  const [ongoingCall, setOngoingCall] = useState< OngoingCall |null>(null)
  const [localStream, setLocalStream] = useState<MediaStream|null>(null)

  const currentSocketUser = onlineUsers?.find(onlineUser => onlineUser.userId === user?.id)

  const getMediaStream = useCallback(async(faceMode?:string)=>{
    if(localStream) return localStream

    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices  = devices.filter(device => device.kind === 'videoinput')
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true, 
        video: {
          width : {min : 640 , ideal :1280 , max :1920},
          height : {min : 360, ideal :720 , max :1080},
          frameRate :{min :16 , ideal :30 , max :30},
          facingMode : videoDevices.length > 0 ? faceMode: undefined
        }
      })
      setLocalStream(stream) 
      return stream
    } catch (error) {
      console.error('Failed to get the stream' , error)
      setLocalStream(null)
      return
    }

  },[localStream])

  const handleCall = useCallback(async(user : SocketUser)=>{
    if(!currentSocketUser || !socket) return;

    const stream  = await getMediaStream()

    if(!stream){
      console.log('No stream in handle call')
        return
    } 

    const participants= {caller : currentSocketUser , reciever : user } 
    setOngoingCall({ participants, isRinging: false });

    socket.emit('call' , participants)

  }, [socket , currentSocketUser ,ongoingCall])


  const onIncomingCall = useCallback((participants: Participants)=>{

    setOngoingCall({ participants, isRinging: true });

  }, [socket , user ,ongoingCall])

//   console.log("Socket Connection Status:", isSocketConnected, socket);
//   console.log('onlineUsers:', onlineUsers)

  
  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(); // Add server URL here
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // Handle socket connection state
  useEffect(() => {
    if (socket === null) return;

    const onConnect = () => {
      setIsSocketConnected(true);
      console.log("Socket Connected");
    };

    const onDisconnect = () => {
      setIsSocketConnected(false);
      console.log("Socket Disconnected");
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [socket]);

  //set online users
  useEffect(() => {
    if(!socket || !isSocketConnected ) return;

    socket.emit("addNewUser" , user);
    socket.on('getUsers', (res) => {
      setOnlineUSer(res);
    })

    return ()=>{
      socket.off('getUsers', (res) => {
      setOnlineUSer(res);
    })
  }
  },[socket , isSocketConnected ,user]);

  //call

  useEffect(() => {
    if(!socket ||!isSocketConnected ) return;

    socket.on('incomingCall', onIncomingCall)
    return ()=>{
      socket.off('incomingCall', onIncomingCall)
    }
    
  }, [socket, isSocketConnected ,user,onIncomingCall]);
  

  // Pass socket and connection status to context
  return (
    <SocketContext.Provider value={{ onlineUsers,ongoingCall,localStream, handleCall }}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use the SocketContext
export const useSocket = () => {
  const context = useContext(SocketContext);

  if (context === null) {
    throw new Error("useSocket must be used within a SocketContextProvider");
  }

  return context;
};
