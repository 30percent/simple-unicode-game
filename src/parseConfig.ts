import * as fp from 'lodash/fp';
import * as _ from 'lodash';
import { Vector, Location } from './classes/location';
import { GameObject } from './classes/interfaces/GameObject';
import cuid = require('cuid');
import { Blockage } from './classes/block';
import Axios from 'axios';
import {Promise as Bluebird } from 'bluebird';
import { Person } from './classes/person';

async function fetchMaps(): Promise<{[s: string]: string}> {
  let paths: {[s: string]: string} = {
    city: 'static/config/places/city.txt',
    home: 'static/config/places/home.txt'
  }
  return await Bluebird.props(_.mapValues(paths, async (path, key) => {
    return (await Axios.get(path)).data as Promise<string>;
  }))
}
type PersonConfig = {
  id: string;
  name: string;
  symbol: string;
}
async function fetchPeople(): Promise<PersonConfig[]> {
  let path = 'static/config/people.json';
  return (await Axios.get(path)).data;
}
export async function parsePlaces(state: Map<string, GameObject>) {
  let places = await fetchMaps();
  _.forEach(places, (place: string, key: string) => {
    let parts = place.split('\n\n');
    let info = parts[0].split('\n');
    let map = parts[1];
    let vars = parts[2].split('\n').map((line) => {
      return line.split(' ');
    }).reduce((acc, lv) => {
      return fp.set(lv[0], lv[1], acc);
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
    let newPlace = new Location({
      name: info[0],
      roomLimit: mapSize,
      _id: key,
      symbol: info[1]
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
    state.set(newPlace._id, newPlace);
  });
  return state;
}

export async function parsePeople(state: Map<string, GameObject>) {
  let people = await fetchPeople();
  people.forEach((confPer) => {
    state.set(confPer.id, new Person({
      _id: confPer.id,
      name: confPer.name,
      symbol: confPer.symbol,
      hp: 10
    }));
  })
  return state;
}