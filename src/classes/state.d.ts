import { Set } from 'immutable';
import { GameObject } from "./interfaces/GameObject";
export declare type State = Set<GameObject>;
export declare function getObjectById(state: State, id: number): GameObject;
export declare function getCurrentLocation(state: State): GameObject;
