import { GameObject } from "../../engine/game_object";
import { Sprite } from "../../engine/sprite";

export enum Type
{
  Down,
  Left,
  Right,
}

export class Section extends GameObject {
  public static pathLength: number = 36;

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
        this.prevJoinX = 32;
        this.prevJoinY = 0;
        this.nextJoinX = 32;
        this.nextJoinY = 36;
        this.addSpriteFromFile(this.downFile);
        break;
      case Type.Left:
        this.prevJoinX = 75;
        this.prevJoinY = 18;
        this.nextJoinX = 25;
        this.nextJoinY = 54;
        this.addSpriteFromFile(this.angleFile);
        break;
      case Type.Right:
        this.prevJoinX = 25;
        this.prevJoinY = 18;
        this.nextJoinX = 75;
        this.nextJoinY = 54;
        this.addSpriteFromFile(this.angleFile);
        break;
    }
  }

  update(deltaSeconds: number): void {

  }
}
