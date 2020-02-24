import { BaseItem, BaseItemParams } from "./item";

export type WeaponParams = {
  range: number;
  damage: number;
} & BaseItemParams;
export class Weapon extends BaseItem {
  range: number;
  damage: number;
  active: boolean = false;
  constructor({range, damage, ...params}: WeaponParams) {
    super(params);
    Object.assign(this, {range, damage});
  }

  setActive(a: boolean) {
    this.active = a;
    return this;
  }

  asString() {
    return `${super.asString()} | D${this.damage}`;
  }
}