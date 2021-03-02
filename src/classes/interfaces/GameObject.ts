import cuid = require("cuid");

export interface Stringy {
  asString() : string;
}

export interface GameObject extends Stringy {
  _id: string;
  symbol: String;
}

export class DummyObject implements GameObject {
  _id: string;
  symbol: String;
  asString(): string {
    throw new Error("Method not implemented.");
  }
  constructor() {
    this._id = cuid();
    this.symbol = "%";
  }
}