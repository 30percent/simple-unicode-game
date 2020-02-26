import { Direction } from "../structs/Direction";
import { isNil } from "lodash";
import { State, getCurrentLocation } from "../state";
import { Place } from "../location";
import { locationMoveDirectionWithEntry } from "../enhancements/location-enhancements";
import * as fp from 'lodash/fp';

// A bit complicated to mess around with this within state confines.
let toMove: Direction = null;
export function moveYou(direction: Direction) {
  if (!isNil(direction)) toMove = direction;
}
export function moveUser(oldState: State) {
  let newState = fp.clone(oldState);
  let location = getCurrentLocation(newState, oldState.userId);
  if (toMove !== null) {
    let locations = locationMoveDirectionWithEntry(
      newState,
      location,
      oldState.userId,
      toMove,
      1,
    );
    if (locations.firstLoc) {
      newState.groundObjects.set(locations.firstLoc._id, locations.firstLoc);
    }
    if (locations.secondLoc) {
      newState.groundObjects.set(locations.secondLoc._id, locations.secondLoc);
    }
    toMove = null;
  }
  return newState;
}
