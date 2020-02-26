import { HealthStatusHolder } from "./../interfaces/StatusEffects";
import { Vector, Location } from "../location";
import { Person } from "../person";
export declare const healthProgress: (obj: HealthStatusHolder) => HealthStatusHolder;
export declare const pathSpeed: (location: Location, person: Person, destination: Vector) => Location;
