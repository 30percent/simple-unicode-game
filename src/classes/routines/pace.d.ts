import { Location } from '../location';
import { Direction } from '../structs/Direction';
export declare function createPaceFoo(paceCount: number, direction: Direction): (location: Location, id: string) => Location;
export declare function createClampedWander(startingLoc: Location, range: number, id: string): (location: Location) => Location;
