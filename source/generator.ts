import { Section } from "./section"
import { Type } from "./section"

export class Generator {
  private current: Section;

  constructor() {
    this.current = this.newDown();
  }

  getNext(): Section {
    let previous = this.current;
    switch (previous.type) {
      case Type.Down:
        this.current = this.newLeft();
        break;
      case Type.Left:
        this.current = this.newRight();
        break;
      case Type.Right:
        this.current = this.newDown();
        break;
      default:
        this.current = this.newDown();
    }
    return previous;
  }
 
  private newDown(): Section {
    return new Section("app/game/resources/images/section_down.png", Type.Down);
  }

  private newLeft(): Section {
    return new Section("app/game/resources/images/section_left.png", Type.Left);
  }

  private newRight(): Section {
    return new Section("app/game/resources/images/section_right.png", Type.Right);
  }
}
