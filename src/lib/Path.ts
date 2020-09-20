import CanvasItem from "./CanvasItem";
import { getRandomRgb } from "./utils";

export class Path extends CanvasItem {
  ctx: CanvasRenderingContext2D;
  points: number[][];
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  path: Path2D;

  constructor(
    ctx: CanvasRenderingContext2D,
    points: number[][],
    fillColor: string | null,
    strokeColor: string | null,
    strokeWidth?: number
  ) {
    super();
    this.ctx = ctx;
    this.points = points;
    this.fillColor = fillColor || getRandomRgb();
    this.strokeColor = strokeColor || getRandomRgb();
    this.strokeWidth = strokeWidth || 1;
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

    this.ctx.strokeStyle = this.strokeColor || getRandomRgb();
    this.ctx.lineWidth = this.strokeWidth || 1;
    this.ctx.fillStyle = this.fillColor || getRandomRgb();

    this.ctx.stroke(this.path);
    this.ctx.fill(this.path);
    this.ctx.closePath();
  }
}
