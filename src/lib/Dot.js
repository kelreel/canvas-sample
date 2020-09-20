export class Dot {
  constructor(ctx, x, y, radius, color) {
    this.pos = { x, y };
    this.color = color;
    this.radius = radius || 3;
    /** @type {CanvasRenderingContext2D} */
    this.ctx = ctx;
  }

  setPos(x, y) {
    this.ctx.beginPath();
    this.ctx.clearRect(
      this.pos.x - this.radius - 1,
      this.pos.y - this.radius - 1,
      this.radius * 2.2,
      this.radius * 2.2
    );
    this.ctx.closePath();

    this.pos.x = x;
    this.pos.y = y;
    this.draw();
  }

  getRandomRgb() {
    var num = Math.round(0xffffff * Math.random());
    var r = num >> 16;
    var g = (num >> 8) & 255;
    var b = num & 255;
    return "rgb(" + r + ", " + g + ", " + b + ")";
  }

  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  draw() {
    this.ctx.beginPath();
    this.ctx.fillStyle = this.color || this.getRandomRgb();
    this.ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
    this.ctx.fill();
    // this.ctx.stroke();
    this.ctx.closePath();
  }
}
