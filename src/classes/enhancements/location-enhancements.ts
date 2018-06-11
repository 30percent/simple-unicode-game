import * as fp from 'lodash/fp';

import { GameObject } from './../interfaces/GameObject';
import {
  addObjectToLocation,
  Place,
  Vector,
  Direction,
  getVectorFromDirection,
} from './../place';
import { getObjectById } from './../state';
import { setFind } from './../routines/utils';

export function symbolLocationDraw(state: Set<GameObject>, location: Place) {
  return fp
    .map((y) => {
      return fp
        .map((x) => {
          let objectId = location.objectIdAtPosition({ x: x, y: y });
          if (!fp.isNil(objectId)) {
            let object = setFind(
              state,
              (obj: GameObject) => obj._id == objectId,
            );
            if (object) {
              return object.symbol;
            } else {
              return 'o';
            }
          } else {
            return '_';
          }
        }, fp.range(0, location.roomLimit.x))
        .join(' | ');
    }, fp.range(0, location.roomLimit.y))
    .join('\n');
}

export function locationMoveDirectionWithEntry(
  state: Set<GameObject>,
  curLocation: Place,
  objectId: number,
  direction: Direction,
  amount: number,
): { firstLoc: Place; secondLoc: Place } {
  let pos = getVectorFromDirection(curLocation, objectId, direction, amount);
  let objIdAtPos = curLocation.objectIdAtPosition(pos);
  let firstLoc: Place;
  let secondLoc: Place;
  if (!fp.isNil(objIdAtPos)) {
    let objAtPos = getObjectById(state, objIdAtPos);
    if (objAtPos instanceof Place) {
      // Enter room (move object out of room into new room)
      // Get new placement
      // TODO: (this mess needs to be fixed/cleaned)
      let newPos = objAtPos.objects.get(curLocation._id);
      if (newPos) {
        newPos = fp.set('x', newPos.x + 1, newPos);
      } else {
        newPos = { x: 0, y: 0 };
      }
      curLocation.objects.delete(objectId);
      firstLoc = curLocation;
      secondLoc = addObjectToLocation(objAtPos, objectId, newPos);
    } else if (!objAtPos.solid) {
      curLocation.objects.set(objectId, pos);
      firstLoc = curLocation;
    } else {
      // Place occupied by non-entry point, no locations were modified, no need to do anything
    }
  } else if (!curLocation.isPositionInbounds(pos)) {
    return null;
  } else {
    curLocation.objects.set(objectId, pos);
    firstLoc = curLocation;
  }
  return {
    firstLoc: firstLoc,
    secondLoc: secondLoc,
  };
}
