import { HealthStatusHolder, HealthStatus } from "./interfaces/StatusEffects";
import { GameObject } from "./interfaces/GameObject";
import { HealthInt } from "./interfaces/Health";
export declare type PersonParams = {
    name: string;
    hp: number;
    symbol?: string;
    _id?: string;
};
export declare class Person implements GameObject, HealthInt, HealthStatusHolder {
    symbol: any;
    hp: number;
    _id: string;
    name: string;
    healthStatuses: Set<HealthStatus>;
    constructor(params: PersonParams);
    asString(): string;
    setHealth<T extends HealthStatusHolder>(hp: number): T;
    removeStatus<T extends HealthStatusHolder>(status: HealthStatus): T;
}
