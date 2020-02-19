import * as fp from 'lodash/fp';

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

function __getId(object: GameObject | string): string {
  return fp.isObject(object) ? (object as GameObject)._id : (object as string);
}

let paceRight = createPaceFoo(4, Direction.Right);
let margWander: (loc: Location) => Location;
export function init(): Map<string, GameObject> {
  let marg = new Person({ name: 'Margaret', hp: 10, symbol: 'G' });
  let mary = new Person({ name: 'Mary', hp: 10, symbol: 'M' });
  let childRoom = new Location({
    name: 'Bedroom',
    roomLimit: new Vector({ x: 4, y: 4 }),
    symbol: '\u0298',
  });
  let jack = addHealthStatus(
    modifyHealth(new Person({ name: 'Jack', hp: 10, symbol: 'J' }), -2),
    HealthStatus.Poison,
  );
  let home = new Location({
    name: 'Home',
    roomLimit: new Vector({ x: 10, y: 10 }),
  });
  // add to locations
  home = home
    .addObject(new Vector({ x: 0, y: 3 }), mary._id)
    .addObject(new Vector({ x: 0, y: 4 }), jack._id)
    .addObject(new Vector({ x: 3, y: 2 }), marg._id)
    .addObject(new Vector({ x: 5, y: 7 }), childRoom._id);

  childRoom = childRoom.addObject(new Vector({ x: 0, y: 2 }), home._id);
  // margWander = createClampedWander(home, 2, marg._id);
  const retMap = new Map<string, GameObject>();
  [home, jack, mary, marg, childRoom].map((v) => {
    retMap.set(v._id, v);
  })
  return retMap;
}

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
  let count = 100;
  let time = 1000;
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
      newO = execHealthStatus(object);
    }
    if (object instanceof Location && fp.isEqual(object._id, locationId)) {
      let mary = fp.find((obj) => obj.symbol === 'M', Array.from(newState.values()));
      let maryLoc = getCurrentLocation(oldState, mary._id);
      newO = paceRight(maryLoc, mary._id); // just an example...
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
