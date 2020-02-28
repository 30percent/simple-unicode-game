import { State } from "../state";
import produce from "immer";
import { basicEnemyCombatPlayer } from "./basic-enemy-attack";


const approachPlayer = (activeId: string) => {
  return (state: State) => {
    if (state.groundObjects.get(activeId)){
      return produce(state, (draft) => {
          return basicEnemyCombatPlayer(activeId, draft)
      })
    } else {
      return state;
    }
  }
}

export default {
  approachPlayer
}