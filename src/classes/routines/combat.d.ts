import { State } from "../state";
import { Place } from "../location";
export declare function doDamage(state: State, activeId: string): State;
export declare function doDamageTarget(state: State, activeId: string, targetId: string): State;
export declare function objectsInRange(state: State, activeId: string, range: number): string[];
export declare function targetDistance(location: Place, activeId: string, targetId: string): number;
