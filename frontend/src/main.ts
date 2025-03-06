import { Auction } from "./data/auction";

let auctionGrid = document.getElementById("auctionGrid") as HTMLDivElement;
let auctions: Auction[] = []; // Spara alla auktioner

// Visa laddningsindikator
function showLoading() {
    auctionGrid.innerHTML = `
        <div class="loading">
            <p>Laddar auktioner...</p>
        </div>
    `;
}

// Visa felmeddelande
function showError(message: string) {
    auctionGrid.innerHTML = `
        <div class="error">
            <p>${message}</p>
            <button onclick="window.location.reload()" class="btn-primary">Försök igen</button>
        </div>
    `;
}

// Hämta alla auktioner och visa dem
async function getAuctions() {
    try {
        showLoading();
        const response = await fetch('http://localhost:3000/api/auctions');
        if (!response.ok) {
            throw new Error('Kunde inte hämta auktioner');
        }
        const data = await response.json();
        console.log('Hämtade auktioner:', data); // Debug-loggning
        auctions = data;
        displayAuctions(auctions);
    } catch (error) {
        console.error('Fel vid hämtning av auktioner:', error);
        showError('Kunde inte ladda auktionerna. Vänligen försök igen.');
    }
}

// Visa auktioner baserat på filter
function displayAuctions(auctionsToShow: Auction[]) {
    if (auctionsToShow.length === 0) {
        auctionGrid.innerHTML = `
            <div class="no-results">
                <p>Inga auktioner hittades</p>
            </div>
        `;
        return;
    }

    auctionGrid.innerHTML = ''; // Rensa griden
    auctionsToShow.forEach(auction => {
        auctionGrid.appendChild(createAuctionCard(auction));
    });
}

// Skapa ett kort för en auktion
function createAuctionCard(auction: Auction): HTMLDivElement {
    const card = document.createElement("div");
    card.className = "product-card";
    card.dataset.category = auction.category;
    
    // Beräkna tid kvar
    const timeLeft = getTimeLeft(auction.endTime);
    
    card.innerHTML = `
        <img src="${auction.imageUrl}" alt="${auction.title}" class="product-image">
        <div class="product-info">
            <h2 class="product-title">${auction.title}</h2>
            <p class="product-description">${auction.description}</p>
            <div class="product-price">${auction.currentPrice.toLocaleString()} kr</div>
            <div class="product-footer">
                <span class="time-left">${timeLeft}</span>
                <a href="/oneauction.html?room=${auction.id}" class="btn-primary">Lägg bud</a>
            </div>
        </div>
    `;

    return card;
}

// Beräkna och formatera tid kvar
function getTimeLeft(endTime: Date): string {
    const end = new Date(endTime);
    const now = new Date();
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) {
        return "Auktionen är avslutad";
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
        return `${days} dagar kvar`;
    } else if (hours > 0) {
        return `${hours} timmar kvar`;
    } else {
        return "Mindre än en timme kvar";
    }
}

// Hantera filtrering
document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const filterBtn = e.target as HTMLButtonElement;
        const filter = filterBtn.dataset.filter;

        // Uppdatera aktiv knapp
        document.querySelectorAll('.filter-btn').forEach(btn => 
            btn.classList.remove('active'));
        filterBtn.classList.add('active');

        // Filtrera auktioner
        if (filter === 'all') {
            displayAuctions(auctions);
        } else {
            const filteredAuctions = auctions.filter(auction => 
                auction.category === filter
            );
            displayAuctions(filteredAuctions);
        }
    });
});

// Starta applikationen
getAuctions();

export function createBidById(auction: Auction): HTMLTableRowElement {
    let bidContainer = document.getElementById("bidContainer") as HTMLTableSectionElement;
    let row = document.createElement("tr");
    row.innerHTML = `
        <td>
            <img src="${auction.imageUrl}" alt="${auction.title}" style="width: 150px; height: auto;">
        </td>
        <td>
            <h2>${auction.title}</h2>
            <p>${auction.description}</p>
            <p>Startpris: ${auction.startingPrice.toLocaleString()} kr</p>
            <p>Nuvarande pris: ${auction.currentPrice.toLocaleString()} kr</p>
        </td>
        <td>
            <input type="number" id="bidAmount" min="${auction.currentPrice + 1000}" step="1000" placeholder="Ditt bud">
            <button onclick="placeBid('${auction.id}')">Lägg bud</button>
        </td>
    `;
    bidContainer.appendChild(row);
    return row;
}

export function getAuctionById(id: string) {
    fetch(`http://localhost:3000/api/auctions/${id}`)
    .then(response => response.json())
    .then((auction: Auction) => {
        createBidById(auction);
    });
}