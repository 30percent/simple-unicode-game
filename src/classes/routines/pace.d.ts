import { Place } from '../location';
import { Direction } from '../structs/Direction';
export declare function createPaceFoo(paceCount: number, direction: Direction): (location: Place, id: string) => Place;
export declare function createClampedWander(startingLoc: Place, range: number, id: string): (location: Place) => Place;
