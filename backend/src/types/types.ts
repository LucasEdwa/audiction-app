// Auction interfaces
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
    category: 'luxury' | 'sport' | 'classic' | 'electric' | 'suv' | 'family';
    bids: Bid[];
}

// Bid interface
export interface Bid {
    id?: number;
    auctionId: string;
    name: string;
    amount: number;
    createdAt?: Date;
}

// User interface
export interface User {
    id?: number;
    name: string;
    email: string;
    bids?: Bid[];
}

// Car data interface
export interface CarData {
    id: string;
    name: string;
    basePrice: number;
    description: string;
    imageUrl: string;
    category: 'luxury' | 'sport' | 'classic' | 'electric' | 'suv' | 'family';
} 