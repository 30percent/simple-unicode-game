import { HealthStatusHolder, HealthStatus } from "./interfaces/StatusEffects";
import * as cuid from "cuid";
import * as fp from "lodash/fp";
import { assign } from "lodash";
import { Stringy, GameObject } from "./interfaces/GameObject";
import { HealthInt } from "./interfaces/Health";

export type PersonParams = {
  name: string;
  hp: number;
  symbol?: string;
};

export class Person
  implements GameObject, HealthInt, HealthStatusHolder {
  symbol: any;
  hp: number;
  _id: string;
  name: string;
  healthStatuses: Set<HealthStatus>;

  constructor(params: PersonParams) {
    assign<Person, Partial<Person>>(
      this,
      {
        _id: cuid(),
        healthStatuses: new Set<HealthStatus>(),
        ...params
      }
    );
  }
  asString() {
    return `${this.name}. Health: ${this.hp}`;
  }
}
