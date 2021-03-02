import { GameObject } from "./interfaces/GameObject";
import { Place } from "./location";
import { Inventory } from "./items/inventory";
export declare type InventoryState = Map<string, Inventory>;
export declare type Routine = (state: State) => State;
export declare class State {
    groundObjects: Map<string, GameObject>;
    inventories: Map<string, Inventory>;
    routines: Routine[];
    userId: string;
    constructor();
    addRoutine(routine: Routine): this;
    addRoutines(routines: Routine[]): this;
    removeObject(object: string | GameObject): State;
}
export declare function getObjectById(state: State, id: string): GameObject;
export declare function getCurrentLocation(state: State, personId: string): Place | null;
export declare function getObjectByPred(state: State, predicate: (obj: GameObject) => boolean): GameObject | null;
export declare function locationContaining(state: State, predicate: (loc: Place) => boolean): Place | null;
export declare function progressRoutines(state: State): State;
