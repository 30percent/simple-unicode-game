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
  _id?: string;
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
        _id: (params._id || cuid()),
        healthStatuses: new Set<HealthStatus>(),
        ...params
      }
    );
  }
  asString() {
    return `${this.name}. Health: ${this.hp}`;
  }
  
  setHealth<T extends HealthStatusHolder>(hp: number): T {
    return fp.set<T>('hp', hp, this);
  }

  removeStatus<T extends HealthStatusHolder>(status: HealthStatus): T {
    let o = fp.clone<T>(this as unknown as T);
    o.healthStatuses.delete(status);
    return o;
  }
}
