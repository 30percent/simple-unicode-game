import * as cuid from 'cuid';
import * as fp from 'lodash/fp';
import { Stringy, GameObject } from './interfaces/GameObject';
import { assign } from 'lodash';
export type Identifier = number;
export type LocationParams = {
  name: string;
  roomLimit: Vector;
  symbol?: string;
};

export enum Direction {
  Up,
  Down,
  Left,
  Right,
}

export interface Vector {
  x: number;
  y: number;
}

export function vectEqual(first: Vector, second: Vector): boolean {
  let simp = fp.pick(['x', 'y']);
  return fp.equals(simp(first), simp(second));
}

type VectorMut = {
  x: number;
  y: number;
};

export class Location implements GameObject {
  symbol: string = '\u0298';
  _id: number;
  name: string;
  solid: boolean;
  // This seems counterintuitive, but we're only going to ever be modifying the Vector.
  objects: Map<Identifier, Vector>;
  roomLimit: Vector;

  constructor(params: LocationParams) {
    let toSup = fp.assign(
      {
        _id: cuid(),
        objects: new Map<number, Vector>(),
      },
      params,
    );
    Object.assign(this, toSup);
  }

  asString() {
    let objects = Array.from(this.objects.values());
    let result = `Name: ${this.name}. Objects: ${objects.map((v: any) =>
      JSON.stringify(v),
    )}`;
    return result;
  }

  // Support difference sizes
  // Check conflicts
  addObject(pos: Vector, objectId: number): Location {
    if (this.isPositionOccupied(pos) || !this.isPositionInbounds(pos)) {
      console.error(
        `Position: ${JSON.stringify(
          pos,
        )} is occupied. ${objectId} was not added`,
      );
      return this;
    }
    this.objects.set(objectId, pos);
    return this;
  }

  hasObject(object: GameObject): boolean {
    return this.objects.has(object._id);
  }

  isPositionOccupied(pos: Vector): boolean {
    // Immutable adds an owner id which breaks basic fp.isEqual support.
    var toE = fp.pick(['x', 'y']);
    return (
      fp.find(
        (p) => fp.isEqual(toE(p), pos),
        Array.from(this.objects.values()),
      ) != null
    );
  }

  objectIdAtPosition(pos: Vector): number {
    // Immutable adds an owner id which breaks basic fp.isEqual support.
    var toE = fp.pick(['x', 'y']);
    // cannot use "Map.includes" as there is no apparent way to enhance Immutable.is
    return fp.flow(
      fp.find((entry) => fp.isEqual(toE(entry[1]), pos)),
      fp.get('0'),
    )(Array.from(this.objects.entries()));
  }

  isPositionInbounds(pos: Vector): boolean {
    return (
      pos.x < this.roomLimit.x &&
      pos.x >= 0 &&
      pos.y < this.roomLimit.y &&
      pos.y >= 0
    );
  }
}

export function addObjectToLocation(
  location: Location,
  objectId: number,
  pos: Vector,
) {
  if (location.isPositionOccupied(pos) || !location.isPositionInbounds(pos)) {
    return location;
  }
  location.objects.set(objectId, pos);
  return location;
}

// TODO: Add enter room logic
export function moveObject(
  location: Location,
  objectId: number,
  pos: Vector,
): Location {
  if (!location.objects.has(objectId)) {
    console.error(`${objectId} was not found in ${location.name}.`);
    return location;
  } else if (location.isPositionOccupied(pos)) {
    console.error(
      `${objectId} could not be moved. Position in ${location.name} occupied.`,
    );
    return location;
  } else if (!location.isPositionInbounds(pos)) {
    console.error(
      `${objectId} could not be moved. Position ${pos} in ${
        location.name
      } out of bounds.`,
    );
    return location;
  }
  location.objects.set(objectId, pos);
  return location;
}

export function simpleLocationDraw(location: Location) {
  return fp
    .map((y) => {
      return fp
        .map((x) => {
          return location.isPositionOccupied({ x: x, y: y }) ? 'o' : '_';
        }, fp.range(0, location.roomLimit.x))
        .join(' | ');
    }, fp.range(0, location.roomLimit.y))
    .join('\n');
}

export function getVectorFromDirection(
  location: Location,
  objectId: number,
  direction: Direction,
  amount: number,
) {
  let curLoc: Vector = location.objects.get(objectId);
  let newLoc: Vector = fp.clone(curLoc);
  switch (direction) {
    case Direction.Up:
      newLoc = fp.set('y', curLoc.y - amount, curLoc) as Vector;
      break;
    case Direction.Down:
      newLoc = fp.set('y', curLoc.y + amount, curLoc) as Vector;
      break;
    case Direction.Left:
      newLoc = fp.set('x', curLoc.x - amount, curLoc) as Vector;
      break;
    case Direction.Right:
      newLoc = fp.set('x', curLoc.x + amount, curLoc) as Vector;
      break;
    default:
      //do nothing (keep position);
      break;
  }
  return newLoc;
}

export function moveDirection(
  location: Location,
  objectId: number,
  direction: Direction,
  amount: number,
): Location {
  let curLoc: Vector = location.objects.get(objectId);
  let newLoc = getVectorFromDirection(location, objectId, direction, amount);
  return moveObject(location, objectId, newLoc);
}
