import { Map, List, Record, Set } from 'immutable';
import { GameObject } from "./interfaces/GameObject";
import * as fp from 'lodash/fp';
import { Location } from "./location";
export type State = Set<GameObject>;

export function getObjectById(state: State, id: number) : GameObject {
    return state.find((v) => v._id === id);
}

export function getCurrentLocation(state: State, personId: number) : Location {
    return state.find((obj) => {
        return obj instanceof Location && !fp.isNil(obj.objects.findKey((ign: any, id: number) => id === personId));
    }) as Location;
}