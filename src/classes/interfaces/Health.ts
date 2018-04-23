
import { Record } from "immutable";

export abstract class HealthInt extends Record({hp: 0}) {
    hp: number;
}

export function modifyHealth<T extends HealthInt>(obj: T, num: number): T {
    return obj.set('hp', obj.hp + num) as T;
}
export function isDead(obj: HealthInt): boolean {
    return obj.hp <= 0;
}