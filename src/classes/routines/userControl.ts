import { Direction } from "../structs/Direction";
import { isNil } from "lodash";
import { State, getCurrentLocation } from "../state";
import { Place } from "../location";
import { locationMoveDirectionWithEntry } from "../enhancements/location-enhancements";
import * as fp from 'lodash/fp';

// A bit complicated to mess around with this within state confines.

export class UserControls {
  static toMove: Direction = null;
  static toMoveDist: number = 0;
  static activeUser: string = null;
  static moveYou(direction: Direction, dist: number) {
    if (!isNil(direction)) { UserControls.toMove = direction; }
    if (dist != null) { UserControls.toMoveDist = dist; }
    else {dist = 1;}
  }

  static changeActive(userId: string) {
    UserControls.activeUser = userId;
  }

  static clearActivity() {
    UserControls.toMove = null;
    UserControls.toMoveDist = 0;
    UserControls.activeUser = null;
  }

  static moveUser(oldState: State): State {
    let newState = fp.clone(oldState);
    let location = getCurrentLocation(newState, oldState.userId);
    if (UserControls.toMove !== null) {
      let locations = locationMoveDirectionWithEntry(
        newState,
        location,
        oldState.userId,
        UserControls.toMove,
        UserControls.toMoveDist,
      );
      if (locations.firstLoc) {
        newState.groundObjects.set(locations.firstLoc._id, locations.firstLoc);
      }
      if (locations.secondLoc) {
        newState.groundObjects.set(locations.secondLoc._id, locations.secondLoc);
      }
      // TODO: this should be in executor (call `UserControls.clearActivity`)
      UserControls.toMove = null;
    }
    return newState;
  }
}