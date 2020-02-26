import { set } from 'lodash';
export interface HealthInt {
  hp: number;
}

export function modifyHealth<T extends HealthInt>(obj: T, num: number): T {
  return set(obj, 'hp', obj.hp + num);
}

export function isDead(obj: HealthInt) {
  return obj.hp <= 0;
}