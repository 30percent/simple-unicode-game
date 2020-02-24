import { GameObject } from "./interfaces/GameObject";
import * as fp from 'lodash/fp';
import { find } from 'lodash';
import { Location } from "./location";
import { Inventory } from "./items/inventory";
// export type State = Map<string, GameObject>;
export type InventoryState = Map<string, Inventory>;

export class State {
  groundObjects: Map<string, GameObject>;
  inventories: Map<string, Inventory>;
  // add Routines
  constructor() {
    this.groundObjects = new Map();
    this.inventories = new Map();
  }
}

export function getObjectById(state: State, id: string) : GameObject {
  return state.groundObjects.get(id);
}

export function getCurrentLocation(state: State, personId: string): Location | null {
  for(let obj of state.groundObjects.values()) {
    if (obj instanceof Location && obj.objects.has(personId)) {
      return obj as Location;
    }
  }
  return null;
};

export function getObjectByPred(state: State, predicate: (obj: GameObject) => boolean): GameObject | null {
  return fp.find(predicate, Array.from(state.groundObjects.values()));
}

export function locationContaining(state: State, predicate: (loc: Location) => boolean): Location | null {
  for(let obj of state.groundObjects.values()) {
    if (obj instanceof Location && predicate(obj)) {
      return obj as Location;
    }
  }
  return null;
}