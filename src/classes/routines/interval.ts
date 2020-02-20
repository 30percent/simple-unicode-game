import { GameObject } from "../interfaces/GameObject";
import { HealthStatusHolder } from "./../interfaces/StatusEffects";
import { execHealthStatus } from "../interfaces/StatusEffects";
import { progressPath } from "./path";
import { Vector, Location } from "../location";
import { Person } from "../person";

function progressGO<T extends (...args: any[]) => any>(
  interval: number, 
  action: (...a: Parameters<T>) => ReturnType<T>,
  noop: (...a: Parameters<T>) => ReturnType<T> ) {
  let incr = 0;
  return (...a: Parameters<T>) => {
    if (incr < interval) {
      incr++;
      return noop(...a);
    } else {
      incr = 0;
      return action(...a);
    }
  }
}
export const healthProgress = progressGO<typeof execHealthStatus>(50, execHealthStatus, (go: HealthStatusHolder) => go);
export const pathSpeed = progressGO<typeof progressPath>(10, progressPath, (location: Location, ...a: any[]) => location);
