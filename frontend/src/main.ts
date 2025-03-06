import { Auction } from "./data/auction";



let auctionRows = document.getElementById("auctionRows") as HTMLTableSectionElement;

function getAuctions(){
    fetch('http://localhost:3000/api/auctions')
    .then(response => response.json())
    .then(data => {
        data.forEach((auction:Auction) => {
          auctionRows.appendChild(createAuctionRow(auction));            
        });
    });
}


getAuctions();



function createAuctionRow(auction: Auction): HTMLTableRowElement {
    let row = document.createElement("tr");
    row.innerHTML = `
        <td>${auction.id}</td>
        <td>${auction.title}</td>
        <td><a href="/oneauction.html?room=${auction.id}" class="btn btn-primary">Bid</a></td>
    `;
    return row;
  
}
export function createBidById(auction: Auction): HTMLTableRowElement {
    let bidContainer = document.getElementById("bidContainer") as HTMLTableSectionElement;
    let row = document.createElement("tr");
    row.innerHTML = `
        <td>${auction.id}</td>
        <td>${auction.title}</td>
        <td>${auction.minprice}</td>
        <form>
            <div class="form-group">
                <label for="bidAmount">Bid amount</label>
                <input type="number" class="form-control" id="bidAmount" name="bidAmount">
            </div>
            <div class="form-group">
                <label for="bidderName">Your name</label>
                <input type="text" class="form-control" id="bidderName" name="bidderName">
            </div>
            <button type="submit" class="btn btn-primary">Bid</button>
        </form>
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