// import { Record } from "immutable";
import { HealthStatusHolder, HealthStatus } from './interfaces/StatusEffects';
import * as cuid from 'cuid';
import * as fp from 'lodash/fp';
import { assign } from 'lodash';
import { Stringy, GameObject } from './interfaces/GameObject';
import { HealthInt } from './interfaces/Health';

export type PersonParams = {
  name: string;
  hp: number;
  maxHp: number;
  symbol?: string;
};

export class Person implements GameObject, HealthInt, HealthStatusHolder {
  symbol: any;
  hp: number;
  maxHp: number;
  _id: number;
  name: string;
  solid: boolean;
  healthStatuses: Set<HealthStatus>;

  constructor(params: PersonParams) {
    let toSup = fp.assign(
      {
        _id: cuid(),
        healthStatuses: new Set<HealthStatus>(),
      },
      params,
    );
    Object.assign(this, toSup);
  }
  asString() {
    return `${this.name}. Health: ${this.hp}. Statuses: ${Array.from(
      this.healthStatuses.values(),
    )}`;
  }
}
