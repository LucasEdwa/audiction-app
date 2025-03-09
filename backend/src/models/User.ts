import { IBid } from "../data/types";

export class User {
    public bids: IBid[] = [];  // Default empty array
    public id?: number; // Make id optional since it's set by DB
    
    constructor(
        public name: string,
        public email: string
    ) {}
}
