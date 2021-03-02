import * as fp from 'lodash/fp';
import { DummyObject } from "./classes/interfaces/GameObject";
import { Stringy } from "./classes/interfaces/GameObject";
import * as _ from 'lodash';
import { Vector, Place } from './classes/location';
import { GameObject } from './classes/interfaces/GameObject';
import cuid = require('cuid');
import { Blockage } from './classes/block';
import Axios from 'axios';
import {Promise as Bluebird } from 'bluebird';
import { Person } from './classes/person';
import { State } from './classes/state';
import { Inventory } from './classes/items/inventory';
import { Weapon } from './classes/items/weapon';
import { BaseItem } from './classes/items/item';
import SettableRoutines from './classes/routines/settable-routines';

async function fetchMap(loc: string) {
  return (await Axios.get(`static/config/places/${loc}`)).data as Promise<string>;
}

async function fetchMaps(): Promise<{[s: string]: string}> {
  let places = ['city'];
  let paths = _.reduce(places, (acc, p) => fp.set(p, `${p}.map`, acc), {});
  // let paths: {[s: string]: string} = {
  //   city: 'static/config/places/city.txt',
  //   home: 'static/config/places/home.txt'
  // }
  return await Bluebird.props(_.mapValues(paths, async (path, key) => {
    return fetchMap(path) as Promise<string>;
  }))
}
type PersonConfig = {
  id: string;
  name: string;
  symbol: string;
  inventory?:  {
    type: string,
    active?: boolean,
    range?: number,
    damage?: number,
    id: string,
  }[];
  routines?: Array<keyof typeof SettableRoutines>;
}
async function fetchPerson(per: string): Promise<PersonConfig> {
  return (await Axios.get(`static/config/monsters/${per}`)).data as Promise<PersonConfig>;
}
async function fetchPeople(): Promise<PersonConfig[]> {
  let path = 'static/config/people.json';
  return (await Axios.get(path)).data;
}

function splitAllowQuotes(str: String) {
  // Source: https://stackoverflow.com/a/46946420 Tsuneo Yoshioka<https://stackoverflow.com/users/1309218/tsuneo-yoshioka>
  let split = str.match(/\\?.|^$/g).reduce((p, c) => {
    if(c === '"' || c === "'"){
        p.quote ^= 1;
    }else if(!p.quote && c === ' '){
        p.a.push('');
    }else{
        p.a[p.a.length-1] += c.replace(/\\(.)/,"$1");
    }
    return  p;
  }, {a: [''], quote: 0}).a
  return split;
}

async function parseObject(state: State, split: string[]) {
  // if Person: [ind id name symbol ]
  // if Place: [ind id url] (will ignore url for now, circle back)
  if (state.groundObjects.has(split[1])) {
    return; // don't add duplicates to state.
  }
  if (split.length > 3) {
    let p = new Person({
        _id: split[1],
        name: split[2],
        symbol: split[3],
        hp: 10
      })
    state.groundObjects.set(p._id, p);
  } else if (split.length == 3) {
    if (split[2].indexOf('.map') > 0) {
      let placeStr = await fetchMap(split[2]);
      state.groundObjects.set(split[1], new DummyObject())
      await parsePlace(state, {key: split[1], place: placeStr});
    } else if (split[2].indexOf('.json') > 0) {
      let person = await fetchPerson(split[2]);
      person.id = split[1];
      parsePerson(state, person);
    }
  }
}

async function parsePlace(state: State, {key, place}: {key: string, place: string}) {
  let parts = place.split('\n\n');
  let info = parts[0].split('\n');
  let map = parts[1];
  let vars = (await Promise.all(parts[2].split('\n').map((line) => {
    return splitAllowQuotes(line);
  }).map(async (lv) => {
    // handle objects
    await parseObject(state, lv);
    return [lv[1], lv[0]];
    // return fp.set(lv[0], lv[1], acc);
  }))).reduce((acc, kv) => {
    return fp.set(kv[1], kv[0], acc);
  }, {});
  let mapLines = map.split('\n').map((line) => line.split(' '));
  let mapSize = new Vector({
    x: mapLines[0].length,
    y: mapLines.length
  });
  let mapObjects = mapLines.reduce((acc, line, y) => {
    line.forEach((item, x) => {
      if (item != 'o') {
        acc.push({id: item, v: new Vector({x, y})});
      }
    })
    return acc;
  }, [] as {id: string, v: Vector}[]);
  let newPlace = new Place({
    name: info[0],
    roomLimit: mapSize,
    _id: key,
    symbol: info[1],
    combat_zone: _.has(info, '2')
  });
  newPlace = _.reduce(mapObjects, 
    (acc, vect, id) => {
      if (vect.id == 'x') {
        return acc.addWall(vect.v);
      } else {
        return acc.addObject(vect.v, vars[vect.id])
      }
    },
    newPlace);
  state.groundObjects.set(newPlace._id, newPlace);

}

export async function parsePlaces(state: State) {
  let places = await fetchMaps();
  await Promise.all(_.map(places, async (place: string, key: string) => {
    return parsePlace(state, {key, place});
  }));
  return state;
}

function parsePerson(state: State, confPer: PersonConfig) {
  state.groundObjects.set(confPer.id, new Person({
    _id: confPer.id,
    name: confPer.name,
    symbol: confPer.symbol,
    hp: 10
  }));
  if (confPer.inventory != null) {
    let inv = new Inventory();
    fp.forEach((it) => {
      switch(it.type) {
        case 'Weapon': 
          inv.addItem(new Weapon({range: it.range, damage: it.damage, name: it.id, _id: it.id}));
          inv = inv.setItemActive(it.id);
          break;
        default:
          inv.addItem(new BaseItem({_id: it.id, name: it.id}));
      }
    }, confPer.inventory)
    state.inventories.set(confPer.id, inv);
  }
  if (confPer.routines) {
    confPer.routines.forEach((routine) => {
      state.addRoutine(SettableRoutines[routine](confPer.id));
    })
  }
}

export async function parsePeople(state: State) {
  let people = await fetchPeople();
  people.forEach((confPer) => {
    parsePerson(state, confPer);
  })
  return state;
}