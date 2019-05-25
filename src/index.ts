import { init, startTicking, moveYou } from './execution';
import { Direction, simpleLocationDraw, Location } from './classes/location';
import { List, Set } from 'immutable';
import { GameObject } from './classes/interfaces/GameObject';
import { getCurrentLocation } from './classes/state';
import { symbolLocationDraw } from './classes/enhancements/location-enhancements';
import { Person } from './classes/person';
import { createDummies, LinkStatics, Link, createGraphView, dummyGraph } from './testbed/depgraph';

const css = require('./main.css');

export default class Main {
  constructor() {
    console.log('Typescript Webpack starter launched');
    // this.startGameLoop();
    let dummies = createDummies();
    // LinkStatics.addLink({
    //   from: dummies[0],
    //   to: dummies[1],
    //   asynchronous: true,
    // });
    // LinkStatics.addLink({
    //   to: dummies[3],
    //   from: dummies[1],
    //   asynchronous: false,
    // });
    // LinkStatics.addLink({
    //   from: dummies[1],
    //   to: dummies[0],
    //   asynchronous: true,
    // });
    dummyGraph(dummies)
    // document.addEventListener('keyup', function () {
      let no = LinkStatics.isConnectedAsync(dummies[0], dummies[1]);
      let yes = LinkStatics.isConnectedAsync(dummies[3], dummies[0]);

      let docStr = `First Locked?: ${no}. What about Second?: ${yes}.
        Can I work on ${dummies[0].getName()}: ${LinkStatics.canIWork(
        dummies[0],
      )}
        What about ${dummies[1].getName()}: ${LinkStatics.canIWork(dummies[1])}
      `;
      document.getElementById('first-location').innerHTML = `${docStr}`;
      let hatcheTeeEmEll = dummies.map((dum) => {
        return `<div>${createGraphView(dum)}</div>`
      })
      document.getElementById('current-tick').innerHTML = hatcheTeeEmEll.join('<hr/>');
    // });
    let windowAny: any = window;
    windowAny.itermap = function itermap<S, T>(iter: Iterator<S>, cb: (s: S) => T): T[] {
      let iterNext = iter.next();
      let ret: T[] = [];
      while (!iterNext.done) {
        ret.push(cb(iterNext.value));
      }
      return ret;
    }
  }

  startGameLoop = () => {
    let startState = init();
    let userId = startState.find((obj: GameObject) => obj.symbol === 'J')._id;
    let startLocation: Location = getCurrentLocation(startState, userId);
    startTicking(startState, startLocation, (curState: Set<GameObject>) => {
      let curLocation = getCurrentLocation(curState, userId);
      if (curLocation == null)
        document.getElementById('first-location').innerHTML = '';
      else {
        document.getElementById(
          'first-location',
        ).innerHTML = symbolLocationDraw(curState, curLocation);
      }
      document.getElementById('person-info').innerHTML = curState
        .filter((obj) => {
          return obj instanceof Person;
        })
        .map((person) => person.asString())
        .sort()
        .join('\n');
    });
    document.addEventListener('keyup', (event) => {
      moveYou(__directionFromKey(event));
    });
  };
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
