import * as Promise from 'bluebird';
import { Set } from 'immutable';
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
import { Direction, Location, Vector } from './classes/location';
import { Person } from './classes/person';
import { createPaceFoo, createClampedWander } from './classes/routines/pace';
import { tickFoo } from './classes/routines/tick';
import { getCurrentLocation } from './classes/state';
import { isNil } from 'lodash';

function __getId(object: GameObject | number): number {
  return fp.isObject(object) ? (object as GameObject)._id : (object as number);
}

let paceRight = createPaceFoo(4, Direction.Right);
let margWander: (loc: Location) => Location;
export function init(): Set<GameObject> {
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
  return Set<GameObject>([home, jack, mary, marg, childRoom]);
}

// Replace with Generator at earliest convenience
export function startTicking(
  state: Set<GameObject>,
  curLocation: Location,
  toCall: (state: Set<GameObject>) => any,
) {
  let inState = state;
  tickFoo(0, 500, () => {
    return Promise.method((input) => {
      inState = tick(inState, curLocation._id);
      return inState;
    })(null).then(toCall);
  });
}

function tick(oldState: Set<GameObject>, locationId: number): Set<GameObject> {
  let newStateImm = oldState;
  return newStateImm.withMutations((newState) => {
    newState.forEach((object: GameObject) => {
      let newO = object;
      if (isHealthStatusHolder(object)) {
        newO = execHealthStatus(object);
      }
      if (object instanceof Location && fp.isEqual(object._id, locationId)) {
        let mary = newState.find((obj) => obj.symbol === 'M');
        newO = paceRight(object, mary._id); // just an example...
      }
      if (object instanceof Location && !isNil(margWander)) {
        // newO = margWander(object);
      }
      if (newO !== object) {
        newState = newState.remove(object).add(newO);
      }
    });
    let userPerson = newState.find((obj) => obj.symbol === 'J')._id;
    return moveUser(newState, userPerson);
  });
}

let toMove: Direction = null;
export function moveYou(direction: Direction) {
  if (direction) toMove = direction;
}
function moveUser(oldState: Set<GameObject>, userId: number) {
  let newState = oldState;
  let locationId = getCurrentLocation(newState, userId)._id;
  if (toMove !== null) {
    let curLocation = newState.find(
      (obj) => obj._id === locationId,
    ) as Location;
    let locations = locationMoveDirectionWithEntry(
      newState,
      curLocation,
      userId,
      toMove,
      1,
    );
    if (locations.firstLoc) {
      newState = newState
        .delete(newState.find((obj) => obj._id === locations.firstLoc._id))
        .add(locations.firstLoc);
    }
    if (locations.secondLoc) {
      newState = newState
        .delete(newState.find(
          (obj) => obj._id === locations.secondLoc._id,
        ) as Location)
        .add(locations.secondLoc);
    }
    toMove = null;
  }
  return newState;
}

function clearStdout() {
  // undefined in
  process.stdout.write('\x1B[2J\x1B[0f');
}
