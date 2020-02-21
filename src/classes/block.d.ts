import { GameObject } from "./interfaces/GameObject";
export declare type BlockageParams = {
    name: string;
    _id?: string;
    symbol?: string;
};
export declare class Blockage implements GameObject {
    symbol: any;
    _id: string;
    name: string;
    constructor(params: BlockageParams);
    asString(): string;
}
