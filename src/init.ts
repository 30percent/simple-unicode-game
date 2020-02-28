import { State, Routine, getCurrentLocation } from "./classes/state";
import { filterMapValue } from "./utils/mapUtils";
import { moveUser } from "./classes/routines/userControl";
import produce from "immer";
import { Person } from "./classes/person";
import { findMapValue } from "./utils/mapUtils";
import { pathSpeed } from "./classes/routines/interval";
import { getVectorDirection } from "./classes/enhancements/vector-enhancements";
import { Direction } from "./classes/structs/Direction";
import { doDamage } from "./classes/routines/combat";
import { Place } from "./classes/location";

import * as fp from 'lodash/fp';
import { parsePeople, parsePlaces } from "./parseConfig";
import { basicEnemyCombat } from "./classes/routines/basic-enemy-attack";

export function createSampleRoutines(
  state: State
): State {
  let routines: Routine[] = [
    /* Combat Routine */(state: State): State => {
      let activeLocation: Place = getCurrentLocation(state, state.userId);
      if (activeLocation.combat_zone) {
        return produce(state, (newState) => {
          newState = doDamage(newState, state.userId);
          return newState;
        })
      } else {
        return state;
      }
    },
    /* Kill people */ (state: State): State => {
      return produce(state, (draft) => {
        filterMapValue(draft.groundObjects, (go, _id) => go instanceof Person).forEach((person: Person) => {
          if (person.hp < 1 && draft.userId != person._id) {
            draft = draft.removeObject(person);
            let location = getCurrentLocation(draft, person._id);
            if (location != null) {
              location = location.removeObject(person._id);
              draft.groundObjects.set(location._id, location);
            }
          }
        });
        return draft;
      })
    },
    // Path delilah to margaret
    (state: State) => {
      return produce(state, (draft) => {
        const del = draft.groundObjects.get('delilah') as Person;
        const location: Place = findMapValue(draft.groundObjects, (go, _id) => go instanceof Place && go.objects.has(del._id)) as Place;
        const newLocation = pathSpeed(location, del, getVectorDirection(location.objects.get('margaret'), Direction.Up));
        draft.groundObjects.set(newLocation._id, newLocation);
        return draft;
      })
    },
    (state: State) => {
      // manage health stati
      return state;
    },
    (state: State) => {
      return moveUser(state);
    },
  ];
  return state.addRoutines(routines);
}

export async function initialiseState(): Promise<State> {
  let startState = createSampleRoutines(new State());
  return parsePeople(startState).then((state) => {
    return parsePlaces(state)
  });
}