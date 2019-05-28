import { HealthStatusHolder, HealthStatus } from './interfaces/StatusEffects';
import * as Immutable from 'immutable';
import { GameObject } from './interfaces/GameObject';
import { HealthInt } from './interfaces/Health';
export declare type PersonParams = {
  name: string;
  hp: number;
};
declare const Person_base: Immutable.Record.Class;
export declare class Person extends Person_base
  implements GameObject, HealthInt, HealthStatusHolder {
  hp: number;
  _id: number;
  name: string;
  symbol: string;
  healthStatuses: Immutable.Set<HealthStatus>;
  constructor(params: PersonParams);
  asString(): string;
}
