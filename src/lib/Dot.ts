import CanvasItem from "./CanvasItem";
import { getRandomRgb } from "./utils";

export class Dot extends CanvasItem {
  ctx: CanvasRenderingContext2D;
  pos: { x: number; y: number };
  color: string;
  radius: number;
  path: Path2D;
  text?: string;

  constructor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    color?: string
  ) {
    super();
    this.ctx = ctx;
    this.pos = { x, y };
    this.radius = radius;
    this.color = color || getRandomRgb();
    this.path = new Path2D();
  }

  isPointInPath(x: number, y: number) {
    return this.ctx.isPointInPath(this.path, x, y);
  }

  setText(text: string) {
    this.text = text;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.fillStyle = this.color || getRandomRgb();

    this.path.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);

    this.ctx.fill(this.path);

    this.ctx.stroke();
    this.ctx.closePath();

    if (this.text) {
      this.ctx.font = '12px arial'
      this.ctx.textAlign = "center";
      this.ctx.fillStyle = "black";
      this.ctx.fillText(this.text, this.pos.x, this.pos.y);
      this.ctx.font = '8px arial'
    }
  }
}
