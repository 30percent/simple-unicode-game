import * as fp from 'lodash/fp';
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

let margWander: (loc: Location) => Location;

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
  let userPerson = getObjectByPred(oldState, (obj: GameObject) => obj.symbol === 'J');
  newState = moveUser(newState, userPerson._id);
  oldState.groundObjects.forEach((object: GameObject) => {
    let newO = object;
    if (object instanceof Person) {
      if (isHealthStatusHolder(object)) {
        newO = healthProgress(object);
      }
    }
    // routine example
    if (object instanceof Location) {
      if (object instanceof Location && fp.isEqual(object._id, locationId)) {
        // TODO: This should "managed" by state...kind of
        if (object.positionObjectAt('delilah') != null) {
          newO = pathSpeed(object, oldState.groundObjects.get('delilah') as Person, getVectorDirection(object.objects.get('margaret'), Direction.Up));
        }
      }
      if (object.combat_zone && object._id === locationId) {
        let peopleInLoc = object.objects;
        fp.forEach((o) => {
          newState = doDamage(newState, o[0]);
        }, Array.from(peopleInLoc))
      }
    }
    if (newO !== object) {
      newState.groundObjects.set(newO._id, newO);
    }
  });
  // let userPerson = fp.find((obj) => obj.symbol === 'J', Array.from(newState))._id;
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
