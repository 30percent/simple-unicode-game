import * as fp from 'lodash/fp';
import * as _ from 'lodash';
import { doDamage } from "./classes/routines/combat";
import { Blockage } from "./classes/block";

import { locationMoveDirectionWithEntry } from './classes/enhancements/location-enhancements';
import { GameObject } from './classes/interfaces/GameObject';
import { modifyHealth } from './classes/interfaces/Health';
import {
  addHealthStatus,
  execHealthStatus,
  HealthStatus,
  isHealthStatusHolder,
} from './classes/interfaces/StatusEffects';
import { Location, Vector } from './classes/location';
import { Person } from './classes/person';
import { createPaceFoo, createClampedWander } from './classes/routines/pace';
import { tickFoo } from './classes/routines/tick';
import { getCurrentLocation, locationContaining, getObjectByPred, State } from './classes/state';
import { isNil, find, noop } from 'lodash';
import { Direction } from './classes/structs/Direction';
import { getVectorDirection } from './classes/enhancements/vector-enhancements';
import { healthProgress, pathSpeed } from './classes/routines/interval';
import { Weapon } from './classes/items/weapon';
import produce from 'immer';
import { findMapValue } from './utils/mapUtils';

// Replace with Generator at earliest convenience
export function startTicking(
  state: State,
  curLocation: Location,
  toCall: (state: State) => any
) {
  let count = 0;
  let time = 100;
  let iter = 0;
  let lastState = state;
  let lastLoc = curLocation;
  let interval: any;
  function _next() {
    iter++;
    lastState = tick(lastState, lastLoc._id);
    toCall(lastState);
    if (count > 0 && iter >= count) {
      clearInterval(interval);
    }
    console.log(`Ran tick: ${iter}/${count}`)
  }
  interval = setInterval(_next, time);
  return interval;
}

export function createSampleRoutines(
  state: State
): State {
  let routines = [
    (state: State) => {
      // user movement
      // return produce(state, (draft) => {
        let userPerson = state.groundObjects.get('jack');
        return moveUser(state, userPerson._id);
      // })
    },
    // Path delilah to margaret
    (state: State) => {
      return produce(state, (draft: State) => {
        const del = draft.groundObjects.get('delilah') as Person;
        const location: Location = findMapValue(draft.groundObjects, (go, _id) => go instanceof Location && go.objects.has(del._id)) as Location;
        const newLocation = pathSpeed(location, del, getVectorDirection(location.objects.get('margaret'), Direction.Up));
        draft.groundObjects.set(newLocation._id, newLocation);
        return draft;
      })
    },
    (state: State) => {
      // manage health stati
      return state;
    },
    (state: State): State => {
      let activeLocation: Location = getCurrentLocation(state, 'jack');
      if (activeLocation.combat_zone) {
        let peopleInLoc = activeLocation.objects;
        return produce(state, (newState) => {
          fp.forEach((o) => {
            newState = doDamage(newState, o);
          }, Array.from(peopleInLoc.keys()));
          return newState;
        })
      } else {
        return state;
      }
    }
  ];
  state.routines = state.routines.concat(routines);
  return state;
}

export function manualTick(
  state: State,
  curLocation: Location,
  toCall: (state: State) => any
) {
  const nState = tick(state, curLocation._id);
  toCall(nState);
}

function tick(oldState: State, locationId: string): State {
  let newState = fp.clone(oldState);
  newState.routines.forEach((act) => {
    newState = act(newState);
  });
  return newState;
}

let toMove: Direction = null;
export function moveYou(direction: Direction) {
  if (!isNil(direction)) toMove = direction;
}
function moveUser(oldState: State, userId: string) {
  let newState = fp.clone(oldState);
  let locationId = getCurrentLocation(newState, userId)._id;
  if (toMove !== null) {
    let curLocation = fp.find(
      (obj) => obj._id === locationId,
    Array.from(newState.groundObjects.values())) as Location;
    let locations = locationMoveDirectionWithEntry(
      newState,
      curLocation,
      userId,
      toMove,
      1,
    );
    if (locations.firstLoc) {
      newState.groundObjects.set(locations.firstLoc._id, locations.firstLoc);
    }
    if (locations.secondLoc) {
      newState.groundObjects.set(locations.secondLoc._id, locations.secondLoc);
    }
    toMove = null;
  }
  return newState;
}

function clearStdout() {
  // undefined in
  process.stdout.write('\x1B[2J\x1B[0f');
}
