
export class Auction{
    constructor(public id:string, public name:string, public minprice:number){

    }
}
export interface IBid{
    userName: string,
    bid: number,
    bidDate: Date
}