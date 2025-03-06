import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import * as data from './data/database';
import { IBid } from './data/types';
import cors from 'cors';

const app = express();
app.use(cors())
const server = http.createServer(app);
const io = new Server(server,{
  cors:{
    origin: "*"
  }
});

// Serve static files (frontend)
app.use(express.static('public'));
const users= new Map<string, string>()
// Socket.IO connection
io.on('connection', (socket: Socket) => {
  console.log('A user connected:', socket.id);

  
// // SMARTASTE ROOMHANTERINGEN
//   var query = socket.handshake.query;
//   var roomName = query.roomName as string;
//   socket.join(roomName);

  // Lägg till socketio message placeBid (namn, belopp)

  // Handle disconnection
  socket.on("send-bid", (bid:IBid)=>{
    socket.emit("bid", bid)
  })
  socket.on("user-connected",(userName:string)=>{
    users.set(socket.id,userName)
    console.log(userName)
  } )
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});


app.get('/api/auctions', (req, res) => {
  res.json(data.auctions);
});

app.get('/api/auctions/:id', (req, res) => {
  res.json(data.auctions.filter((auction) => auction.id === req.params.id)[0]);
});


// Start the server
data.Init();
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

