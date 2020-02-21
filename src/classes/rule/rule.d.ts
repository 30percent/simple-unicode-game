import { GameObject } from "../interfaces/GameObject";
export declare class Rule<T extends GameObject> {
    conditions: (() => boolean)[];
    action: (t: T) => T;
}
