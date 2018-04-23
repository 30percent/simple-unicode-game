import { Person } from "./classes/person";
import { Location, moveObject, moveDirection, Direction, Vector } from "./classes/location";
import { List } from "immutable";
import { modifyHealth } from "./classes/interfaces/Health";
import { GameObject } from "./classes/interfaces/GameObject";
import * as fp from "lodash/fp";

function __getId(object: GameObject | number): number {
    return fp.isObject(object) ? (object as GameObject)._id : (object as number);
  }
  
let marg = new Person({name: "Margaret", hp: 10});
let mary = new Person({name: "Mary", hp: 10});
let jack = modifyHealth(new Person({name: "Jack", hp: 10}), -2);
let home = new Location({name: "Home", roomLimit: new Vector({x: 10, y: 10})})
    .addObject(new Vector({x: 0, y: 3}), mary)
    .addObject(new Vector({x: 0, y: 4}), jack);
    
console.log(home.asString());
home = moveDirection(home, __getId(mary), Direction.Left, 4);
console.log(home.asString());
console.log(home.drawRoom());
