import { State, getCurrentLocation } from "../state";
import { objectsInRange } from "./combat";
import { manhattanH, progressPath } from "./path";
import { Person } from "../person";


export function basicEnemyCombat(enemyId: string, state: State): State {
  let location = getCurrentLocation(state, enemyId);
  let closeObject = objectsInRange(state, enemyId, 100);
  let objV = location.positionObjectAt(closeObject);
  if (closeObject == null) return;
  let distance = manhattanH(location.positionObjectAt(enemyId), objV);
  if (distance > 1) {
    let newLoc = progressPath(location, state.groundObjects.get(enemyId) as Person, objV);
    state.groundObjects.set(newLoc._id, newLoc);
    
  }
  return state;
}