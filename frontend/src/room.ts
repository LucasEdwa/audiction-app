import { Auction } from "./data/auction";
import { socket } from './socket';
import { Bid } from "./data/auction";
const params = new URLSearchParams(window.location.search);
const auctionId = params.get('room');

let currentAuction: Auction | null = null;

const auctionDetails = document.getElementById('auctionDetails') as HTMLElement;
const bidContainer = document.getElementById('bidContainer') as HTMLElement;
const userNameInput = document.getElementById('userName') as HTMLInputElement;
const bidAmountInput = document.getElementById('bidAmount') as HTMLInputElement;
const placeBidButton = document.getElementById('placeBidButton') as HTMLButtonElement;

function formatDate(dateString: string | Date): string {
    const date = dateString instanceof Date ? dateString : new Date(dateString);
    if (isNaN(date.getTime())) {
        return 'Invalid date';
    }
    return date.toLocaleString('sv-SE', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Add this function to fetch bid history
async function getBidHistory(auctionId: Bid['auctionId']) {
    try {
        const response = await fetch(`http://localhost:3001/api/bids/${auctionId}`);
        if (!response.ok) throw new Error('Failed to fetch bid history');
        const bids = await response.json();
        
        bidContainer.innerHTML = '<h3>Budhistorik</h3>';
        
        bids.reverse().forEach((bid: Bid) => {
            const bidElement = document.createElement('div');
            bidElement.className = 'bid-item';
            bidElement.innerHTML = `
                <span class="bid-user">${bid.name}</span>
                <span class="bid-amount">${Number(bid.amount).toLocaleString()} kr</span>
                <span class="bid-time">${formatDate(bid.createdAt)}</span>
            `;
            bidContainer.appendChild(bidElement);
        });
    } catch (error) {
        console.error('Error fetching bid history:', error);
        bidContainer.innerHTML = '<p class="error">Kunde inte ladda budhistorik</p>';
    }
}

async function getAuctionDetails() {
    
    try {
        const response = await fetch(`http://localhost:3001/api/auctions/${auctionId}`);
        if (!response.ok) throw new Error('Kunde inte hämta auktionsdetaljer');
        
        currentAuction = await response.json();
        displayAuctionDetails();
        setupBidding();
        await getBidHistory(auctionId!);
    } catch (error) {
        console.error('Fel vid hämtning av auktion:', error);
        showError('Kunde inte ladda auktionen');
    }
}

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

function showError(message: string) {
    auctionDetails.innerHTML = `
        <div class="error">
            <p>${message}</p>
            <button onclick="window.location.reload()" class="btn-primary">Försök igen</button>
        </div>
    `;
}

function setupBidding() {
    if (!currentAuction) return;

    bidAmountInput.min = (currentAuction.currentPrice + 1000).toString();
    bidAmountInput.placeholder = `Minst ${(currentAuction.currentPrice + 1000).toLocaleString()} kr`;

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

async function placeBid(userName: string, amount: number) {
    if (!currentAuction) return;
    try {
        const response = await fetch(`http://localhost:3001/api/create-bid`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                auctionId: currentAuction.id, 
                name: userName, 
                amount: amount 
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to place bid');
        }

        // Reset input fields after successful bid
        bidAmountInput.value = '';
        userNameInput.value = '';
        
    } catch (error) {
        console.error('Error placing bid:', error);
        alert(error instanceof Error ? error.message : 'Failed to place bid');
    }
}

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

if (auctionId) {
    try {
        socket.emit('join-auction', auctionId);
        
        getAuctionDetails();

    } catch (error) {
        console.error('Error in room setup:', error);
    }
} else {
    console.error('No auction ID provided');
}
