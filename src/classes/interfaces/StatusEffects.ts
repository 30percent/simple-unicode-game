import { has, concat } from 'lodash';
import { Stringy, GameObject } from "./GameObject";
import { HealthInt } from './Health';
import * as fp from 'lodash/fp';

export enum HealthStatus {
  Poison
}

export interface HealthStatusHolder extends HealthInt, GameObject {
  healthStatuses: Set<HealthStatus>;
  hp: number;
  
  setHealth<T extends HealthStatusHolder>(hp: number): T;

  removeStatus<T extends HealthStatusHolder>(status: HealthStatus): T;
  
}

export function isHealthStatusHolder(obj: any): obj is HealthStatusHolder {
  return has(obj, 'healthStatuses');
}

export function addHealthStatus<T extends HealthStatusHolder>(obj: T, status: HealthStatus): T {
  return fp.set('healthStatuses', obj.healthStatuses.add(status), obj);
}

export function removeHealthStatus<T extends HealthStatusHolder>(
  obj: T,
  status: HealthStatus
): T {
    return fp.set("healthStatuses", obj.healthStatuses.delete(status), obj) as T;
}

export function execHealthStatus<T extends HealthStatusHolder>(obj: T): T {
  obj.healthStatuses.forEach(status => {
    switch(status) {
      case HealthStatus.Poison:
       if (obj.hp <= 1) {
         obj = obj.removeStatus(HealthStatus.Poison) 
       } else {
         obj = obj.setHealth(obj.hp - 1);
       }
        break;
      default:
        break;
    }
  });
  return obj;
}