import { HealthStatusHolder } from "./../interfaces/StatusEffects";
import { Vector, Place } from "../location";
import { Person } from "../person";
export declare const healthProgress: (obj: HealthStatusHolder) => HealthStatusHolder;
export declare const pathSpeed: (location: Place, person: Person, destination: Vector) => Place;
