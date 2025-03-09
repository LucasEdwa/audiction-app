export interface IAuction {
    id: string;
    title: string;
    description: string;
    startingPrice: number;
    currentPrice: number;
    imageUrl: string;
    endTime: Date;
    status: 'active' | 'ended';
    createdAt: Date;
    category: 'luxury' | 'sport' | 'classic' | 'electric' | 'suv' | 'family';
    bids: IBid[];
}

export interface IBid {
    id: string;
    auctionId: string;
    userId: string;
    amount: number;
    timestamp: Date;
}

export interface IUser {
    id: string;
    name: string;
    email: string;
} 