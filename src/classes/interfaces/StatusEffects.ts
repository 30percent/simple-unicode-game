import { has, concat } from 'lodash';
import { HealthInt } from './Health';
import * as fp from 'lodash/fp';

export enum HealthStatus {
  Poison
}

export abstract class HealthStatusHolder implements HealthInt {
  healthStatuses: Set<HealthStatus>;
  hp: number;
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
        (obj.hp <= 1) ? obj.healthStatuses.delete(HealthStatus.Poison) : fp.set("hp", obj.hp - 1, obj);
        break;
      default:
        break;
    }
  });
  return obj;
}