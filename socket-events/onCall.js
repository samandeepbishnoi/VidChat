import {io} from '../server.js'

const onCall =async (participants) =>{
    if(participants.reciever.socketId){
        io.to(participants.reciever.socketId).emit('incomingCall', participants)
    }
}

export default onCall;