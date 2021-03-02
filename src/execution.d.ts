import { Place } from './classes/location';
import { State } from './classes/state';
export declare function startTicking(state: State, curLocation: Place, toCall: (state: State) => any): any;
export declare function manualTick(state: State, toCall: (state: State) => any): void;
