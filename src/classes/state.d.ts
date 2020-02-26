import { GameObject } from "./interfaces/GameObject";
import { Location } from "./location";
export declare type State = Map<string, GameObject>;
export declare function getObjectById(state: State, id: string): GameObject;
export declare function getCurrentLocation(state: State, personId: string): Location | null;
export declare function getObjectByPred(state: State, predicate: (obj: GameObject) => boolean): GameObject | null;
export declare function locationContaining(state: State, predicate: (loc: Location) => boolean): Location | null;
