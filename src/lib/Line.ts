import CanvasItem from "./CanvasItem";
import { Path } from "./Path";
import { getRandomRgb } from "./utils";

export class Line extends CanvasItem {
  ctx: CanvasRenderingContext2D;
  points: number[][];
  color: string;
  radius: number;
  width: number;
  path: Path2D;

  constructor(
    ctx: CanvasRenderingContext2D,
    points: number[][],
    color: string | null,
    width?: number
  ) {
    super();
    this.ctx = ctx;
    this.points = points;
    this.color = color || getRandomRgb();
    this.width = width || 1;
    this.path = new Path2D();
  }

  isPointInPath(x: number, y: number) {
    return this.ctx.isPointInPath(this.path, x, y);
  }

  draw() {
    const first = this.points[0];

    this.path.moveTo(first[0], first[1]);
    for (let i = 1; i < this.points.length; i++) {
      this.path.lineTo(this.points[i][0], this.points[i][1]);
    }

    this.ctx.beginPath();
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = this.width || 1;

    this.ctx.stroke(this.path);
    this.ctx.closePath();
  }
}
