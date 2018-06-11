import { Direction, moveDirection, Place } from './../place';
import { Stringy, GameObject } from './../interfaces/GameObject';
import { isEqual } from 'lodash/fp';
import { cloneDeep } from 'lodash';
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
export function createPaceFoo(
  paceCount: number,
  direction: Direction,
): (location: Place, id: number) => Place {
  let paceIter = 0;
  return function(location: Place, id: number) {
    if (paceIter >= paceCount) {
      direction = __swapDirection(direction);
      paceIter = 0;
    }
    let origLoc = cloneDeep(location);
    let result = moveDirection(location, id, direction, 1);
    if (!isEqual(origLoc, result)) paceIter++;
    return result;
  };
}
