import CanvasItem from "./lib/CanvasItem";
import { Dot } from "./lib/Dot";
import { Line } from "./lib/Line";
import { Path } from "./lib/Path";

function main() {
  let canvas = <HTMLCanvasElement>document.getElementById("c");

  /** @type {CanvasRenderingContext2D} */
  let ctx = canvas.getContext("2d");
  let w = (canvas.width = innerWidth);
  let h = (canvas.height = innerHeight);
  let cx = canvas.width / 2;
  let cy = canvas.height / 2;
  const bgColor = "rgba(17, 17, 19, 1)";

  canvas.addEventListener("mousemove", function (e) {
    ctx.clearRect(w - 80, h - 40, w, h);
    ctx.textAlign = "start";
    ctx.fillText("X: " + e.clientX + ", Y: " + e.clientY, w - 80, h - 20);
    ctx.closePath();
  });

  window.onresize = function () {
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
    cx = w / 2;
    cy = h / 2;
    reDrawBackground();
    objects.forEach((item) => {
      item.draw();
    });
  };

  function reDrawBackground() {
    ctx.fillStyle = bgColor;
  }
  reDrawBackground();

  let objects: CanvasItem[] = [];

  let points = [];
  let polygon: Path;

  canvas.addEventListener("click", function (e) {
    const [x, y] = [e.clientX, e.clientY];

    ctx.clearRect(0, 0, w, h);

    points.push([x, y]);
    if (points.length === 2) {
      polygon = new Path(ctx, points, null, null)
    } else if (points.length >= 3) {
      polygon.points = points;
      polygon.draw();
    }

    objects.push(new Dot(ctx, x, y, 7));
    objects.forEach((item) => item.draw());
  });

  function loop() {
    requestAnimationFrame(loop);
  }
  loop();
}

main();
