export interface Auction {
    id: string;
    title: string;
    description: string;
    startingPrice: number;
    currentPrice: number;
    imageUrl: string;
    endTime: Date;
    status: 'active' | 'ended';
    createdAt: Date;
    category: 'luxury' | 'sport' | 'classic' | 'electric' | 'suv';
    bids: Array<{
        id: string;
        auctionId: string;
        userId: string;
        amount: number;
        timestamp: Date;
    }>;
}