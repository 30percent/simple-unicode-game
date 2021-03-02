import { Direction } from "../structs/Direction";
import { isNil } from "lodash";
import { State, getCurrentLocation } from "../state";
import { Place } from "../location";
import { locationMoveDirectionWithEntry } from "../enhancements/location-enhancements";
import * as fp from 'lodash/fp';

// A bit complicated to mess around with this within state confines.
let toMove: Direction = null;
let toMoveDist: number = 0;
export function moveYou(direction: Direction, dist: number) {
  if (!isNil(direction)) { toMove = direction; }
  if (dist != null) { toMoveDist = dist; }
  else {dist = 1;}
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
      toMoveDist,
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
