import { Stringy, GameObject } from "./../interfaces/GameObject";
import { getVectorFromDirection } from "./../location";
import { getObjectById, State } from "./../state";
import * as fp from "lodash/fp";
import { Vector, Place } from "../location";
import { Direction } from "../structs/Direction";
import * as spritejs from 'spritejs';
import { Person } from "../person";
const { Scene, Path, Sprite, Group, Layer } = spritejs;

export function symbolLocationDraw(
  state: State,
  location: Place
) {
  return fp
    .map(y => {
      return fp
        .map(x => {
          let objectId = location.objectIdAtPosition(
            new Vector({ x: x, y: y })
          );
          if (!fp.isNil(objectId)) {
            let object = fp.find((obj: GameObject) => obj._id == objectId, Array.from(state.groundObjects.values()));
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
export async function spriteLocationDraw(
  state: State,
  location: Place,
  scene: spritejs.Scene
) {
  let size = location.roomLimit;
  // need to properly integrate, instead of wiping each time
  scene.removeAllChildren();
  const back_layer = scene.layer('background-1');
  const bgGroup = new Group();
  bgGroup.attr({
    size: [32*size.x, 32*size.y],
    pos: [0,0],
    anchor: [0,0]
  });
  back_layer.append(bgGroup);
  const fore_layer = scene.layer('foreground-1');
  return fp
    .map(y => {
      return fp
        .map(x => {
          let objectId = location.objectIdAtPosition(
            new Vector({ x: x, y: y })
          );
          if (!fp.isNil(objectId)) {
            let object = fp.find((obj: GameObject) => obj._id == objectId, Array.from(state.groundObjects.values()));
            
            if (object instanceof Person) {
              // TODO: We should be referencing from object
              const barbarian = new Sprite('barbarian.png');
              barbarian.attr({
                  pos: [x*32, (y-1)*32],
                  bgcolor: 'rgba(110,110,110,0)'
              });
              fore_layer.append(barbarian);
            } else if (object instanceof Place) {
              const door = new Sprite('ladder_hole_1.png');
              door.attr({
                  pos: [x*32, y*(32)],
                  bgcolor: 'rgba(110,110,110,0)'
              });
              fore_layer.append(door);
            }
            // TODO: background should be handled in separate loop
              const grass = new Sprite('grass_0_0.png');
              grass.attr({
                pos: [x*32, y*32]
              })
              bgGroup.append(grass);
          } else if (location.isWallAtPosition(new Vector({ x: x, y: y }))){
            const grass = new Sprite('wall_0_1.png');
            grass.attr({
              pos: [x*32, y*32]
            })
            bgGroup.append(grass);
          } else {
            const grass = new Sprite('grass_0_0.png');
            grass.attr({
              pos: [x*32, y*32]
            })
            bgGroup.append(grass);
            // return "_";
          }
        }, fp.range(0, location.roomLimit.x))
        .join(" | ");
    }, fp.range(0, location.roomLimit.y))
    .join("\n");
}

function openNeighbor(location: Place, vector: Vector): Vector {
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
  state: State,
  curLocation: Place,
  objectId: string,
  direction: Direction,
  amount: number
):{firstLoc: Place, secondLoc: Place} {
  let pos = getVectorFromDirection(curLocation, objectId, direction, amount);
  let objIdAtPos = curLocation.objectIdAtPosition(pos);
  if (!fp.isNil(objIdAtPos)) {
    let objAtPos = getObjectById(state, objIdAtPos)
    if(objAtPos instanceof Place) {
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
