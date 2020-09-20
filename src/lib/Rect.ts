import CanvasItem from "./CanvasItem";
import { getRandomRgb } from "./utils";

export class Rect extends CanvasItem {
  ctx: CanvasRenderingContext2D;
  pos: { x: number; y: number; weight: number; height: number };
  color: string;
  radius: number;
  path: Path2D;

  constructor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    weight: number,
    height: number,
    color?: string
  ) {
    super();
    this.pos = { x, y, weight, height };
    this.ctx = ctx;
    this.color = color || getRandomRgb();
    this.path = new Path2D();
  }

  isPointInPath(x: number, y: number) {
    return this.ctx.isPointInPath(this.path, x, y);
  }

  draw() {
    this.ctx.beginPath();

    this.path.rect(this.pos.x, this.pos.y, this.pos.weight, this.pos.height);

    this.ctx.fillStyle = this.color || getRandomRgb();
    this.ctx.fill(this.path);
    this.ctx.closePath();
  }
}
