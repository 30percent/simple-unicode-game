import * as fp from 'lodash/fp';
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
import { getCurrentLocation, locationContaining, getObjectByPred } from './classes/state';
import { isNil, find, noop } from 'lodash';
import { Direction } from './classes/structs/Direction';
import { getVectorDirection } from './classes/enhancements/vector-enhancements';
import { healthProgress, pathSpeed } from './classes/routines/interval';

let margWander: (loc: Location) => Location;

// Replace with Generator at earliest convenience
export function startTicking(
  state: Map<string, GameObject>,
  curLocation: Location,
  toCall: (state: Map<string, GameObject>) => any,
) {
  let inState = state;
  tickFoo(100, 1000, () => {
    const nState = tick(inState, curLocation._id);
    toCall(nState);
  });
}

export function sTick2(
  state: Map<string, GameObject>,
  curLocation: Location,
  toCall: (state: Map<string, GameObject>) => any
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
}

function tick(oldState: Map<string, GameObject>, locationId: string): Map<string, GameObject> {
  let newState = fp.clone(oldState);
  oldState.forEach((object: GameObject) => {
    let newO = object;
    if (isHealthStatusHolder(object)) {
      newO = healthProgress(object);
    }
    if (object instanceof Location && fp.isEqual(object._id, locationId)) {
      newO = pathSpeed(object, oldState.get('delilah') as Person, getVectorDirection(object.objects.get('margaret'), Direction.Up));
      //newO = paceRight(maryLoc, mary._id); // just an example...
      // newO = 
    }
    if (object instanceof Location && !isNil(margWander)) {
      // newO = margWander(object);
    }
    if (newO !== object) {
      newState.set(newO._id, newO);
    }
  });
  let userPerson = getObjectByPred(oldState, (obj: GameObject) => obj.symbol === 'J');
  // let userPerson = fp.find((obj) => obj.symbol === 'J', Array.from(newState))._id;
  return moveUser(newState, userPerson._id);
}

let toMove: Direction = null;
export function moveYou(direction: Direction) {
  if (!isNil(direction)) toMove = direction;
}
function moveUser(oldState: Map<string, GameObject>, userId: string) {
  let newState = fp.clone(oldState);
  let locationId = getCurrentLocation(newState, userId)._id;
  if (toMove !== null) {
    let curLocation = fp.find(
      (obj) => obj._id === locationId,
    Array.from(newState.values())) as Location;
    let locations = locationMoveDirectionWithEntry(
      newState,
      curLocation,
      userId,
      toMove,
      1,
    );
    if (locations.firstLoc) {
      newState.set(locations.firstLoc._id, locations.firstLoc);
    }
    if (locations.secondLoc) {
      newState.set(locations.secondLoc._id, locations.secondLoc);
    }
    toMove = null;
  }
  return newState;
}

function clearStdout() {
  // undefined in
  process.stdout.write('\x1B[2J\x1B[0f');
}
