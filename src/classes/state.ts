import { GameObject } from './interfaces/GameObject';
import * as fp from 'lodash/fp';
import { Place } from '../classes/place';
export type State = Set<GameObject>;

export function getObjectById(state: State, id: number): GameObject {
  return fp.find((v) => v._id === id, Array.from(state.values()));
}

export function getCurrentLocation(state: State, personId: number): Place {
  return fp.find((obj) => {
    let stop = 0;
    if (obj instanceof Place) {
      let another = 0;
    }

    return (
      obj instanceof Place &&
      !fp.isNil(
        fp.find((id) => id === personId, Array.from(obj.objects.keys())),
      )
    );
  }, Array.from(state.values())) as Place;
}
