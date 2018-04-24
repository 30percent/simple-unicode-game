import { Record, Set } from "immutable";
import { HealthInt } from "./Health";
export declare enum HealthStatus {
    Poison = 0,
}
declare const HealthStatusHolder_base: Record.Class;
export declare abstract class HealthStatusHolder extends HealthStatusHolder_base implements HealthInt {
    healthStatuses: Set<HealthStatus>;
    hp: number;
}
export declare function isHealthStatusHolder(obj: any): obj is HealthStatusHolder;
export declare function addHealthStatus<T extends HealthStatusHolder>(obj: T, status: HealthStatus): T;
export declare function removeHealthStatus<T extends HealthStatusHolder>(obj: T, status: HealthStatus): T;
export declare function execHealthStatus<T extends HealthStatusHolder>(obj: T): T;
