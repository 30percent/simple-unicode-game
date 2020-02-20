import * as cuid from "cuid";
import { assign } from "lodash";
import { GameObject } from "./interfaces/GameObject";

export type BlockageParams = {
  name: string;
  symbol?: string;
};

export class Blockage
  implements GameObject {
  symbol: any = '\u04FF';
  _id: string;
  name: string;

  constructor(params: BlockageParams) {
    assign<Blockage, Partial<Blockage>>(
      this,
      {
        _id: cuid(),
        ...params
      }
    );
  }
  asString() {
    return `${this.name}`;
  }
}
