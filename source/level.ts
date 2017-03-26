import { GameObject } from "../../engine/game_object";
import { Section } from "./section"
import { Type } from "./section"

export class Level extends GameObject {
  private speed: number;
  private current: Section = undefined;
  private weights: number[][];
  private weightSums: number[] = [];
  private sections: Section[] = [];
  private previousTwoSections: Section[] = [];
  private pathHorizontalPos;

  constructor(width: number, height: number, speed: number) {
    super();

    this.width = width;
    this.height = height;
    this.speed = speed;

    this.weights = [
       //D   L   R   S
       [ 3,  2,  2 ], // Down
       [ 2,  3,  0 ], // Left
       [ 2,  0,  3 ], // Right
    ];

    // Sums each row
    for (let row of this.weights) {
      this.weightSums.push(0);
      for (let weight of row) {
        this.weightSums[this.weightSums.length - 1] += weight;
      };
    };

    this.pathHorizontalPos = width / 2;

    this.current = this.getNext();
    this.sections.push(this.current);
  }

  update(deltaSeconds: number): void {
    // Moves the sections up
    for (let section of this.sections) {
      section.y -= this.speed * deltaSeconds;
    }

    // Deletes a section when it goes off the top of the screen
    let highestSection: Section = this.sections[0];
    let highestPosition = highestSection.y + highestSection.height;
    if (highestPosition <= 0) {
      let index: number = this.sections.indexOf(highestSection, 0);
      this.sections.splice(index, 1);
    }

    // Creates a new section at the bottom of the screen
    while (true) {
      let lowestSection = this.sections[this.sections.length - 1];
      if (lowestSection.y < this.height) {
        this.sections.push(this.getNext());
      } else {
        break;
      }
    }
  }

  draw(context): void {
    for (let section of this.sections) {
      section.draw(context);
    }
  }

  private getNext(): Section {
    // Initial section
    if (this.current == undefined) {
      let section = new Section(Type.Right);
      this.setSectionPosition(undefined, section);
      return section;
    }

    let previous = this.current;
    
    let nextType = this.randomWeightedInt(this.weights[previous.type],
        this.weightSums[previous.type]);

    // Locks the sections to be within the canvas horizontally
    if (nextType != Type.Down) {
      if ((nextType == Type.Left && this.pathHorizontalPos - 64 <= 0) ||
          (nextType == Type.Right && this.pathHorizontalPos + 64 >= this.width)) {
        nextType = Type.Down;
      }
    }

    switch (nextType) {
      case Type.Down:
        this.current = new Section(Type.Down);
        break;
      case Type.Left:
        this.current = new Section(Type.Left);
        this.pathHorizontalPos -= 64;
        break;
      case Type.Right:
        this.current = new Section(Type.Right);
        this.pathHorizontalPos += 64;
        break;
    }

    this.setSectionPosition(previous, this.current);
    previous.nextSection = this.current;

    return this.current;
  }

  public getCurrentSection(): Section {
    return this.current;
  }

  private setSectionPosition(previous: Section, current: Section): void {
    if (previous != undefined) {
      current.x = previous.x + previous.nextJoinX - current.prevJoinX;
      current.y = previous.y + previous.nextJoinY - current.prevJoinY;
    } else {
      current.x = this.width / 2;
      current.y = 120;
    }
  }

  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  private randomWeightedInt(weights: number[], sumOfWeights: number): number {
    let randomNumber = this.randomInt(0, sumOfWeights - 1);
    for(let index: number = 0; index < weights.length; index++) {
      randomNumber -= weights[index];
      if (weights[index] > 0 && randomNumber < 0) {
        return index;
      }
    };
    console.log("Error: Weights were " + weights + ", sum was " + sumOfWeights);
    return 0;
  }
}
