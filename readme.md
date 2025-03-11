# Assignment
* gör så auktionssajten funkar (med websockets)

## Backend
* smart roomhantering har ni i servern och client (bortkommenterat)

#### socket connection
```
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    },
    pingTimeout: 60000,
    transports: ['websocket', 'polling']
});

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
```

## Frontend
* room.ts

 Auction via fetch -

socket.on('new-bid', (bid) => {
    if (!currentAuction || bid.auctionId !== currentAuction.id) return;
    if (!bid.createdAt) {
        bid.createdAt = new Date().toISOString();
    }
    currentAuction.currentPrice = bid.amount;
    displayAuctionDetails();

    const bidElement = document.createElement('div');
    bidElement.className = 'bid-item';
    bidElement.innerHTML = `
        <span class="bid-user">${bid.name}</span>
        <span class="bid-amount">${Number(bid.amount).toLocaleString()} kr</span>
        <span class="bid-time">${formatDate(new Date(bid.createdAt))}</span>
    `;
    
    const header = bidContainer.querySelector('h3');
    if (header) {
        bidContainer.insertBefore(bidElement, header.nextSibling);
    } else {
        bidContainer.insertBefore(bidElement, bidContainer.firstChild);
    }

    bidAmountInput.min = (bid.amount + 1000).toString();
    bidAmountInput.placeholder = `Minst ${(bid.amount + 1000).toLocaleString()} kr`;
});


* socket.ts 

  websocket 

export const socket = io("http://localhost:3001", {
  withCredentials: true,
  transports: ['websocket', 'polling']
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
}); 

##Start Page

![foto](./startPage.png)


##Bid Page

![foto](./bidPage.png)
