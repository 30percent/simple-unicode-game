import { Record } from "immutable";
declare const HealthInt_base: Record.Class;
export declare abstract class HealthInt extends HealthInt_base {
    hp: number;
}
export declare function modifyHealth<T extends HealthInt>(obj: T, num: number): T;
export declare function isDead(obj: HealthInt): boolean;
