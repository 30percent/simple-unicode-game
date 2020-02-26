import { GameObject } from "../interfaces/GameObject";

// Handler of toggles and knobs
// For example:

export class Rule<T extends GameObject> {
  conditions: (() => boolean)[];
  action: (t: T) => T;
}
