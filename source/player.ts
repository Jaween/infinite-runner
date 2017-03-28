import { GameObject } from "../../engine/game_object";
import { Input } from "../../engine/input";
import { Sprite } from "../../engine/sprite";

import { Section } from "./section";
import { Type } from "./section";


export class Player extends GameObject {
  private readonly keycodeSpace: number = 32;
  private speed: number;
  private shadowSprite: Sprite
  private downSprite: Sprite;
  private angleSprite: Sprite;
  private section: Section;
  private sectionStartTime: number = 0;

  private readonly initialJumpVelocity: number = -500;
  private gravity: number = 1400;
  private jumpPosition: number = 0;
  private jumpVelocity: number = 0;
  private jumping: boolean = false;
  private doubleJumping: boolean = false;


  constructor(speed: number) {
    super();
    this.downSprite =
        this.addSpriteFromFile("app/game/resources/images/player_down.png");
    this.angleSprite =
        this.addSpriteFromFile("app/game/resources/images/player_angle.png");
    this.shadowSprite =
        this.addSpriteFromFile("app/game/resources/images/shadow.png");
    this.speed = speed;
  }

  setSection(section: Section): void {
    this.section = section;
    this.sectionStartTime = Date.now();
  }

  update(deltaSeconds: number) {
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

    this.playerInput(deltaSeconds);
  }

  private playerInput(deltaSeconds: number): void {
    if (Input.keysDown[this.keycodeSpace] || Input.clicked) {
      this.jump();
    }

    if (this.jumping) {
      this.jumpPosition += this.jumpVelocity * deltaSeconds;
      this.jumpVelocity += this.gravity * deltaSeconds;
    }

    if (this.jumpPosition >= 0) {
      this.jumping = false;
      this.doubleJumping = false;
      this.jumpPosition = 0;
    }
  }

  private jump(): void {
    if (!this.jumping) {
      this.jumping = true;
      this.jumpVelocity = this.initialJumpVelocity;
    } else if (!this.doubleJumping) {
      this.jumpVelocity = this.initialJumpVelocity;
      this.doubleJumping = true;
    }
  }

  private updateSprite(): void {
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

  }

  draw(context) {
    this.updateSprite();
    this.shadowSprite.draw(context, this.x, this.y);
    this.currentSprite.draw(context, this.x, this.y + this.jumpPosition);
  }
}
