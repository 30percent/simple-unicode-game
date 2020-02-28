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
    let enemyId = fp.get(0, objectsInRange(state, activeId, playerActiveWeapon.range));
    if (enemyId != null) {
      let enemy = state.groundObjects.get(enemyId) as unknown as Person;
      newState.groundObjects.set(enemyId, enemy.setHealth(enemy.hp - playerActiveWeapon.damage));
    }
  }
  return newState;
}
export function doDamageTarget(state: State, activeId: string, targetId: string) {
  
  // Player in combat zone;
  let newState = state;
  let playerInventory = state.inventories.get(activeId);
  let location = getCurrentLocation(state, activeId);
  let activeWeapon = _.get(_.find(
    fp.get('items', playerInventory),
    (item) => { 
      return item.object instanceof Weapon && item.object._id === playerInventory.activeItem }
    ), 'object');
  if (activeWeapon != null && activeWeapon instanceof Weapon ) {
    let tarDist = targetDistance(location, activeId, targetId);
    if (tarDist <= activeWeapon.range) {
      let enemy = state.groundObjects.get(targetId) as unknown as Person;
      newState.groundObjects.set(targetId, enemy.setHealth(enemy.hp - activeWeapon.damage));
    }
  }
  return newState;
}

type objRange = {
  person: Person | null,
  distance: number
};
export function objectsInRange(state: State, activeId: string, range: number): string[] {
  let location = getCurrentLocation(state, activeId);
  let closestEnemy = fp.flow(
    fp.map((id: string): objRange => {
      let per = state.groundObjects.get(id)
      if (
        id != activeId
        && per instanceof Person) {
          let distance = targetDistance(location, activeId, id);
        return {
          person: per,
          distance
        };
      } else {
        return {
          person: null,
          distance: -1
        }
      }
    }),
    fp.filter((it) => it.distance <= range && it.person != null),
    fp.sortBy((it) => it.distance),
    fp.map((it) => (it != null) ? it.person._id : null)
  )(Array.from(location.objects.keys()))
  return closestEnemy;
}

export function targetDistance(location: Place, activeId: string, targetId: string): number {
  let activeLoc = location.positionObjectAt(activeId);
  let dest = location.positionObjectAt(targetId);
  return manhattanH(activeLoc, dest);
}