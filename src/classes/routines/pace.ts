import { List, is } from "immutable";
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
export function createPaceFoo(paceCount: number, direction: Direction): (location: Location, id: number) => Location {
    let paceIter = 0;
    return function (location: Location, id: number) {
        if(paceIter >= paceCount) {
            direction = __swapDirection(direction);
            paceIter = 0;
        }
        let result = moveDirection(location, id, direction, 1);
        if(!is(result, location)) paceIter++; // This ensures we actually moved the piece
        return result;
    }
}