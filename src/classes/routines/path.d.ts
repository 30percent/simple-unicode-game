import { Person } from "../person";
import { Vector, Place } from "../location";
export declare function manhattanH(start: Vector, goal: Vector): number;
export declare function getPath(location: Place, person: Person, destination: Vector): Vector[];
export declare function progressPath(location: Place, person: Person, destination: Vector): Place;
