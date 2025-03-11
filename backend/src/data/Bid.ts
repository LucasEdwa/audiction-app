import { Bid as IBid } from '../types/types';

export class Bid implements IBid {
    public id?: number;
    public createdAt?: Date;

    constructor(
        public auctionId: string,
        public name: string,
        public amount: number
    ) {}
}
