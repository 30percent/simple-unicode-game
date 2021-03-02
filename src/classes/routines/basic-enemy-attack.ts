import { State, getCurrentLocation } from "../state";
import { objectsInRange, doDamage, doDamageTarget } from "./combat";
import { manhattanH, progressPath } from "./path";
import { Person } from "../person";


export function basicEnemyCombat(enemyId: string, state: State): State {
  let location = getCurrentLocation(state, enemyId);
  let closeObject = objectsInRange(state, enemyId, 100)[0];
  let objV = location.positionObjectAt(closeObject);
  if (closeObject == null) return;
  let distance = manhattanH(location.positionObjectAt(enemyId), objV);
  if (distance > 1) {
    let newLoc = progressPath(location, state.groundObjects.get(enemyId) as Person, objV);
    state.groundObjects.set(newLoc._id, newLoc);
  }
  doDamageTarget(state, enemyId, closeObject);
  return state;
}

export function basicEnemyCombatPlayer(enemyId: string, state: State): State {
  let location = getCurrentLocation(state, enemyId);
  let playerLocation = location.positionObjectAt(state.userId)
  if (playerLocation != null) {
    let distance = manhattanH(location.positionObjectAt(enemyId), playerLocation);
    if (distance > 1) {
      let newLoc = progressPath(location, state.groundObjects.get(enemyId) as Person, playerLocation);
      state.groundObjects.set(newLoc._id, newLoc);
    }
    doDamageTarget(state, enemyId, state.userId);
  }
  return state;
}