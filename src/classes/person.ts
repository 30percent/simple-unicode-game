import { HealthStatusHolder, HealthStatus } from "./interfaces/StatusEffects";
import * as cuid from "cuid";
import * as fp from "lodash/fp";
import { assign } from "lodash";
import { GameObject } from "./interfaces/GameObject";
import { HealthInt } from "./interfaces/Health";
import produce from "immer";

export type PersonParams = {
  name: string;
  hp: number;
  symbol?: string;
  _id?: string;
};

export class Person
  implements GameObject, HealthInt {
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
  
  setHealth(hp: number): Person {
    return produce(this, (draft: Person) => {
      draft.hp = hp;
      return draft;
    })
  }

  removeStatus(status: HealthStatus): Person {
    return produce(this, (draft: Person) => {
      draft.healthStatuses.delete(status);
      return draft;
    })
  }

  addHealthStatus(status: HealthStatus): Person {
    return produce(this, (draft: Person) => {
      draft.healthStatuses.add(status);
      return draft;
    })
  }
}
