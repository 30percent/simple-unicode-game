import { Record, Set } from "immutable";
import { HealthInt } from "./Health";
import { GameObject } from "./GameObject";

export enum HealthStatus {
  Poison
}

export abstract class HealthStatusHolder extends Record({hp: 0, healthStatuses: Set<HealthStatus>()}) implements HealthInt {
  healthStatuses: Set<HealthStatus>;
  hp: number;

}

export function isHealthStatusHolder(obj: any): obj is HealthStatusHolder{
    return obj['healthStatuses'];
}

export function addHealthStatus<T extends HealthStatusHolder>(
  obj: T,
  status: HealthStatus
): T {
  return obj.set("healthStatuses", obj.healthStatuses.add(status)) as T;
}

export function removeHealthStatus<T extends HealthStatusHolder>(
  obj: T,
  status: HealthStatus
): T {
    return obj.set("healthStatuses", obj.healthStatuses.remove(status)) as T;
}

export function execHealthStatus<T extends HealthStatusHolder>(obj: T): T {
  return obj.withMutations((mutObj: T) => {
    mutObj.healthStatuses.forEach(status => {
      switch (status) {
        case HealthStatus.Poison:
          mutObj.set("hp", mutObj.hp - 1);
          break;
        default:
          break;
      }
      return mutObj;
    });
  }) as T;
}
