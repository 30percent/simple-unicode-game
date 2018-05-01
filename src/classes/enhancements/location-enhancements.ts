import { Set } from 'immutable';
import * as fp from 'lodash/fp';

import { addObjectToLocation, Location, Vector } from '../location';
import { GameObject } from './../interfaces/GameObject';
import { Direction, getVectorFromDirection } from './../location';
import { getObjectById } from './../state';

export function symbolLocationDraw(state: Set<GameObject>, location: Location) {
  return fp
    .map((y) => {
      return fp
        .map((x) => {
          let objectId = location.objectIdAtPosition(
            new Vector({ x: x, y: y }),
          );
          if (!fp.isNil(objectId)) {
            let object = state.find((obj: GameObject) => obj._id == objectId);
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
  curLocation: Location,
  objectId: number,
  direction: Direction,
  amount: number,
): { firstLoc: Location; secondLoc: Location } {
  let pos = getVectorFromDirection(curLocation, objectId, direction, amount);
  let objIdAtPos = curLocation.objectIdAtPosition(pos);
  let firstLoc: Location;
  let secondLoc: Location;
  if (!fp.isNil(objIdAtPos)) {
    let objAtPos = getObjectById(state, objIdAtPos);
    if (objAtPos instanceof Location) {
      // Enter room (move object out of room into new room)
      // Get new placement
      // TODO: (this mess needs to be fixed/cleaned)
      let newPos = objAtPos.objects.get(curLocation._id);
      if (newPos) {
        newPos = newPos.set('x', newPos.x + 1) as Vector;
      } else {
        newPos = new Vector({ x: 0, y: 0 });
      }
      firstLoc = curLocation.deleteIn(['objects', objectId]) as Location;
      secondLoc = addObjectToLocation(objAtPos, objectId, newPos);
    } else if (!objAtPos.solid) {
      firstLoc = curLocation.setIn(['objects', objectId], pos) as Location;
    } else {
      // Location occupied by non-entry point, no locations were modified, no need to do anything
    }
  } else if (!curLocation.isPositionInbounds(pos)) {
    return null;
  } else {
    firstLoc = curLocation.setIn(['objects', objectId], pos) as Location;
  }
  return {
    firstLoc: firstLoc,
    secondLoc: secondLoc,
  };
}
