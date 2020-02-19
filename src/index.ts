import { Direction } from "./classes/structs/Direction";
import { init, startTicking, sTick2, moveYou } from './execution';
import { Location } from './classes/location';
import * as fp from 'lodash/fp';
import { GameObject } from './classes/interfaces/GameObject';
import { getCurrentLocation, getObjectByPred } from './classes/state';
import { symbolLocationDraw } from './classes/enhancements/location-enhancements';
import { Person } from './classes/person';

const css = require('./main.css');

export default class Main {
  constructor() {
    console.log('Typescript Webpack starter launched');
    let startState = init();
    let userId = getObjectByPred(startState, (obj) => obj.symbol === 'J')._id;
    let startLocation: Location = getCurrentLocation(startState, userId);
    sTick2(startState, startLocation, (curState: Map<string, GameObject>) => {
      let curLocation = getCurrentLocation(curState, userId);
      if (curLocation == null)
        document.getElementById('first-location').innerHTML = '';
      else {
        document.getElementById(
          'first-location',
        ).innerHTML = symbolLocationDraw(curState, curLocation);
      }
      document.getElementById('person-info').innerHTML = fp
        .filter((obj) => {
          return obj instanceof Person;
        }, Array.from(curState.values()))
        .map((person) => person.asString())
        .sort()
        .join('\n');
    });
    document.addEventListener('keyup', (event) => {
      moveYou(__directionFromKey(event));
    });
  }
}
function __directionFromKey(event: KeyboardEvent): Direction {
  switch (event.keyCode) {
    case 37:
      return Direction.Left;
    case 38:
      return Direction.Up;
    case 39:
      return Direction.Right;
    case 40:
      return Direction.Down;
    default:
      return null;
  }
}

let start = new Main();