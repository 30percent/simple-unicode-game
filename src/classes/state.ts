import { Map, List, Record } from 'immutable';
import { GameObject } from "./interfaces/GameObject";
import * as fp from 'lodash/fp';
import { Location } from "./location";
export type State = List<GameObject>;

export function getObjectById(state: State, id: number) : GameObject {
    return state.find((v) => v._id === id);
}

export function getCurrentLocation(state: State) : Location {
    return state.find((obj) => {
        return obj instanceof Location
    }) as Location;
}