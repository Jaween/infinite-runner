import { Debug } from "./debug";
import { GameObject } from "../../engine/game_object";
import { Sprite } from "../../engine/sprite";

export enum Type
{
  Down,
  Left,
  Right,
  Space,
  DoubleSpace
}

export class Section extends GameObject {
  public type: Type;
  public prevJoinX: number;
  public prevJoinY: number;
  public nextJoinX: number;
  public nextJoinY: number;
  public pathHorizontalLength: number;
  public pathVerticalLength: number;
  public nextSection: Section = undefined;

  private readonly downFile = "app/game/resources/images/section_down.png";
  private readonly angleFile = "app/game/resources/images/section_angle.png";

  constructor(type: Type, previousType: Type) {
    super();

    this.type = type;
    switch (type) {
      case Type.Down:
        this.prevJoinX = 0;
        this.prevJoinY = -29;
        this.nextJoinX = 0;
        this.nextJoinY = 29;
        this.addSpriteFromFile(this.downFile);
        break;
      case Type.Left:
        this.prevJoinX = 24;
        this.prevJoinY = -16;
        this.nextJoinX = -24;
        this.nextJoinY = 16;
        this.addSpriteFromFile(this.angleFile);
        break;
      case Type.Right:
        this.prevJoinX = -24;
        this.prevJoinY = -16;
        this.nextJoinX = 24;
        this.nextJoinY = 16;
        this.addSpriteFromFile(this.angleFile);
        break;
      case Type.Space:
        if (previousType == Type.Down) {
          this.prevJoinX = 0;
          this.prevJoinY = -29;
          this.nextJoinX = 0;
          this.nextJoinY = 29;
        } else if (previousType == Type.Left) {
          this.prevJoinX = 24;
          this.prevJoinY = -16;
          this.nextJoinX = -24;
          this.nextJoinY = 16;
        } else {
          this.prevJoinX = -24;
          this.prevJoinY = -16;
          this.nextJoinX = 24;
          this.nextJoinY = 16;
        }
        break;
     case Type.DoubleSpace:
        if (previousType == Type.Down) {
          this.prevJoinX = 0;
          this.prevJoinY = -58;
          this.nextJoinX = 0;
          this.nextJoinY = 58;
        } else if (previousType == Type.Left) {
          this.prevJoinX = 48;
          this.prevJoinY = -32;
          this.nextJoinX = -48;
          this.nextJoinY = 32;
        } else {
          this.prevJoinX = -48;
          this.prevJoinY = -32;
          this.nextJoinX = 48;
          this.nextJoinY = 32;
        }
        break;
    }

    this.pathHorizontalLength = //Math.abs(this.nextJoinX - this.prevJoinX);
    this.pathVerticalLength = this.nextJoinY - this.prevJoinY;
  }

  update(deltaSeconds: number): void {

  }

  draw(context) {
    super.draw(context);

    if (Debug.pathEnabled) {
      context.beginPath();
      context.moveTo(this.x + this.prevJoinX, this.y + this.prevJoinY);
      context.lineTo(this.x + this.nextJoinX, this.y + this.nextJoinY);
      context.stroke();
    }
  }
}
