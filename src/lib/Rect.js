export class Rect {
  /**
   * @param  {CanvasRenderingContext2D} ctx
   * @param  {number} x
   * @param  {number} y
   * @param  {number} weight
   * @param  {number} height
   * @param  {string} color
   */
  constructor(ctx, x, y, weight, height, color) {
    this.pos = { x, y, weight, height };
    this.ctx = ctx;
    this.color = color;
  }

  setPos(x, y) {
    this.ctx.beginPath();
    this.ctx.clearRect(
      this.pos.x,
      this.pos.y,
      this.pos.weight,
      this.pos.height
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

  draw() {
    this.ctx.beginPath();
    this.ctx.rect(this.pos.x, this.pos.y, this.pos.weight, this.pos.height);
    this.ctx.fillStyle = this.color || this.getRandomRgb();
    this.ctx.fill();
    this.ctx.closePath();
  }
}
