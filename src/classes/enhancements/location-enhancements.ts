import { Stringy, GameObject } from "./../interfaces/GameObject";
import { getVectorFromDirection } from "./../location";
import { getObjectById } from "./../state";
import * as fp from "lodash/fp";
import { Vector, Location } from "../location";
import { Direction } from "../structs/Direction";

export function symbolLocationDraw(
  state: Map<string, GameObject>,
  location: Location
) {
  return fp
    .map(y => {
      return fp
        .map(x => {
          let objectId = location.objectIdAtPosition(
            new Vector({ x: x, y: y })
          );
          if (!fp.isNil(objectId)) {
            let object = fp.find((obj: GameObject) => obj._id == objectId, Array.from(state.values()));
            if (object) {
              return object.symbol;
            } else {
              return "o";
            }
          } else if (location.isWallAtPosition(new Vector({ x: x, y: y }))){
            return '\u04FF'
          } else {
            return "_";
          }
        }, fp.range(0, location.roomLimit.x))
        .join(" | ");
    }, fp.range(0, location.roomLimit.y))
    .join("\n");
}
function openNeighbor(location: Location, vector: Vector): Vector {
  let matR: Vector[] = [];
  let potentials: Vector[] = [
    new Vector({ x: vector.x - 1, y: vector.y }),
    new Vector({ x: vector.x , y: vector.y - 1}),
    new Vector({ x: vector.x + 1, y: vector.y }),
    new Vector({ x: vector.x , y: vector.y + 1 })
  ];
  let available = fp.filter(
    fp.isObject,
    fp.map((path) => {
      return location.validPos(path) ? path : null
    }, potentials)
  ) as Vector[];
  return fp.get('0', available);
}
export function locationMoveDirectionWithEntry(
  state: Map<string, GameObject>,
  curLocation: Location,
  objectId: string,
  direction: Direction,
  amount: number
):{firstLoc: Location, secondLoc: Location} {
  let pos = getVectorFromDirection(curLocation, objectId, direction, amount);
  let objIdAtPos = curLocation.objectIdAtPosition(pos);
  if (!fp.isNil(objIdAtPos)) {
    let objAtPos = getObjectById(state, objIdAtPos)
    if(objAtPos instanceof Location) {
      // Enter room (move object out of room into new room)
      // Get new placement 
      // TODO: (this mess needs to be fixed/cleaned)
      let newPos = objAtPos.objects.get(curLocation._id);
      if(newPos) {
        newPos = openNeighbor(objAtPos, newPos);
      } else {
        newPos = new Vector({x: 0, y: 0})
      }
      return {
        firstLoc: curLocation.removeObject(objectId),
        secondLoc: objAtPos.setObjectLocation(objectId, newPos)
      }
    } else {
      // Location occupied by non-entry point, no locations were modified, no need to do anything
      return {firstLoc: null, secondLoc: null};
    }
  } else if(!curLocation.isPositionInbounds(pos)){
    return null;
  }
  return {
    firstLoc: curLocation.setObjectLocation(objectId, pos),
    secondLoc: null
  };
  
}
