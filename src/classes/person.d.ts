import { HealthStatus } from "./interfaces/StatusEffects";
import { GameObject } from "./interfaces/GameObject";
import { HealthInt } from "./interfaces/Health";
export declare type PersonParams = {
    name: string;
    hp: number;
    symbol?: string;
    _id?: string;
};
export declare class Person implements GameObject, HealthInt {
    symbol: any;
    hp: number;
    _id: string;
    name: string;
    healthStatuses: Set<HealthStatus>;
    constructor(params: PersonParams);
    asString(): string;
    setHealth(hp: number): Person;
    removeStatus(status: HealthStatus): Person;
    addHealthStatus(status: HealthStatus): Person;
}
