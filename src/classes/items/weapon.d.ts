import { BaseItem, BaseItemParams } from "./item";
export declare type WeaponParams = {
    range: number;
    damage: number;
} & BaseItemParams;
export declare class Weapon extends BaseItem {
    range: number;
    damage: number;
    constructor({ range, damage, ...params }: WeaponParams);
    asString(): string;
}
