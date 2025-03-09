import { Bid } from './Bid';

export class Auction {
    public title: string;
    public description: string = '';
    public currentPrice: number;
    public imageUrl: string = '';
    public endTime: Date;
    public status: 'active' | 'ended' = 'active';
    public createdAt: Date = new Date();
    public category: 'luxury' | 'sport' | 'classic' | 'electric' | 'suv'|'family' = 'luxury';
    public bids: Bid[] = [];

    constructor(
        public id: string,
        name: string,
        public startingPrice: number
    ) {
        this.title = name;
        this.currentPrice = startingPrice;
        this.endTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 dagar från nu
    }
}

