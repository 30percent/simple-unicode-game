import { Person } from "../person";
import { Vector, Location } from "../location";
export declare function getPath(location: Location, person: Person, destination: Vector): Vector[];
export declare function progressPath(location: Location, person: Person, destination: Vector): Location;
