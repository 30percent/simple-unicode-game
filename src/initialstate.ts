import { GameObject } from './classes/interfaces/GameObject';
import { Person } from './classes/person';
import { Location } from './classes/Location';
import {
  addHealthStatus,
  HealthStatus,
} from './classes/interfaces/StatusEffects';
import { Furniture } from './classes/furniture';
import { isHealth } from './classes/interfaces/Health';

export function init(): Set<GameObject> {
  let marg = new Person({ name: 'Margaret', hp: 10, maxHp: 10 });
  let mary = new Person({ name: 'Mary', hp: 10, maxHp: 10, symbol: 'M' });
  let childRoom = new Location({
    name: 'Bedroom',
    roomLimit: { x: 4, y: 4 },
    symbol: '\u01ec',
  });
  let jack = addHealthStatus(
    new Person({ name: 'Jack', hp: 10, maxHp: 10, symbol: 'J' }),
    HealthStatus.Poison,
  );
  let home = new Location({
    name: 'Home',
    roomLimit: { x: 10, y: 10 },
  });
  let bed = new Furniture({
    name: 'Bed',
    symbol: '\u229f',
    effect: (object: GameObject) => {
      if (isHealth(object) && object.hp < object.maxHp) {
        object.hp += 1;
        return object;
      }
      return object;
    },
  });
  // add to locations
  home = home
    .addObject({ x: 0, y: 3 }, mary._id)
    .addObject({ x: 5, y: 6 }, jack._id)
    .addObject({ x: 5, y: 7 }, childRoom._id);

  childRoom = childRoom
    .addObject({ x: 0, y: 2 }, home._id)
    .addObject({ x: 3, y: 2 }, bed._id);

  return new Set<GameObject>([home, jack, mary, marg, childRoom, bed]);
}
