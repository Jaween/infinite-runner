import { GameLoop } from "../../engine/game_loop";
import { GameObject } from "../../engine/game_object";

import { Level } from "./level"
import { Player } from "./player"
import { Section } from "./section"

export class Game implements GameLoop {
  readonly speed = 120;
  player: Player;
  level: Level;
  canvasWidth: number;
  canvasHeight: number;

  constructor() {
    this.player = new Player(this.speed);
  }

  init(canvas, context): void {
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;

    this.player.x = canvas.width / 2;
    this.player.y = 40;

    this.level = new Level(canvas.width, canvas.height, this.speed);
    this.player.setSection(this.level.getCurrentSection());
  }

  update(deltaSeconds: number) {
    this.level.update(deltaSeconds);

    this.player.update(deltaSeconds);
  }

  render(canvas, context) {
    const backgroundColour = '#00BBBB';
    context.fillStyle = backgroundColour;
    context.fillRect(0, 0, canvas.width, canvas.height);

    this.level.draw(context);
    this.player.draw(context);
  }
}
