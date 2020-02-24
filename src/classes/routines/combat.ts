import { State, getCurrentLocation } from "../state";
import * as fp from 'lodash/fp';
import * as _ from 'lodash';
import { Weapon } from "../items/weapon";
import { GameObject } from "../interfaces/GameObject";
import { Location, Vector} from "../location";
import { manhattanH } from "./path";
import { Person } from "../person";
export function doDamage(state: State, activeId: string) {
  
  // Player in combat zone;
  let newState = state;
  let playerLocation = getCurrentLocation(state, activeId);
  let playerInventory = state.inventories.get(activeId);
  let playerActiveWeapon = _.get(_.find(
    fp.get('items', playerInventory),
    (item) => { 
      return item.object instanceof Weapon && item.object.active }
    ), 'object');
  if (playerActiveWeapon != null && playerActiveWeapon instanceof Weapon ) {
    let enemyId = objectsInRange(state, activeId, playerActiveWeapon.range);
    if (enemyId != null) {
      let enemy = state.groundObjects.get(enemyId) as unknown as Person;
      newState.groundObjects.set(enemyId, enemy.setHealth(enemy.hp - playerActiveWeapon.damage));
    }
  }
  return newState;
}

export function objectsInRange(state: State, activeId: string, range: number): string | null {
  let location = getCurrentLocation(state, activeId);
  let activeLoc = location.positionObjectAt(activeId);
  let enemies = fp.filter((obj) => {
    let id: string = obj[0];
    let vect: Vector = obj[1];
    if (
      id != activeId
      && state.groundObjects.get(id) instanceof Person
      && manhattanH(activeLoc, vect) <= range) {
      return true;
    }
  }, Array.from(location.objects))
  return fp.get('[0][0]', enemies); // obviously not "closest" here...
}