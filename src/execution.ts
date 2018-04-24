import { Person } from "./classes/person";
import { Stringy } from "./classes/interfaces/GameObject";
import { createPaceFoo } from "./classes/routines/pace";
import { isHealthStatusHolder } from "./classes/interfaces/StatusEffects";
import { HealthStatus } from "./classes/interfaces/StatusEffects";
import { addHealthStatus } from "./classes/interfaces/StatusEffects";
import { execHealthStatus } from "./classes/interfaces/StatusEffects";
import { HealthInt } from "./classes/interfaces/Health";
import {
  Location,
  moveObject,
  moveDirection,
  Direction,
  Vector,
  simpleLocationDraw
} from "./classes/location";
import { List } from "immutable";
import { modifyHealth } from "./classes/interfaces/Health";
import { GameObject } from "./classes/interfaces/GameObject";
import * as fp from "lodash/fp";
import { HealthStatusHolder } from "./classes/interfaces/StatusEffects";
import { tickFoo } from "./classes/routines/tick";
import * as Promise from "bluebird";

function __getId(object: GameObject | number): number {
  return fp.isObject(object) ? (object as GameObject)._id : (object as number);
}

let state = List<GameObject>();
let paceRight = createPaceFoo(4, Direction.Right);
export function init() {
  let marg = new Person({ name: "Margaret", hp: 10 });
  let mary = new Person({ name: "Mary", hp: 10 });
  let childRoom = new Location({
    name: "Bedroom",
    roomLimit: new Vector({ x: 4, y: 4 }),
    symbol: "\u0298"
  });
  let jack = addHealthStatus(
    modifyHealth(new Person({ name: "Jack", hp: 10, symbol: "J" }), -2),
    HealthStatus.Poison
  );
  let home = new Location({
    name: "Home",
    roomLimit: new Vector({ x: 10, y: 10 })
  })
    .addObject(new Vector({ x: 0, y: 3 }), mary)
    .addObject(new Vector({ x: 0, y: 4 }), jack)
    .addObject(new Vector({ x: 5, y: 7}), childRoom);

  state = List<GameObject>([home, jack, mary, marg, childRoom]);
}


// Replace with Generator at earliest convenience
export function startTicking(toCall: (currentLocation: List<GameObject>) => any) {
    let inState = state;
    tickFoo(0, 500, () => {
        return Promise.method((input) => {
            inState = tick(inState);
            return inState;
          })(null).then(toCall);
    })
  
}
let toMove: Direction = null;
export function moveYou(direction: Direction) {
    toMove = direction;
}

function tick(state: List<GameObject>): List<GameObject> {
  return state.map((object: GameObject, index: number) => {
    let newO = object;
    if (isHealthStatusHolder(object)) {
      newO = execHealthStatus(object);
    }
    if (index == 0 && object instanceof Location) {
      newO = paceRight(object, __getId(state.get(2))); // just an example...
      if(toMove !== null) {
            newO = moveDirection(newO as Location, __getId(state.get(1)), toMove, 1);
          toMove = null;
      }
    }
    return newO;
  }) as List<GameObject>;
}

function clearStdout() {
  process.stdout.write("\x1B[2J\x1B[0f");
}