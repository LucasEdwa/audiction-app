export class Bid {
    public createdAt: Date = new Date();

    constructor(
        public auctionId: string,
        public name: string,
        public amount: number,
        public id?: number
    ) {}
}
