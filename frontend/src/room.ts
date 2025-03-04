import { Socket,io } from "socket.io-client";


// // SMARTASTE ROOMHANTERINGEN
const currentRoom = new URLSearchParams(document.location.search).get('room');
const socket:Socket = io('http://localhost:3000',{
  query: {
      roomName: currentRoom,
  },
});


