import { Stringy } from "./../interfaces/GameObject";
export declare type BaseItemParams = {
    _id: string;
    name: string;
};
export declare class BaseItem implements Stringy {
    readonly _id: string;
    readonly name: string;
    constructor(params: BaseItemParams);
    asString(): string;
}
