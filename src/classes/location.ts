import { assign, map, find, findKey, cloneDeep, range } from 'lodash';
import { GameObject } from "./interfaces/GameObject";
import * as cuid from 'cuid';
import * as fp from 'lodash/fp';
import { Direction } from './structs/Direction';


type VectorMut = {
  x: number;
  y: number;
};


export class Vector {
  x: number;
  y: number;
  constructor(params: VectorMut) {
    assign(this, params);
  }
  toString() {
    return `[${this.x}, ${this.y}]`
  }
}

export type LocationParams = {
  name: string;
  roomLimit: Vector;
  symbol?: string;
  _id?: string;
  combat_zone?: boolean;
};

export class Place implements GameObject {
  symbol: string = '\u06E9';
  _id: string;
  name: string;
  // This seems counterintuitive, but we're only going to ever be modifying the Vector.
  objects: Map<string, Vector>;
  walls: Vector[];
  roomLimit: Vector;
  combat_zone: boolean = false;

  constructor(params: LocationParams) {
    assign<Place, Partial<Place>>(
      this,
      {
        _id: (params._id) ? params._id : cuid(),
        objects: new Map<string, Vector>(),
        walls: [],
        ...params
      }
    );
  }

  asString() {
    let result = `Name: ${this.name}. Objects: ${map(this.objects, (v: any) =>
      JSON.stringify(v),
    )}`;
    return result;
  }

  // Support different sizes
  // Check conflicts
  addObject(pos: Vector, objectId: string): Place {
    if (!this.validPos(pos)) {
      console.error(
        `Position: ${JSON.stringify(
          pos,
        )} is occupied. ${objectId} was not added`,
      );
      return this;
    }
    return fp.set( 'objects', this.objects.set(objectId, pos), this);
  }

  addWall(pos: Vector): Place {
    if (!this.validPos(pos)) {
      console.error(
        `Position: ${JSON.stringify(
          pos,
        )} is occupied. Wall was not added`,
      );
      return this;
    }
    this.walls.push(pos);
    return this;
  }

  removeObject(objectId: string): Place {
    let newLoc = cloneDeep(this.objects);
    newLoc.delete(objectId);
    return fp.set('objects', newLoc, this);
  }

  setObjectLocation(objectId: string, pos: Vector): Place {
    if (!this.validPos(pos)) {
      console.error(
        `Position: ${JSON.stringify(
          pos,
        )} is occupied. ${objectId} was not added`,
      );
      return this;
    }
    return fp.set('objects', this.objects.set(objectId, pos), this);
  }

  validPos(pos: Vector): boolean {
    return !this.isPositionOccupied(pos) && this.isPositionInbounds(pos);
  }

  isPositionOccupied(pos: Vector): boolean {
    // Immutable adds an owner id which breaks basic fp.isEqual support.
    const toE = fp.pick(['x', 'y']);
    const objOccupies = !fp.isNil(find(Array.from(this.objects.values()),(p) => fp.isEqual(toE(pos), toE(p))));
    const wallOccupies = this.isWallAtPosition(pos);
    return objOccupies || wallOccupies;
  }

  isWallAtPosition(pos: Vector): boolean {
    return !fp.isNil(find(this.walls, (w) => w.toString() === pos.toString()));
  }

  objectIdAtPosition(pos: Vector): string {
    const toE = fp.pick(['x', 'y']);
    for(let entry of this.objects) {
      if (fp.isEqual(toE(pos), toE(entry[1]))){
        return entry[0];
      }
    }
  }

  positionObjectAt(id: string): Vector | null {
    return this.objects.get(id);
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
  location: Place,
  objectId: string,
  pos: Vector,
): Place {
  return location.setObjectLocation(objectId, pos);
}

export function simpleLocationDraw(location: Place) {
  return fp
    .map((y) => {
      return fp
        .map((x) => {
          return location.isPositionOccupied(new Vector({ x: x, y: y }))
            ? 'o'
            : '_';
        }, fp.range(0, location.roomLimit.x))
        .join(' | ');
    }, fp.range(0, location.roomLimit.y))
    .join('\n');
}

export function getLocationMatrix(location: Place): number[][] {
  let marked: number[][] = map(range(0, location.roomLimit.x), (x) => {
    return map(range(0, location.roomLimit.y), (y) => 
      !location.validPos(new Vector({x, y})) ? 10000 : 1
    )
  });
  return marked;
}

export function getVectorFromDirection(
  location: Place,
  objectId: string,
  direction: Direction,
  amount: number,
) {
  let curLoc: Vector = location.objects.get(objectId);
  let newLoc: Vector = curLoc;
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
      // do nothing (keep position);
      break;
  }
  return newLoc;
}

export function moveDirection(
  location: Place,
  objectId: string,
  direction: Direction,
  amount: number,
): Place {
  let curLoc: Vector = location.objects.get(objectId);
  let newLoc: Vector = curLoc;
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
      // do nothing (keep position);
      break;
  }
  return moveObject(location, objectId, new Vector(newLoc));
}
