import { Record } from 'immutable';
import * as fp from 'lodash/fp';
import { GameObject } from './GameObject';

export interface HealthInt {
  hp: number;
  maxHp: number;
}

export function modifyHealth<T extends HealthInt>(obj: T, num: number): T {
  return fp.set('hp', num, obj);
}
export function isDead(obj: HealthInt): boolean {
  return obj.hp <= 0;
}

export function isHealth(obj: any): obj is HealthInt {
  return fp.hasIn('hp', obj) && fp.hasIn('maxHp', obj);
}
