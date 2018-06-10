import { GameObject } from './interfaces/GameObject';
import * as fp from 'lodash/fp';
import { Location } from '../classes/location';
export type State = Set<GameObject>;
let aProto = Object.getPrototypeOf(
  new Location({ name: '', roomLimit: { x: 0, y: 0 } }),
);

function isLocation(obj: GameObject): obj is Location {
  return aProto.isPrototypeOf(obj);
}

export function getObjectById(state: State, id: number): GameObject {
  return fp.find((v) => v._id === id, Array.from(state.values()));
}

export function getCurrentLocation(state: State, personId: number): Location {
  return fp.find((obj) => {
    let stop = 0;
    if (obj instanceof Location) {
      let another = 0;
    }

    return (
      isLocation(obj) &&
      !fp.isNil(
        fp.find((id) => id === personId, Array.from(obj.objects.keys())),
      )
    );
  }, Array.from(state.values())) as Location;
}
