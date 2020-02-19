export interface Stringy {
  asString() : string;
}

export interface GameObject extends Stringy {
  _id: string;
  symbol: String;
}