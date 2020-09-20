export class Line {
  /**
   * @param  {CanvasRenderingContext2D} ctx
   * @param  {Array<number, number>} points
   * @param  {string} color
   * @param  {number} width
   */
  constructor(ctx, points, color, width) {
    this.ctx = ctx;
    this.points = points;
    this.color = color;
    this.width = width;
  }

  getRandomRgb() {
    var num = Math.round(0xffffff * Math.random());
    var r = num >> 16;
    var g = (num >> 8) & 255;
    var b = num & 255;
    return "rgb(" + r + ", " + g + ", " + b + ")";
  }

  draw() {
    const first = this.points[0];
    this.ctx.beginPath();
    this.ctx.strokeStyle = this.color || this.getRandomRgb();
    this.ctx.lineWidth = this.width || 1;
    this.ctx.moveTo(first[0], first[1]);
    for (let i = 1; i < this.points.length; i++) {
      this.ctx.lineTo(this.points[i][0], this.points[i][1]);
    }
    this.ctx.stroke();
  }
}
