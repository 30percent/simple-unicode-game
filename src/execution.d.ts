import { GameObject } from './classes/interfaces/GameObject';
import { Location } from './classes/location';
import { Direction } from './classes/structs/Direction';
export declare function startTicking(state: Map<string, GameObject>, curLocation: Location, toCall: (state: Map<string, GameObject>) => any): void;
export declare function sTick2(state: Map<string, GameObject>, curLocation: Location, toCall: (state: Map<string, GameObject>) => any): void;
export declare function moveYou(direction: Direction): void;
