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
import { Direction, Location, Vector, vectEqual } from './classes/location';
import { Person } from './classes/person';
import { createPaceFoo } from './classes/routines/pace';
import { tickFoo } from './classes/routines/tick';
import { getCurrentLocation, getObjectById } from './classes/state';
import { Furniture } from './classes/furniture';

function __getId(object: GameObject | number): number {
  return fp.isObject(object) ? (object as GameObject)._id : (object as number);
}

let paceRight = createPaceFoo(4, Direction.Right);
export function init(): Set<GameObject> {
  let marg = new Person({ name: 'Margaret', hp: 10 });
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
  let bed = new Furniture({
    name: 'Bed',
    symbol: '\u229f',
    effect: (object: GameObject) => {
      if (object instanceof Person) {
        return object.update('hp', (hp: number) => hp + 1) as Person;
      }
      return object;
    },
  });
  // add to locations
  home = home
    .addObject(new Vector({ x: 0, y: 3 }), mary._id)
    .addObject(new Vector({ x: 0, y: 4 }), jack._id)
    .addObject(new Vector({ x: 5, y: 7 }), childRoom._id);

  childRoom = childRoom
    .addObject(new Vector({ x: 0, y: 2 }), home._id)
    .addObject(new Vector({ x: 3, y: 2 }), bed._id);

  return Set<GameObject>([home, jack, mary, marg, childRoom, bed]);
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
      if (object instanceof Person) {
        //currently handling furniture by person, but this could change
        let loc = getCurrentLocation(newState, object._id);
        if (loc) {
          let pointInLoc = loc.objects.get(object._id);
          let furnId = loc.objects.findKey(
            (vect: Vector, id: number) =>
              id !== object._id && vectEqual(vect, pointInLoc),
          );
          let furn = getObjectById(newState, furnId);
          if (furn instanceof Furniture) {
            newO = furn.effect(object);
          }
        }
      }
      if (object instanceof Location) {
        if (fp.isEqual(object._id, locationId)) {
          let mary = newState.find((obj) => obj.symbol === 'M');
          newO = paceRight(object, mary._id); // just an example...
        }
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
  if (fp.isNumber(direction)) toMove = direction;
}
function moveUser(oldState: Set<GameObject>, userId: number) {
  let newState = oldState;
  let locationId = getCurrentLocation(newState, userId)._id;
  if (toMove !== null) {
    let curLocation = newState.find((obj) => obj._id == locationId) as Location;
    let locations = locationMoveDirectionWithEntry(
      newState,
      curLocation,
      userId,
      toMove,
      1,
    );
    if (locations.firstLoc) {
      newState = newState
        .delete(newState.find((obj) => obj._id == locations.firstLoc._id))
        .add(locations.firstLoc);
    }
    if (locations.secondLoc) {
      newState = newState
        .delete(newState.find(
          (obj) => obj._id == locations.secondLoc._id,
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
