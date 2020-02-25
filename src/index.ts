import { Direction } from "./classes/structs/Direction";
import { startTicking, moveYou, manualTick, createSampleRoutines } from './execution';
import { Location, Vector } from './classes/location';
import * as fp from 'lodash/fp';
import { GameObject } from './classes/interfaces/GameObject';
import { getCurrentLocation, getObjectByPred, State } from './classes/state';
import { symbolLocationDraw } from './classes/enhancements/location-enhancements';
import { Person } from './classes/person';
import { getPath } from "./classes/routines/path";
import { parsePlaces, parsePeople } from "./parseConfig";

const css = require('./main.css');

export default class Main {
  constructor() {
    let startState = new State();
    parsePeople(startState).then(
      parsePlaces
    ).then((nextState) => {
      return createSampleRoutines(nextState);
    }).then((startState) => {
      let userId = getObjectByPred(startState, (obj) => obj.symbol === 'J')._id;
      let startLocation: Location = getCurrentLocation(startState, userId);
      let nextState: State = startState; // TODO: integrate all the "state progress" properly.
      let tickTimer: number = null;
      let domHandling = (curState: State) => {
        let curLocation = getCurrentLocation(curState, userId);
        document.getElementById('person-info').innerHTML = fp
          .filter((obj) => {
            return obj instanceof Person && curLocation.objects.has(obj._id);
          }, Array.from(curState.groundObjects.values()))
          .map((person) => person.asString())
          .sort()
          .join('\n');
        nextState = curState;
        let locationHTML = '';
        if (curLocation == null) {
          locationHTML = '';
        } else if (curLocation.combat_zone) {
          if (tickTimer != null) {
            clearInterval(tickTimer);
            tickTimer = null;
          }
          document.getElementById('location-name').innerHTML = curLocation.name;
          locationHTML= symbolLocationDraw(curState, curLocation);
        } else {
          document.getElementById('location-name').innerHTML = curLocation.name;
          locationHTML= symbolLocationDraw(curState, curLocation);
          // (See above TODO)
          if (tickTimer == null) {
            tickTimer = startTicking(nextState, startLocation, domHandling);
          }
        }
        document.getElementById(
          'first-location',
        ).innerHTML = locationHTML;
      };
      tickTimer = startTicking(startState, startLocation, domHandling);
      document.addEventListener('keyup', (event) => {
        moveYou(__directionFromKey(event));
        if (tickTimer == null) {
          let curLocation = getCurrentLocation(nextState, userId);
          manualTick(nextState, curLocation, domHandling);
        }
      });
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