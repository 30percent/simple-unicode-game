import { GameObject } from "./interfaces/GameObject";
import * as fp from 'lodash/fp';
import { find } from 'lodash';
import { Place } from "./location";
import { Inventory } from "./items/inventory";
import produce from "immer";
// export type State = Map<string, GameObject>;
export type InventoryState = Map<string, Inventory>;

export type Routine = (state: State) => State;
export class State {
  groundObjects: Map<string, GameObject>;
  inventories: Map<string, Inventory>;
  routines: Routine[];
  userId: string = 'jack';
  // add Routines
  constructor() {
    this.groundObjects = new Map();
    this.inventories = new Map();
    this.routines = [];
  }

  addRoutine(routine: Routine) {
    this.routines.push(routine);
    return this;
  } 

  addRoutines(routines: Routine[]) {
    this.routines = this.routines.concat(routines);
    return this;
  }
}

export function getObjectById(state: State, id: string) : GameObject {
  return state.groundObjects.get(id);
}

export function getCurrentLocation(state: State, personId: string): Place | null {
  for(let obj of state.groundObjects.values()) {
    if (obj instanceof Place && obj.objects.has(personId)) {
      return obj as Place;
    }
  }
  return null;
};

export function getObjectByPred(state: State, predicate: (obj: GameObject) => boolean): GameObject | null {
  return fp.find(predicate, Array.from(state.groundObjects.values()));
}

export function locationContaining(state: State, predicate: (loc: Place) => boolean): Place | null {
  for(let obj of state.groundObjects.values()) {
    if (obj instanceof Place && predicate(obj)) {
      return obj as Place;
    }
  }
  return null;
}

export function progressRoutines(state: State): State {
  // let newState = fp.clone(state);
  return produce(state, (newState) => {
    newState.routines.forEach((act) => {
      newState = act(newState);
    });
    return newState;
  })
}