import { moveDirection, Location } from '../location';
import { getVectorFromDirection } from '../location';
import { noop, isEqual } from 'lodash/fp';
import { Direction } from '../structs/Direction';
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
): (location: Location, id: string) => Location {
  let paceIter = 0;
  return function(location: Location, id: string) {
    if (paceIter >= paceCount) {
      direction = __swapDirection(direction);
      paceIter = 0;
    }
    let initial = location.objects.get(id);
    let result = moveDirection(location, id, direction, 1);
    if (!isEqual(result.objects.get(id), initial)) paceIter++; // This ensures we actually moved the piece
    return result;
  };
}

export function createClampedWander(
  startingLoc: Location,
  range: number,
  id: string,
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
