// import { Record } from "immutable";
import { HealthStatusHolder, HealthStatus } from "./interfaces/StatusEffects";
import * as Immutable from "immutable";
import * as cuid from "cuid";
import * as fp from "lodash/fp";
import { Stringy, GameObject } from "./interfaces/GameObject";
import { HealthInt } from "./interfaces/Health";

export type PersonParams = {
  name: string;
  hp: number;
  symbol?: string;
};

export class Person
  extends Immutable.Record({
    hp: 0,
    _id: 0,
    name: "",
    symbol: "o",
    healthStatuses: Immutable.Set<HealthStatus>()
  })
  implements GameObject, HealthInt, HealthStatusHolder {
  symbol: any;
  hp: number;
  _id: number;
  name: string;
  healthStatuses: Immutable.Set<HealthStatus>;

  constructor(params: PersonParams) {
    let toSup = fp.assign(
      {
        _id: cuid(),
        healthStatus: Immutable.Set<HealthStatus>()
      },
      params
    );
    super(toSup);
  }
  asString() {
    return `${this.name}. Health: ${this.hp}`;
  }
}
