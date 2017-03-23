import { Section } from "./section"
import { Type } from "./section"

export class Generator {
  private readonly downFile = "app/game/resources/images/section_down.png";
  private readonly leftFile = "app/game/resources/images/section_left.png";
  private readonly rightFile = "app/game/resources/images/section_right.png";
  private readonly downLeftFile =
      "app/game/resources/images/section_down_left.png";
  private readonly downRightFile =
      "app/game/resources/images/section_down_right.png";
  private readonly leftDownFile =
      "app/game/resources/images/section_left_down.png";
  private readonly rightDownFile =
      "app/game/resources/images/section_right_down.png";

  private current: Section = undefined;
  private weights: number[][];
  private weightSums: number[] = [];

  constructor() {
    this.current = new Section(this.downFile, Type.Down);

    this.weights = [
      // D   L   R  DL  DR  LD  RD
       [ 4,  0,  0,  3,  3,  0,  0 ], // Down
       [ 0,  4,  0,  0,  0,  3,  0 ], // Left
       [ 0,  0,  4,  0,  0,  0,  3 ], // Right
       [ 0,  4,  0,  0,  0,  3,  0 ], // Down left
       [ 0,  0,  4,  0,  0,  0,  3 ], // Down right
       [ 4,  0,  0,  3,  3,  0,  0 ], // Left down
       [ 4,  0,  0,  3,  3,  0,  0 ], // Right down
    ];

    // Sums each row
    for (let row of this.weights) {
      this.weightSums.push(0);
      for (let weight of row) {
        this.weightSums[this.weightSums.length - 1] += weight;
      };
    };
  }

  getNext(): Section {
    let previous = this.current;
    let nextType = this.randomWeightedInt(this.weights[previous.type],
        this.weightSums[previous.type]);

    switch (nextType) {
      case Type.Down:
        this.current = new Section(this.downFile, Type.Down);
        break;
      case Type.Left:
        this.current = new Section(this.leftFile, Type.Left);
        break;
      case Type.Right:
        this.current = new Section(this.rightFile, Type.Right);
        break;
      case Type.DownLeft:
        this.current = new Section(this.downLeftFile, Type.DownLeft);
        break;
      case Type.DownRight:
        this.current = new Section(this.downRightFile, Type.DownRight);
        break;
      case Type.LeftDown:
        this.current = new Section(this.leftDownFile, Type.LeftDown);
        break;
      case Type.RightDown:
        this.current = new Section(this.rightDownFile, Type.RightDown);
        break;
    }
    return previous;
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
