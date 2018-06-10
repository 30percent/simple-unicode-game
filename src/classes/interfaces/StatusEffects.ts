import { HealthInt } from './Health';
import { GameObject } from './GameObject';
import { hasIn, set } from 'lodash/fp';

export enum HealthStatus {
  Poison,
}

export interface HealthStatusHolder extends HealthInt {
  healthStatuses: Set<HealthStatus>;
}

export function isHealthStatusHolder(obj: any): obj is HealthStatusHolder {
  return hasIn('healthStatuses', obj);
}

export function addHealthStatus<T extends HealthStatusHolder>(
  obj: T,
  status: HealthStatus,
): T {
  obj.healthStatuses.add(status);
  return obj;
  // return set('healthStatuses', obj.healthStatuses.add(status), obj);
}

export function removeHealthStatus<T extends HealthStatusHolder>(
  obj: T,
  status: HealthStatus,
): T {
  obj.healthStatuses.delete(status);
  return obj;
  // return obj.set("healthStatuses", obj.healthStatuses.remove(status)) as T;
}

export function execHealthStatus<T extends HealthStatusHolder>(obj: T): T {
  obj.healthStatuses.forEach((element) => {
    switch (
      +status // need to convert to a number to appease typescript...
    ) {
      case HealthStatus.Poison:
        obj.hp -= 1;
        if (obj.hp <= 1) removeHealthStatus(obj, HealthStatus.Poison);
        break;
      default:
        break;
    }
  });

  return obj;
}
