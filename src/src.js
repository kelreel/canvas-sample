const { Dot } = require("./lib/Dot");
const { Line } = require("./lib/Line");
const { Rect } = require("./lib/Rect");

function main() {
  let canvas = document.getElementById("c");

  /** @type {CanvasRenderingContext2D} */
  let ctx = canvas.getContext("2d");
  let w = (canvas.width = innerWidth);
  let h = (canvas.height = innerHeight);
  let cx = canvas.width / 2;
  let cy = canvas.height / 2;

  const bgColor = "rgba(17, 17, 19, 1)";

  window.onresize = function () {
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
    cx = w / 2;
    cy = h / 2;
    reDrawBackground();
  };

  function reDrawBackground() {
    ctx.fillStyle = bgColor;
  }

  reDrawBackground();

  const points = [
    [10, 10],
    [20, 50],
    [60, 60],
    [500, 500],
  ];
  let line1 = new Line(ctx, points, null, 4);
  line1.draw();

  let l2 = new Line(
    ctx,
    [
      [100, 100],
      [100, 600],
    ],
    "red"
  );
  l2.draw();

  function loop() {
    requestAnimationFrame(loop);
    // r = new Rect(
    //   ctx,
    //   Math.random() * 500,
    //   Math.random() * 500,
    //   Math.random() * 50 + 5,
    //   Math.random() * 50 + 5
    // );
    // r.draw();
    // d = new Dot(
    //   ctx,
    //   Math.random() * 500,
    //   Math.random() * 500,
    //   Math.random() * 20
    // );
    // d.draw();
  }
  loop();
}

main();
