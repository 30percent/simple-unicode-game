import { Direction } from "./classes/structs/Direction";
import { startTicking, manualTick } from './execution';
import { Place, Vector } from './classes/location';
import * as fp from 'lodash/fp';
import { GameObject } from './classes/interfaces/GameObject';
import { getCurrentLocation, getObjectByPred, State } from './classes/state';
import { symbolLocationDraw } from './classes/enhancements/location-enhancements';
import { Person } from './classes/person';
import { getPath } from "./classes/routines/path";
import { parsePlaces, parsePeople } from "./parseConfig";
import { initialiseState } from "./init";
import { UserControls } from "./classes/routines/userControl";

const css = require('./main.css');

export default class Main {
  constructor() {
    let initState = initialiseState();
    // TODO: Move this out to separate handlers.
    initState.then((startState) => {
      let userId = startState.userId;
      let startLocation: Place = getCurrentLocation(startState, userId);
      let nextState: State = startState; // TODO: integrate all the "state progress" properly.
      let tickTimer: number = null;
      let domHandling = (curState: State) => {
        let curLocation = getCurrentLocation(curState, curState.userId);
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
        document.getElementById(
          'user-inventory'
        ).innerHTML = curState.inventories.get(curState.userId).asString();
        updateActors(curState); // evidence that I need a bloody "UI" class
      };
      
      tickTimer = startTicking(startState, startLocation, domHandling);

      document.addEventListener('keyup', (event) => {
        let movin = __directionFromKey(event);
        UserControls.moveYou(movin.dir, movin.dist);
        if (tickTimer == null) {
          if (movin.dir != null) manualTick(nextState, domHandling);
        }
      });

      document.getElementById('playables').addEventListener("change", (ev: Event) => {
        UserControls.changeActive((ev.target as HTMLSelectElement).value);
        (ev.target as HTMLSelectElement).blur();
      });
    });
  }
}

function updateInventory(state: State) {

}

function updateActors(state: State) {
  let playables = fp.flow(
    fp.filter((o: GameObject) => {
      return o instanceof Person && o.playable 
    }),
    fp.map((o: Person) => {
      return {
        id: o._id,
        name: o.name
      }
    })
  )(Object.fromEntries(state.groundObjects));
  let newActorHTML = fp.sortBy('id', playables).map((user) => `<option value="${user.id}">${user.name}</option>`).join('');
  let oldActorHTML = document.getElementById(
    'playables'
  ).innerHTML;
  if (!fp.isEqual(oldActorHTML, newActorHTML)) {
    document.getElementById(
      'playables'
    ).innerHTML = newActorHTML;
  }
}

function __directionFromKey(event: KeyboardEvent): {dir: Direction, dist: number} {
  let dir: Direction, dist: number;
  dist = (event.shiftKey == true) ? 2 : 1;
  switch (event.key) {
    case "ArrowLeft":
      dir = Direction.Left;
      break;
    case "ArrowUp":
      dir = Direction.Up;
      break;
    case "ArrowRight":
      dir = Direction.Right;
      break;
    case "ArrowDown":
      dir = Direction.Down;
      break;
    default:
      dir = null;
  }
  return {dir, dist};
}

let start = new Main();