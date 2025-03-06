import { IAuction, IBid } from './types';

export class Auction implements IAuction {
    public title: string;
    public description: string;
    public currentPrice: number;
    public imageUrl: string;
    public endTime: Date;
    public status: 'active' | 'ended';
    public createdAt: Date;
    public bids: IBid[];

    constructor(
        public id: string, 
        name: string, 
        public startingPrice: number
    ) {
        this.title = name;
        this.description = '';
        this.currentPrice = startingPrice;
        this.imageUrl = ''; 
        this.endTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        this.status = 'active';
        this.createdAt = new Date();
        this.bids = [];
    }
}