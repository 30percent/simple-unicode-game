import { Direction } from "./classes/location";
import { List } from "immutable";
import { GameObject } from "./classes/interfaces/GameObject";
export declare function init(): void;
export declare function startTicking(toCall: (currentLocation: List<GameObject>) => any): void;
export declare function moveYou(direction: Direction): void;
