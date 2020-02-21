import { GameObject } from "./GameObject";
import { HealthInt } from './Health';
export declare enum HealthStatus {
    Poison = 0
}
export interface HealthStatusHolder extends HealthInt, GameObject {
    healthStatuses: Set<HealthStatus>;
    hp: number;
    setHealth<T extends HealthStatusHolder>(hp: number): T;
    removeStatus<T extends HealthStatusHolder>(status: HealthStatus): T;
}
export declare function isHealthStatusHolder(obj: any): obj is HealthStatusHolder;
export declare function addHealthStatus<T extends HealthStatusHolder>(obj: T, status: HealthStatus): T;
export declare function removeHealthStatus<T extends HealthStatusHolder>(obj: T, status: HealthStatus): T;
export declare function execHealthStatus<T extends HealthStatusHolder>(obj: T): T;
