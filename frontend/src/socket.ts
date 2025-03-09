import { io } from "socket.io-client";

export const socket = io("http://localhost:3001", {
  withCredentials: true,
  transports: ['websocket', 'polling']
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
}); 