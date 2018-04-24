import { List } from "immutable";
import { Direction, moveDirection, Location } from "./../location";
import { Stringy, GameObject } from "./../interfaces/GameObject";
function __swapDirection(direction: Direction) : Direction {
    switch(direction) {
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
export function createPaceFoo(paceCount: number, direction: Direction) {
    let paceIter = 0;
    return function (location: Location, id: number) {
        if(paceIter < paceCount) {
            paceIter++;
        } else {
            paceIter = 1; //we start at 1 as we are still pacing after direction swap
            direction = __swapDirection(direction);
        }
        
        // DEFECT: If location is occupied, pacing is broken.
        return moveDirection(location, id, direction, 1)
    }
}