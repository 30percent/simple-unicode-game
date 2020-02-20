import { Vector } from '../location';
import { Direction } from "./../structs/Direction";

export function getVectorDirection(vector: Vector, direction: Direction) {
  switch (direction) {
    case Direction.Left:
      return new Vector({x: vector.x - 1, y: vector.y});
    case Direction.Up:
      return new Vector({x: vector.x , y: vector.y - 1});
    case Direction.Right:
      return new Vector({x: vector.x + 1, y: vector.y});
    case Direction.Down:
      return new Vector({x: vector.x , y: vector.y + 1});
  }
}