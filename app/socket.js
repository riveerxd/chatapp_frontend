import { io } from "socket.io-client";

export const socket = io("192.168.0.243:4000",
    {
        transports: ["websocket"]
    }
);