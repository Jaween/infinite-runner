import { GameObject } from "../../engine/game_object";
import { Section } from "./section"
import { Type } from "./section"

export class Level extends GameObject {
  private readonly levelPadding = 100;
  private readonly minWidth = 300;
  private readonly minHeight = 300;
  private speed: number;
  private current: Section = undefined;
  private weights: number[][];
  private weightSums: number[] = [];
  private sections: Section[] = [];
  private previousTwoSections: Section[] = [];
  private typeBeforeSpace: Type;

  constructor(width: number, height: number, speed: number) {
    super();

    this.width = width;
    this.height = height;
    this.speed = speed;

    if (width < this.minWidth || height < this.minHeight) {
      throw new Error("Level dimensions of (" + width + ", " + height +
        ") are smaller than minimium of (" + this.minWidth + ", " +
        this.minHeight + ")");
    }

    this.weights = [
       //D   L   R   S   DS
       [ 4,  2,  2,  1,  1 ], // Down
       [ 2,  4,  0,  1,  1 ], // Left
       [ 2,  0,  4,  1,  1 ], // Right
       [ 0,  0,  0,  0,  0 ], // Space
       [ 0,  0,  0,  0,  0 ], // Double space
    ];

    // Sums each row
    for (let row of this.weights) {
      this.weightSums.push(0);
      for (let weight of row) {
        this.weightSums[this.weightSums.length - 1] += weight;
      };
    };

    this.generateSection();
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
        this.generateSection();
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

  private generateSection() {
    // Initial section
    if (this.current == undefined) {
      this.current = new Section(Type.Right, undefined);
      this.setSectionPosition(undefined, this.current);
      this.sections.push(this.current);
      return;
    }

    let previous = this.current;
    
    while (true) {
      let nextType;
      if (previous.type == Type.Space || previous.type == Type.DoubleSpace) {
        nextType = this.typeBeforeSpace;
      } else {
        nextType = this.randomWeightedInt(this.weights[previous.type],
          this.weightSums[previous.type]);
      }

      if (nextType == Type.Space || nextType == Type.DoubleSpace) {
        this.typeBeforeSpace = previous.type;
      }

      this.current = new Section(nextType, previous.type);
      this.setSectionPosition(previous, this.current);

      // Locks the sections to be within the canvas horizontally
      let sectionWidth = this.levelPadding;
      switch (nextType) {
        case Type.Left:
        case Type.Right:
          sectionWidth += this.current.pathHorizontalLength;
          break;
        case Type.Space:
          sectionWidth += this.current.pathHorizontalLength * 2;
          break;
        case Type.DoubleSpace:
          sectionWidth += this.current.pathHorizontalLength * 3;
          break;
      }

      if (this.current.x - sectionWidth <= 0 ||
         this.current.x + sectionWidth > this.width) {
        continue;
      }

      break;
    }

    previous.nextSection = this.current;
    this.sections.push(this.current);
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
      current.y = this.height / 3;
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
