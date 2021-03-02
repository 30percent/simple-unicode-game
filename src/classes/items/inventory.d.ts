import { Stringy } from "../interfaces/GameObject";
import { BaseItem } from './item';
declare type ItemHolder = {
    [id: string]: {
        readonly object: BaseItem;
        readonly amount: number;
    };
};
export declare class Inventory implements Stringy {
    readonly items: ItemHolder;
    readonly activeItem: string;
    constructor();
    addItem(item: BaseItem): Inventory;
    removeItem(item: BaseItem): Inventory;
    setItemActive(item: BaseItem | string): import("immer/dist/types-external").Produced<this, import("immer").Draft<this>>;
    asString(): string;
}
export {};
