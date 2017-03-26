import { GameObject } from "../../engine/game_object";
import { Section } from "./section";
import { Sprite } from "../../engine/sprite";
import { Type } from "./section";


export class Player extends GameObject {
  private speed: number;
  private downSprite: Sprite;
  private angleSprite: Sprite;
  private section: Section;
  private sectionStartTime: number = 0;

  constructor(speed: number) {
    super();
    this.downSprite = 
        this.addSpriteFromFile("app/game/resources/images/player_down.png");
    this.angleSprite = 
        this.addSpriteFromFile("app/game/resources/images/player_angle.png");
    this.speed = speed;
  }

  setSection(section: Section): void {
    this.section = section;
    this.sectionStartTime = Date.now();
  }

  update(deltaSeconds: number) {
    // Updates sprite
    switch (this.section.type) {
      case Type.Down:
        this.currentSprite = this.downSprite;
        break;
      case Type.Left:
        this.x -= this.speed * deltaSeconds;
        this.currentSprite = this.angleSprite;
        break;
      case Type.Right:
        this.x += this.speed * deltaSeconds;
        this.currentSprite = this.angleSprite;
        break;
    }
    
    let secsSinceStartOfSection = (Date.now() - this.sectionStartTime) / 1000;
    let secsPerSection = Section.pathLength / this.speed;
    let t = Math.max(Math.min(secsSinceStartOfSection/secsPerSection, 1), 0);

    this.x =
        this.section.x +
        this.section.prevJoinX + 
        t * (this.section.nextJoinX - this.section.prevJoinX) -
        this.width / 2;

    /*this.y =
        this.section.y +
        this.section.prevJoinY +
        t * (this.section.nextJoinY - this.section.prevJoinY) -
        90;*/

    // Catches up to the current section
    while (secsSinceStartOfSection >= secsPerSection) {
      this.setSection(this.section.nextSection);
      let additional = (secsSinceStartOfSection - secsPerSection) * 1000;
      this.sectionStartTime -= additional;
      secsSinceStartOfSection -= secsPerSection;
    }
  }
}
