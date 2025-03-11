import express, { Request, Response } from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import {
  CreateTableIfDontExist,
  initializeDatabase,
  getAuctions,
  createBid,
  createUser,
  getCarById,
  getBidByAuctionId,
} from "./src/data/connection";
import { Bid } from "./src/data/Bid";
import { User } from "./src/models/User";
import { NextFunction, ParamsDictionary } from "express-serve-static-core";
import { Auction } from "./src/types/types";
import { auctions } from "./src/data/database";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    },
    pingTimeout: 60000,
    transports: ['websocket', 'polling']
});

app.use(cors());
app.use(express.json());

io.on('connection', (socket: Socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join-auction', async (auctionId: string) => {
        try {
            socket.join(auctionId);
            
            const [auction, bids] = await Promise.all([
                getCarById(auctionId),
                getBidByAuctionId(auctionId)
            ]);

            socket.emit('auction-joined', { 
                auction, 
                bids,
                message: `Connected to auction ${auctionId}`
            });

            console.log(`Client ${socket.id} joined auction ${auctionId}`);
        } catch (error) {
            socket.emit('auction-error', { 
                error: 'Failed to join auction',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    });

    socket.on('send-bid', async (bid: Bid) => {
        try {
            const savedBid = await createBid(bid);
            
            io.to(bid.auctionId).emit('new-bid', savedBid);
            
            socket.emit('bid-confirmed', savedBid);
            
            console.log(`New bid in auction ${bid.auctionId}: ${bid.amount} by ${bid.name}`);
        } catch (error) {
            socket.emit('bid-error', {
                error: 'Failed to place bid',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    });

    socket.on('disconnect', (reason) => {
        console.log(`Client ${socket.id} disconnected: ${reason}`);
    });
});

interface AuctionParams extends ParamsDictionary {
  id: string;
}

app.get("/api/auctions", async (req: Request, res: Response) => {
  try {
    res.json(await getAuctions());
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch auctions" });
  }
});

app.get("/api/auctions/:id", (req: Request<AuctionParams>, res: Response, next: NextFunction) => {
    getCarById(req.params.id)
        .then(auction => {
            if (!auction) return res.status(404).json({ error: "Auction not found" });
            res.json(auction);
        })
        .catch(next);
});
app.post("/api/create-user", async (req: Request, res: Response) => {
  try {
    const user = new User(req.body.name, req.body.email);
    const createdUser = await createUser(user);
    res
      .status(201)
      .json({ user: createdUser });
  } catch (error) {
    res
      .status(400)
      .json({
        error: error instanceof Error ? error.message : "Failed to create user",
      });
  }
});

app.post("/api/create-bid", async (req: Request, res: Response) => {
  try {
    const bid = new Bid(req.body.auctionId, req.body.name, req.body.amount);
    const createdBid = await createBid(bid);
    io.to(bid.auctionId).emit("new-bid", createdBid);
    res.status(201).json(createdBid);
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Failed to create bid",
    });
  }
});

app.get("/api/bids/:auctionId", async (req: Request, res: Response) => {
  const bids = await getBidByAuctionId(req.params.auctionId);
  res.json(bids);
});

const PORT = process.env.PORT || 3001;
CreateTableIfDontExist()
  .then(() => initializeDatabase())
  .then(() => {
    server.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  })
  .catch((error) => {
    console.error("Startup failed:", error);
    process.exit(1);
  });
