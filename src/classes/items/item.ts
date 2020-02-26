
import { Stringy } from "./../interfaces/GameObject";
export type BaseItemParams = {
  _id: string, name: string
}
export class BaseItem implements Stringy{
  readonly _id: string;
  readonly name: string;

  constructor(params: BaseItemParams) {
    this._id = params._id;
    this.name = params.name;
  }

  asString() {
    return this.name;
  }
}