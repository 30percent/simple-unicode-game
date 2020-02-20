import { GameObject } from "./classes/interfaces/GameObject";
import { Person } from "./classes/person";
import { Blockage } from "./classes/block";
import { Location, Vector } from './classes/location';
import { addHealthStatus, HealthStatus } from "./classes/interfaces/StatusEffects";
import { modifyHealth } from "./classes/interfaces/Health";
import fp = require("lodash/fp");

export function init(): Map<string, GameObject> {
  let marg = new Person({ name: 'Margaret', _id: 'margaret', hp: 10, symbol: 'G' });
  let mary = new Person({ name: 'Mary', hp: 10, symbol: 'M' });
  let delilah = new Person({name: 'Delilah', _id: 'delilah', hp: 10, symbol: 'D'});
  let blockage = new Blockage({name: 'Wall'})
  let home = new Location({
    name: 'Home',
    roomLimit: new Vector({ x: 6, y: 4 }),
    symbol: '\u0298',
  });
  // let childBar = new Location({

  // })
  let jack = addHealthStatus(
    modifyHealth(new Person({ name: 'Jack', hp: 10, symbol: 'J' }), -2),
    HealthStatus.Poison,
  );
  let city = new Location({
    name: 'City',
    symbol: '\u050A',
    roomLimit: new Vector({ x: 10, y: 10 }),
  });
  // add to locations
  city = city
    .addObject(new Vector({ x: 0, y: 2}), delilah._id)
    .addObject(new Vector({ x: 0, y: 3 }), mary._id)
    .addObject(new Vector({ x: 0, y: 4 }), jack._id)
    .addObject(new Vector({ x: 6, y: 9 }), marg._id)
    .addObject(new Vector({ x: 5, y: 7 }), home._id);
  home = home.addObject(new Vector({ x: 0, y: 2 }), city._id);
  // margWander = createClampedWander(home, 2, marg._id);
  const retMap = new Map<string, GameObject>();
  [city, jack, mary, marg, delilah, home].map((v) => {
    retMap.set(v._id, v);
  });
  fp.forEach(
    (b) => {
      let block = new Blockage({name: 'Wall'});
      city.addObject(new Vector({x: b[0], y: b[1]}), block._id);
      retMap.set(block._id, block);
    },
    [[3,7],[4,7],[6,7],[3,8],[4,8],[3,9],[4,9]]
  )
  fp.forEach(
    (b) => {
      let block = new Blockage({name: 'Wall'});
      home.addObject(new Vector({x: b[0], y: b[1]}), block._id);
      retMap.set(block._id, block);
    },
    [[0,0], [0,1],[0,3]]
  )
  return retMap;
}
