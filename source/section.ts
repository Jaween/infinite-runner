import { GameObject } from "../../engine/game_object";

export enum Type
{
  Down,
  Left,
  Right,
  DownLeft,
  DownRight,
  LeftDown,
  RightDown,
  LeftRight,
  RightLeft
}

export class Section extends GameObject
{
  public type: Type;

  constructor(filename: string, type: Type)
  {
    super(filename);
    this.type = type;
    console.log("Constructed Section with type " + Type[type]);
  }
}
