import { useUser } from "@clerk/nextjs";
import { createContext, useContext, useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

// Define the SocketContext Interface
interface ISocketContext {
  socket: Socket | null;
  isSocketConnected: boolean;
}

// Create the SocketContext with default null value
export const SocketContext = createContext<ISocketContext | null>(null);

export const SocketContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {user} = useUser();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);

//   console.log("Socket Connection Status:", isSocketConnected, socket);

  
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

  // Pass socket and connection status to context
  return (
    <SocketContext.Provider value={{ socket, isSocketConnected }}>
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
