import { User as IUser } from '../types/types';


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
        this.endTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }
}

export interface Bid {
    createdAt: Date;
    auctionId: string;
    name: string;
    amount: number;
    id?: number;
}
import { Bid as IBid } from '../types/types';

export class Bid implements IBid {
    public id?: number;
    public createdAt: Date = new Date();  // Initialize with current date

    constructor(
        public auctionId: string,
        public name: string,
        public amount: number
    ) {}
}
export interface User {
    id?: number;
    name: string;
    email: string;
    bids: Bid[];
}

export interface CarData {
    id: string;
    name: string;
    basePrice: number;
    description: string;
    imageUrl: string;
    category: 'luxury' | 'sport' | 'classic' | 'electric' | 'suv' | 'family';
} 