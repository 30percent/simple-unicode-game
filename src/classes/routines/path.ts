import { Person } from "../person";
import PriorityQueue from 'tinyqueue';
import { Vector, Place, getLocationMatrix } from "../location";
import { forEach, get, filter, map } from "lodash";
import { isObject } from "util";

type QueueEntry = {
  loc: Vector;
  cost: number;
}
export function manhattanH(start: Vector, goal: Vector) {
  return (Math.abs(start.x - goal.x) + Math.abs(start.y - goal.y));
}
function getMatItem(matrix: number[][], vector: Vector) {
  return get(matrix, `[${vector.x}][${vector.y}]`)
}
function matNeighbors(matrix: number[][], vector: Vector): Vector[] {
  let matR: Vector[] = [];
  let potentials: Vector[] = [
    new Vector({ x: vector.x - 1, y: vector.y }),
    new Vector({ x: vector.x , y: vector.y - 1}),
    new Vector({ x: vector.x + 1, y: vector.y }),
    new Vector({ x: vector.x , y: vector.y + 1 })
  ];
  return filter(
    map(potentials, (path) => {
      return getMatItem(matrix, path) ? path : null
    }),
    isObject
  )
}
export function getPath(location: Place, person: Person, destination: Vector): Vector[] {
  const start: Vector = location.positionObjectAt(person._id);
  if (destination.toString() === start.toString()) {
    return [];
  }
  const matrix = getLocationMatrix(location);
  const openList= new PriorityQueue<QueueEntry>([], (a: QueueEntry, b: QueueEntry) => a.cost - b.cost);
  let came_from: Map<string, Vector> = new Map();
  let cost_so_far: Map<string, number> = new Map();
  
  came_from.set(start.toString(), null);
  cost_so_far.set(start.toString(), 0);
  openList.push({loc: start, cost: 0});
  while(openList.length > 0) {
    let current = openList.pop();
    if (current.loc.x === destination.x && current.loc.y === destination.y) {
      break;
    }

    forEach(matNeighbors(matrix, current.loc), (next) => {
      let cost = cost_so_far.get(current.loc.toString()) + getMatItem(matrix, next);
      if (!cost_so_far.has(next.toString()) || cost_so_far.get(next.toString()) > cost) {
        cost_so_far.set(next.toString(), cost);
        openList.push({loc: next, cost: cost + manhattanH(next, destination)});
        came_from.set(next.toString(), current.loc);
      }
    })
  }
  let current = destination;
  let final = [current];
  let breakValve = openList.data.length;
  while (current.toString() !== start.toString() && breakValve > 0){
    current = came_from.get(current.toString());
    final.push(current);
    breakValve --;
  } 
  return (current.toString() === start.toString()) ? final.reverse() : [];
}

export function progressPath(location: Place, person: Person, destination: Vector): Place {
  let path = getPath(location, person, destination);
  if (path.length > 0) {
    return location.setObjectLocation(person._id, path[1]);
  }
  return location;
}