export interface Stringy {
    asString(): string;
}
export interface GameObject extends Stringy {
    _id: string;
    symbol: String;
}
export declare class DummyObject implements GameObject {
    _id: string;
    symbol: String;
    asString(): string;
    constructor();
}
