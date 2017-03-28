import { Debug } from "./debug";
import { GameObject } from "../../engine/game_object";
import { Sprite } from "../../engine/sprite";

export enum Type
{
  Down,
  Left,
  Right,
}

export class Section extends GameObject {
  public static pathVerticalLength: number = 32;

  public type: Type;
  public prevJoinX: number;
  public prevJoinY: number;
  public nextJoinX: number;
  public nextJoinY: number;
  public nextSection: Section = undefined;

  private readonly downFile = "app/game/resources/images/section_down.png";
  private readonly angleFile = "app/game/resources/images/section_angle.png";

  constructor(type: Type) {
    super();

    this.type = type;
    switch (type) {
      case Type.Down:
        this.prevJoinX = 0;
        this.prevJoinY = -16;
        this.nextJoinX = 0;
        this.nextJoinY = 16;	;
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
    }
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
