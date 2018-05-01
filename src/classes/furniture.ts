import { Record } from 'immutable';
import * as fp from 'lodash/fp';
import * as cuid from 'cuid';

import { GameObject } from './interfaces/GameObject';

export type FurnitureParams = {
  name: string;
  symbol?: string;
  effect?: (object: GameObject) => GameObject;
};

export class Furniture
  extends Record({
    _id: 0,
    name: '',
    symbol: 'o',
    solid: false,
    occupant: 0,
    effect: (o: GameObject) => o,
  })
  implements GameObject {
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
    super(toSup);
  }

  asString(): string {
    return `Furniture: ${name}`;
  }
}
