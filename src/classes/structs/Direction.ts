

export enum Direction {
  Up,
  Down,
  Left,
  Right,
}

export function dirAsString(dir: Direction) {
  switch (dir) {
    case Direction.Up:
      return "Up";
    case Direction.Down:
      return "Down";
    case Direction.Left:
      return "Left";
    case Direction.Right:
      return "Right";
  }
}