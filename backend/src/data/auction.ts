import { IAuction, IBid } from './types';

export class Auction implements IAuction {
    public title: string;
    public description: string = '';
    public currentPrice: number;
    public imageUrl: string = '';
    public endTime: Date;
    public status: 'active' | 'ended' = 'active';
    public createdAt: Date = new Date();
    public category: 'luxury' | 'sport' | 'classic' | 'electric' | 'suv' = 'luxury';
    public bids: IBid[] = [];

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