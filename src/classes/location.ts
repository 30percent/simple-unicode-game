import { Record, Map, is } from "immutable";
import * as cuid from "cuid";
import * as fp from "lodash/fp";
import { Stringy, GameObject } from "./interfaces/GameObject";

export type LocationParams = {
  name: string;
  roomLimit: Vector;
  symbol?: string;
};

export enum Direction {
  Up,
  Down,
  Left,
  Right
}

export class Vector extends Record({ x: 0, y: 0 }) {
  x: number;
  y: number;
}

type VectorMut = {
  x: number;
  y: number;
};

export class Location
  extends Record({
    _id: 0,
    name: "__unnamed__",
    objects: Map<number, Vector>(),
    roomLimit: { x: 0, y: 0 } as Vector,
    symbol: "\u06E9"
  })
  implements GameObject {
  symbol: string;
  _id: number;
  name: string;
  // This seems counterintuitive, but we're only going to ever be modifying the Vector.
  objects: Map<number, Vector>;
  roomLimit: Vector;

  constructor(params: LocationParams) {
    let toSup = fp.assign(
      {
        _id: cuid()
      },
      params
    );
    super(toSup);
  }

  asString() {
    let objects = this.objects.valueSeq().toJS();
    let result = `Name: ${this.name}. Objects: ${objects.map((v: any) =>
      JSON.stringify(v)
    )}`;
    return result;
  }

  // Support difference sizes
  // Check conflicts
  addObject(pos: Vector, object: GameObject): Location {
    if (this.isPositionOccupied(pos) || !this.isPositionInbounds(pos)) {
      console.error(
        `Position: ${JSON.stringify(
          pos
        )} is occupied. ${object.asString()} was not added`
      );
      return this;
    }
    return this.set("objects", this.objects.set(object._id, pos)) as this;
  }

  hasObject(object: GameObject): boolean {
    return this.objects.has(object._id);
  }

  isPositionOccupied(pos: Vector): boolean {
    // Immutable adds an owner id which breaks basic fp.isEqual support.
    var toE = fp.pick(['x', 'y']);
    // cannot use "Map.includes" as there is no apparent way to enhance Immutable.is
    return !fp.isNil(this.objects.find(p => fp.isEqual(toE(pos), toE(p))));
  }

  objectIdAtPosition(pos: Vector): number {
    // Immutable adds an owner id which breaks basic fp.isEqual support.
    var toE = fp.pick(['x', 'y']);
    // cannot use "Map.includes" as there is no apparent way to enhance Immutable.is
    return this.objects.findKey(p => fp.isEqual(toE(pos), toE(p)));
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

// TODO: Add enter room logic
export function moveObject(
  location: Location,
  objectId: number,
  pos: Vector
): Location {
  if (!location.objects.has(objectId)) {
    console.error(`${objectId} was not found in ${location.name}.`);
    return location;
  } else if (location.isPositionOccupied(pos)) {
    console.error(
      `${objectId} could not be moved. Position in ${location.name} occupied.`
    );
    return location;
  } else if (!location.isPositionInbounds(pos)) {
    console.error(
      `${objectId} could not be moved. Position ${pos} in ${
        location.name
      } out of bounds.`
    );
    return location;
  }
  return location.setIn(["objects", objectId], pos) as Location;
}

export function simpleLocationDraw(location: Location) {
  return fp
    .map(y => {
      return fp
        .map(x => {
          return location.isPositionOccupied(new Vector({ x: x, y: y }))
            ? "o"
            : "_";
        }, fp.range(0, location.roomLimit.x))
        .join(" | ");
    }, fp.range(0, location.roomLimit.y))
    .join("\n");
}

export function moveDirection(
  location: Location,
  objectId: number,
  direction: Direction,
  amount: number
): Location {
  let curLoc: Vector = location.objects.get(objectId);
  let newLoc: Vector;
  switch (direction) {
    case Direction.Up:
      newLoc = curLoc.set("y", curLoc.y - amount) as Vector;
      break;
    case Direction.Down:
      newLoc = curLoc.set("y", curLoc.y + amount) as Vector;
      break;
    case Direction.Left:
      newLoc = curLoc.set("x", curLoc.x - amount) as Vector;
      break;
    case Direction.Right:
      newLoc = curLoc.set("x", curLoc.x + amount) as Vector;
      break;
    default:
      console.error();
  }
  return moveObject(location, objectId, new Vector(newLoc));
}
