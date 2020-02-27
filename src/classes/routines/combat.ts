import { State, getCurrentLocation } from "../state";
import * as fp from 'lodash/fp';
import * as _ from 'lodash';
import { Weapon } from "../items/weapon";
import { GameObject } from "../interfaces/GameObject";
import { Place, Vector} from "../location";
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
      return item.object instanceof Weapon && item.object._id === playerInventory.activeItem }
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

type objRange = {
  person: Person | null,
  distance: number
};
export function objectsInRange(state: State, activeId: string, range: number): string | null {
  let location = getCurrentLocation(state, activeId);
  let activeLoc = location.positionObjectAt(activeId);
  let closestEnemy = fp.flow(
    fp.map((obj): objRange => {
      let id: string = obj[0];
      let vect: Vector = obj[1];
      let per = state.groundObjects.get(id)
      if (
        id != activeId
        && per instanceof Person) {
        return {
          person: per,
          distance: manhattanH(activeLoc, vect)
        };
      } else {
        return {
          person: null,
          distance: manhattanH(activeLoc, vect)
        }
      }
    }),
    fp.sortBy((it) => it.distance),
    fp.find((it) => it.distance <= range && it.person != null),
    (it) => (it != null) ? it.person._id : null
  )(Array.from(location.objects))
  return closestEnemy;
}