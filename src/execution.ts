import * as fp from 'lodash/fp';
import * as _ from 'lodash';
import { doDamage } from "./classes/routines/combat";
import { Blockage } from "./classes/block";

import { locationMoveDirectionWithEntry } from './classes/enhancements/location-enhancements';
import { GameObject } from './classes/interfaces/GameObject';
import { modifyHealth } from './classes/interfaces/Health';
import {
  addHealthStatus,
  execHealthStatus,
  HealthStatus,
  isHealthStatusHolder,
} from './classes/interfaces/StatusEffects';
import { Place, Vector } from './classes/location';
import { Person } from './classes/person';
import { createPaceFoo, createClampedWander } from './classes/routines/pace';
import { tickFoo } from './classes/routines/tick';
import { getCurrentLocation, locationContaining, getObjectByPred, State, progressRoutines, Routine } from './classes/state';
import { isNil, find, noop } from 'lodash';
import { Direction } from './classes/structs/Direction';
import { getVectorDirection } from './classes/enhancements/vector-enhancements';
import { healthProgress, pathSpeed } from './classes/routines/interval';
import { Weapon } from './classes/items/weapon';
import produce from 'immer';
import { findMapValue } from './utils/mapUtils';

// Replace with Generator at earliest convenience
export function startTicking(
  state: State,
  curLocation: Place,
  toCall: (state: State) => any
) {
  let count = 0;
  let time = 100;
  let iter = 0;
  let lastState = state;
  let lastLoc = curLocation;
  let interval: any;
  function _next() {
    iter++;
    lastState = tick(lastState);
    toCall(lastState);
    if (count > 0 && iter >= count) {
      clearInterval(interval);
    }
    console.log(`Ran tick: ${iter}/${count}`)
  }
  interval = setInterval(_next, time);
  return interval;
}

export function manualTick(
  state: State,
  toCall: (state: State) => any
) {
  toCall(tick(state));
}

function tick(oldState: State): State {
  return progressRoutines(oldState);
}

function clearStdout() {
  // undefined in
  process.stdout.write('\x1B[2J\x1B[0f');
}
