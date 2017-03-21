import { GameLoop } from "../../engine/game_loop";
import { GameObject } from "../../engine/game_object";

import { Generator } from "./generator"
import { Section } from "./section"

export class Game implements GameLoop {
  readonly speed = 40;
  generator: Generator;
  sections: Section[] = [];
  canvasWidth: number;
  canvasHeight: number;

  constructor() {
    this.generator = new Generator();
  }

  init(canvas, context): void {
    this.newSection(canvas.width, canvas.height);
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;
  }

  update(deltaSeconds: number) {
    // Move the sections up
    for (let section of this.sections) {
      section.y -= this.speed * deltaSeconds;
    }

    // Delete the a section when it goes off the top of the screen
    let highestSection: Section = this.sections[0];
    let highestPosition = highestSection.y + highestSection.height;
    if (highestPosition <= 0) {
      let index: number = this.sections.indexOf(highestSection, 0);
      this.sections.splice(index, 1);
    }

    // Create new sections at the bottom of the screen
    let lowestSection = this.sections[this.sections.length - 1];
    let lowestPosition: number = lowestSection.y + lowestSection.height;
    if (lowestPosition < this.canvasHeight) {
      this.newSection(this.canvasWidth, this.canvasHeight);
    }
  }

  render(canvas, context) {
    const backgroundColour = '#00BBBB';
    context.fillStyle = backgroundColour;
    context.fillRect(0, 0, canvas.width, canvas.height);

    for (let section of this.sections) {
      section.draw(context);
    }
  }

  newSection(canvasWidth: number, canvasHeight: number): void {
    let section = this.generator.getNext();
    section.x = canvasWidth / 2;
    section.y = canvasHeight;
    this.sections.push(section);
  }
}
