import * as Promise from 'bluebird';
import { HealthInt, isHealth } from './classes/interfaces/Health';
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
import { Direction, Place, Vector, vectEqual } from './classes/place';
import { Person } from './classes/person';
import { createPaceFoo } from './classes/routines/pace';
import { tickFoo } from './classes/routines/tick';
import { getCurrentLocation, getObjectById } from './classes/state';
import { Furniture } from './classes/furniture';

function __getId(object: GameObject | number): number {
  return fp.isObject(object) ? (object as GameObject)._id : (object as number);
}

// Replace with Generator at earliest convenience
export function startTicking(
  state: Set<GameObject>,
  curLocation: Place,
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

let paceRight = createPaceFoo(4, Direction.Right);
function tick(oldState: Set<GameObject>, locationId: number): Set<GameObject> {
  let newState = fp.cloneDeep(oldState);

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
        let furnId = fp.flow(
          fp.find(
            (entry) =>
              entry[0] !== object._id && vectEqual(entry[1], pointInLoc),
          ),
          fp.get('0'),
        )(Array.from(loc.objects.entries()));

        let furn = getObjectById(newState, furnId);
        if (furn instanceof Furniture) {
          newO = furn.effect(object);
        }
      }
    }
    if (object instanceof Place) {
      if (fp.isEqual(object._id, locationId)) {
        fp.flow(
          fp.find((obj: GameObject) => obj.symbol === 'M'),
          (obj) => paceRight(object, obj._id),
        )(Array.from(newState.values()));
      }
    }
    if (newO !== object) {
      newState.delete(object);
      newState.add(newO);
    }
  });
  newState = fp.flow(
    fp.find((obj: GameObject) => obj.symbol === 'J'),
    (obj) => moveUser(newState, obj._id),
  )(Array.from(newState.values()));
  return newState;
}

let toMove: Direction = null;
export function moveYou(direction: Direction) {
  if (fp.isNumber(direction)) toMove = direction;
}
function moveUser(oldState: Set<GameObject>, userId: number) {
  let newState = oldState;
  let locationId = getCurrentLocation(newState, userId)._id;
  if (toMove !== null) {
    let curLocation = fp.find(
      (obj: GameObject) => obj._id === locationId,
      Array.from(newState.values()),
    ) as Place;
    let locations = locationMoveDirectionWithEntry(
      newState,
      curLocation,
      userId,
      toMove,
      1,
    );
    toMove = null;
  }
  return newState;
}

function clearStdout() {
  // undefined in
  process.stdout.write('\x1B[2J\x1B[0f');
}
