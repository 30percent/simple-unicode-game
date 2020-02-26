import { GameObject } from "./../interfaces/GameObject";
import { Location } from "../location";
import { Direction } from "../structs/Direction";
export declare function symbolLocationDraw(state: Map<string, GameObject>, location: Location): string;
export declare function locationMoveDirectionWithEntry(state: Map<string, GameObject>, curLocation: Location, objectId: string, direction: Direction, amount: number): {
    firstLoc: Location;
    secondLoc: Location;
};
