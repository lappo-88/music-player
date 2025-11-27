
import type {SocketEvents} from "@/common/constants";

import {getSocket} from "@/common/socket/getSocket.ts";

export  const SubscribeToEvent = <T>(event: SocketEvents, callback:(data:T)=>void)=>{

    const socket = getSocket()
socket.on(event, callback)
    return () => {
        socket.off(event, callback)
    }
}