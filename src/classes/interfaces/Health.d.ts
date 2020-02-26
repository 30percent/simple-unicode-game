export interface HealthInt {
    hp: number;
}
export declare function modifyHealth<T extends HealthInt>(obj: T, num: number): T;
export declare function isDead(obj: HealthInt): boolean;
