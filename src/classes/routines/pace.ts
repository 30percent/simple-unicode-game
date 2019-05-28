import { List, is } from 'immutable';
import { Direction, moveDirection, Location } from './../location';
import { Stringy, GameObject } from './../interfaces/GameObject';
import { Vector, getVectorFromDirection } from '../location';
import { noop } from 'lodash/fp';
function __swapDirection(direction: Direction): Direction {
  switch (direction) {
    case Direction.Up:
      return Direction.Down;
    case Direction.Down:
      return Direction.Up;
    case Direction.Left:
      return Direction.Right;
    case Direction.Right:
      return Direction.Left;
  }
}
function __randomDirection(): Direction {
  return Math.floor(Math.random() * 3);
}
export function createPaceFoo(
  paceCount: number,
  direction: Direction,
): (location: Location, id: number) => Location {
  let paceIter = 0;
  return function(location: Location, id: number) {
    if (paceIter >= paceCount) {
      direction = __swapDirection(direction);
      paceIter = 0;
    }
    let result = moveDirection(location, id, direction, 1);
    if (!is(result, location)) paceIter++; // This ensures we actually moved the piece
    return result;
  };
}

export function createClampedWander(
  startingLoc: Location,
  range: number,
  id: number,
): (location: Location) => Location {
  const startingVec = startingLoc.positionObjectAt(id);
  return function(location: Location): Location {
    const direction = __randomDirection();
    let next = getVectorFromDirection(location, id, direction, 1);
    if (
      Math.abs(startingVec.x - next.x) > range ||
      Math.abs(startingVec.y - next.y) > range
    ) {
      noop();
    }
    return moveDirection(location, id, direction, 1);
  };
}
