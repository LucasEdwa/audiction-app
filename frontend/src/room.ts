import { Auction } from "./data/auction";
import { io } from "socket.io-client";

const socket = io('http://localhost:3000');
let currentAuction: Auction | null = null;

// Hämta auktions-ID från URL
const urlParams = new URLSearchParams(window.location.search);
const auctionId = urlParams.get('room');

// Element references
const auctionDetails = document.getElementById('auctionDetails') as HTMLElement;
const bidContainer = document.getElementById('bidContainer') as HTMLElement;
const userNameInput = document.getElementById('userName') as HTMLInputElement;
const bidAmountInput = document.getElementById('bidAmount') as HTMLInputElement;
const placeBidButton = document.getElementById('placeBidButton') as HTMLButtonElement;

// Hämta och visa auktionsdetaljer
async function getAuctionDetails() {
    try {
        const response = await fetch(`http://localhost:3000/api/auctions/${auctionId}`);
        if (!response.ok) throw new Error('Kunde inte hämta auktionsdetaljer');
        
        currentAuction = await response.json();
        displayAuctionDetails();
        setupBidding();
    } catch (error) {
        console.error('Fel vid hämtning av auktion:', error);
        showError('Kunde inte ladda auktionen');
    }
}

// Visa auktionsdetaljer
function displayAuctionDetails() {
    if (!currentAuction) return;

    const timeLeft = getTimeLeft(currentAuction.endTime);
    
    auctionDetails.innerHTML = `
        <div class="auction-info">
            <div class="auction-main">
                <img src="${currentAuction.imageUrl}" alt="${currentAuction.title}">
                <h2>${currentAuction.title}</h2>
                <div class="auction-description">${currentAuction.description}</div>
            </div>
            <div class="auction-meta">
                <div class="price-info">
                    <div class="current-price">${currentAuction.currentPrice.toLocaleString()} kr</div>
                    <div class="starting-price">Startpris: ${currentAuction.startingPrice.toLocaleString()} kr</div>
                </div>
                <div class="time-left">${timeLeft}</div>
            </div>
        </div>
    `;
}

// Beräkna och formatera tid kvar
function getTimeLeft(endTime: Date): string {
    const end = new Date(endTime);
    const now = new Date();
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return "Auktionen är avslutad";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} dagar kvar`;
    if (hours > 0) return `${hours} timmar kvar`;
    return "Mindre än en timme kvar";
}

// Visa felmeddelande
function showError(message: string) {
    auctionDetails.innerHTML = `
        <div class="error">
            <p>${message}</p>
            <button onclick="window.location.reload()" class="btn-primary">Försök igen</button>
        </div>
    `;
}

// Sätt upp budgivning
function setupBidding() {
    if (!currentAuction) return;

    // Sätt minimum bud
    bidAmountInput.min = (currentAuction.currentPrice + 1000).toString();
    bidAmountInput.placeholder = `Minst ${(currentAuction.currentPrice + 1000).toLocaleString()} kr`;

    // Hantera budgivning
    placeBidButton.addEventListener('click', () => {
        const userName = userNameInput.value.trim();
        const bidAmount = parseInt(bidAmountInput.value);

        if (!userName) {
            alert('Ange ditt namn');
            return;
        }

        if (!bidAmount || bidAmount <= currentAuction!.currentPrice) {
            alert(`Budet måste vara högre än ${currentAuction!.currentPrice.toLocaleString()} kr`);
            return;
        }

        placeBid(userName, bidAmount);
    });
}

// Lägg ett bud
function placeBid(userName: string, amount: number) {
    if (!currentAuction) return;

    const bid = {
        id: Date.now().toString(),
        auctionId: currentAuction.id,
        userId: userName,
        amount: amount,
        timestamp: new Date()
    };

    socket.emit('send-bid', bid);
}

// Lyssna på nya bud
socket.on('bid', (bid: any) => {
    if (!currentAuction || bid.auctionId !== currentAuction.id) return;

    // Uppdatera currentPrice
    currentAuction.currentPrice = bid.amount;
    displayAuctionDetails();

    // Lägg till budet i historiken
    const bidElement = document.createElement('div');
    bidElement.className = 'bid-item';
    bidElement.innerHTML = `
        <span class="bid-user">${bid.userId}</span>
        <span class="bid-amount">${bid.amount.toLocaleString()} kr</span>
        <span class="bid-time">${new Date(bid.timestamp).toLocaleString()}</span>
    `;
    bidContainer.insertBefore(bidElement, bidContainer.firstChild);

    // Uppdatera minimum bud
    bidAmountInput.min = (bid.amount + 1000).toString();
    bidAmountInput.placeholder = `Minst ${(bid.amount + 1000).toLocaleString()} kr`;
});

// Anslut till socket.io room
if (auctionId) {
    socket.emit('user-connected', 'Anonym användare');
    getAuctionDetails();
} else {
    showError('Ingen auktion specificerad');
}
