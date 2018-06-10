import * as fp from 'lodash/fp';
import * as cuid from 'cuid';

import { GameObject } from './interfaces/GameObject';
import { assign } from 'lodash';

export type FurnitureParams = {
  name: string;
  symbol?: string;
  effect?: (object: GameObject) => GameObject;
};

export class Furniture implements GameObject {
  _id: number;
  symbol: string;
  solid: false;
  occupantId: number;
  effect: (o: GameObject) => GameObject;

  constructor(params: FurnitureParams) {
    let toSup = fp.assign(
      {
        _id: cuid(),
      },
      params,
    );
    Object.assign(this, toSup);
  }

  asString(): string {
    return `Furniture: ${name}`;
  }
}
