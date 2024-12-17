import { createContext, useContext } from "react";

interface iSOcketContext {

}

export const SocketContext = createContext<iSOcketContext | null>(null)

export const SocketContextProvider = ({children} : {children : React.ReactNode})=>{
    return <SocketContext.Provider value={{}}>
       {children}
    </SocketContext.Provider>
}

export const useSocket  = ()=>{
    const context = useContext(SocketContext)

    if (context=== null) {
        throw new Error('useSocket must be used within a SocketContextProvider')
    }
}