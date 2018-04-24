
import { Stringy, GameObject } from "./../interfaces/GameObject";
import { List } from "immutable";
import * as fp from "lodash/fp";
import { Vector, Location } from "../location";
import { Person } from "../person";


export function symbolLocationDraw(location: Location, state: List<GameObject>) {
    return fp
      .map(y => {
        return fp
          .map(x => {
            let objectId = location.objectIdAtPosition(new Vector({ x: x, y: y }));
            if(!fp.isNil(objectId)){
              let object = state.find((obj: GameObject) => obj._id == objectId);
              if(object){
                return object.symbol
              } else {
                return "o"
              }
            } else {
              return "_"
            }
          }, fp.range(0, location.roomLimit.x))
          .join(" | ");
      }, fp.range(0, location.roomLimit.y))
      .join("\n");
  }
  