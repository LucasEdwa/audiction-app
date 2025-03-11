import { Bid, User as IUser } from '../types/types';

export class User implements IUser {
    public bids: Bid[] = [];
    public id?: number;
    
    constructor(
        public name: string,
        public email: string
    ) {}
}
