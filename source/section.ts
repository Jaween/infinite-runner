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
  public prevJoinX: number;
  public prevJoinY: number;
  public nextJoinX: number;
  public nextJoinY: number;

  constructor(filename: string, type: Type)
  {
    super(filename);
    this.type = type;
    switch (type) {
      case Type.Down:
        this.prevJoinX = 32;
        this.prevJoinY = 0;
        this.nextJoinX = 32;
        this.nextJoinY = 64;
        break;
      case Type.Left:
        this.prevJoinX = 69;
        this.prevJoinY = 23;
        this.nextJoinX = 23;
        this.nextJoinY = 69;
        break;
      case Type.Right:
        this.prevJoinX = 23;
        this.prevJoinY = 23;
        this.nextJoinX = 69;
        this.nextJoinY = 69;
        break;
      case Type.DownLeft:
        this.prevJoinX = 61;
        this.prevJoinY = 0;
        this.nextJoinX = 23;
        this.nextJoinY = 69;
        break;
      case Type.DownRight:
        this.prevJoinX = 31;
        this.prevJoinY = 0;
        this.nextJoinX = 69;
        this.nextJoinY = 69;
        break;
      case Type.LeftDown:
        this.prevJoinX = 69;
        this.prevJoinY = 23;
        this.nextJoinX = 32;
        this.nextJoinY = 110;
        break;
      case Type.RightDown:
        this.prevJoinX = 23;
        this.prevJoinY = 23;
        this.nextJoinX = 61;
        this.nextJoinY = 110;
        break;
    }
  }
}
