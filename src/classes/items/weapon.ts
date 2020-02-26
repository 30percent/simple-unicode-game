import { BaseItem, BaseItemParams } from "./item";

export type WeaponParams = {
  range: number;
  damage: number;
} & BaseItemParams;
export class Weapon extends BaseItem {
  range: number;
  damage: number;
  constructor({range, damage, ...params}: WeaponParams) {
    super(params);
    Object.assign(this, {range, damage});
  }

  asString() {
    return `${super.asString()} | D${this.damage} | R${this.range}`;
  }
}