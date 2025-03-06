import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { Auction } from './data/auction';
import * as data from './data/database';
import { IBid } from './data/types';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

// Temporär lagring av auktioner och bud
const auctions: Auction[] = [
    {
        id: "1",
        title: "Volvo V70",
        description: "En pålitlig familjebil i gott skick",
        imageUrl: "https://images.unsplash.com/photo-1693156737572-685fa516ddf8",
        startingPrice: 50000,
        currentPrice: 50000,
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        category: "family"
    },
    {
        id: "2",
        title: "BMW M3",
        description: "Sportig och kraftfull prestanda-bil",
        imageUrl: "https://images.unsplash.com/photo-1693156737572-685fa516ddf8",
        startingPrice: 150000,
        currentPrice: 150000,
        endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        category: "sport"
    }
];

// API endpoints
app.get('/api/auctions', (req, res) => {
    res.json(auctions);
});

app.get('/api/auctions/:id', (req, res) => {
    const auction = auctions.find(a => a.id === req.params.id);
    if (!auction) {
        return res.status(404).json({ error: 'Auktion hittades inte' });
    }
    res.json(auction);
});

// Socket.IO hantering
io.on('connection', (socket) => {
    console.log('Användare ansluten');

    socket.on('user-connected', (userName: string) => {
        console.log(`${userName} ansluten`);
    });

    socket.on('send-bid', (bid: any) => {
        const auction = auctions.find(a => a.id === bid.auctionId);
        if (auction && bid.amount > auction.currentPrice) {
            auction.currentPrice = bid.amount;
            io.emit('bid', bid);
        }
    });

    socket.on('disconnect', () => {
        console.log('Användare frånkopplad');
    });
});

const PORT = 3000;
httpServer.listen(PORT, () => {
    console.log(`Server körs på port ${PORT}`);
}); 