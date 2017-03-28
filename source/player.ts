import { GameObject } from "../../engine/game_object";
import { Sprite } from "../../engine/sprite";

import { Section } from "./section";
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
        this.currentSprite = this.angleSprite;
        break;
      case Type.Right:
        this.currentSprite = this.angleSprite;
        break;
    }
    
    // Catches the player up to the current section due to any lag
    let secsSinceStartOfSection = (Date.now() - this.sectionStartTime) / 1000;
    let secsPerSection = Section.pathVerticalLength / this.speed;
    while (secsSinceStartOfSection >= secsPerSection) {
      this.setSection(this.section.nextSection);
      let additional = (secsSinceStartOfSection - secsPerSection) * 1000;
      this.sectionStartTime -= additional;
      secsSinceStartOfSection -= secsPerSection;
    }

    // Each section has a path that the player appears to travel along. Since
    // we know the vertical component of each path and the speed at which the
    // sections move upwards, we simply have to interpolate the x position of
    // the player. So when the player is at the top of the section, the player
    // is put on one side of the section. When the player is at the bottom of
    // the section, the player is put on the other side of the section.
    let t = Math.max(Math.min(secsSinceStartOfSection/secsPerSection, 1), 0);
    let pathHorizontalLength = this.section.nextJoinX - this.section.prevJoinX;
    let startPositionX = this.section.x + this.section.prevJoinX;
    this.x = startPositionX + t * pathHorizontalLength;
  }
}
