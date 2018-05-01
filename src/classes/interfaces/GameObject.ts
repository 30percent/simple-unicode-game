import { Record, Collection } from 'immutable';

export interface Stringy {
  asString(): string;
}

export interface GameObject extends Stringy {
  _id: number;
  symbol: string;
  solid: boolean;
}
