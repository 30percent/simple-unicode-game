import { State } from "./../state";
import { Place } from "../location";
import { Direction } from "../structs/Direction";
export declare function symbolLocationDraw(state: State, location: Place): string;
export declare function locationMoveDirectionWithEntry(state: State, curLocation: Place, objectId: string, direction: Direction, amount: number): {
    firstLoc: Place;
    secondLoc: Place;
};
