import { Dot } from "./lib/Dot";
import { Path } from "./lib/Path";
import { arpoly, intersects } from "./lib/utils";

type Point = [number, number];

function main() {
  const canvas = <HTMLCanvasElement>document.getElementById("c");
  const panel = <HTMLElement>document.getElementById("panel");
  const resetBtn = <HTMLElement>document.getElementById("reset");
  const randomBtn = <HTMLElement>document.getElementById("random");
  const resText = <HTMLElement>document.getElementById("cur_pos");
  const anglesText = <HTMLElement>document.getElementById("angles");
  const cursor_dot = <HTMLElement>document.getElementById("dot");

  resetBtn.addEventListener("click", reset);
  randomBtn.addEventListener("click", random);

  /** @type {CanvasRenderingContext2D} */
  let ctx = canvas.getContext("2d");
  let w = (canvas.width = innerWidth);
  let h = (canvas.height = innerHeight - panel.offsetHeight);
  let cx = canvas.width / 2;
  let cy = canvas.height / 2;
  const bgColor = "rgba(17, 17, 19, 1)";

  let objects: Dot[] = [];

  let points: Point[] = [];
  let polygon: Path;

  // Слушатель перемещения мышки (для координат в углу)
  canvas.addEventListener("mousemove", function (e) {
    cursor_dot.style.top = `${e.clientY - 5}px`;
    cursor_dot.style.left = `${e.clientX - 5}px`;
    const [x, y] = [e.clientX, e.clientY - panel.offsetHeight];
    ctx.clearRect(w - 80, h - 40, w, h);
    ctx.textAlign = "start";
    ctx.fillText("X: " + x + ", Y: " + y, w - 80, h - 20);
    ctx.closePath();

    if (polygon && polygon.path && polygon.points.length > 2) {
      const cur_point: Point = [x, y];
      let rad_sum = 0;
      let isOnStroke = false;
      console.clear();

      anglesText.innerHTML = "";

      for (let index = 0; index < polygon.points.length; index++) {
        let point1 = polygon.points[index];
        let point2: Point;
        if (index === polygon.points.length - 1) {
          point2 = polygon.points[0];
        } else {
          point2 = polygon.points[index + 1];
        }
        let angle = getAngle(cur_point, point1, cur_point, point2);
        if (angle > 178 && angle < 182) isOnStroke = true;

        rad_sum += angle;
        anglesText.innerHTML += `${index + 1}) ${
          Math.round(angle * 100) / 100
        }° &nbsp;`;
      }

      if (isOnStroke) {
        resText.innerText = `Точка на ребре (~${
          Math.round(rad_sum * 10000) / 10000
        }°)`;
        resText.style.color = "orange";
      } else if (Math.round(Math.abs(rad_sum)) >= 360) {
        resText.innerText = `Точка принадлежит полигону (~${
          Math.round(rad_sum * 10000) / 10000
        }°)`;
        resText.style.color = "green";
      } else {
        resText.innerText = `Точка вне полигона (${
          Math.round(rad_sum * 10000) / 10000
        }°)`;
        resText.style.color = "red";
      }
    }
  });

  // Проверка ресайза окна
  window.onresize = function () {
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight - panel.offsetTop;
    cx = w / 2;
    cy = h / 2;
    objects.forEach((item) => {
      item.draw();
    });
    polygon.draw();
  };

  // Добавление точки полигона по клику
  canvas.addEventListener("click", function (e) {
    const [x, y] = [e.clientX, e.clientY - panel.offsetHeight];

    // Запрет на прямое добавление точки внутрь полигона
    if (
      points.length > 2 &&
      (polygon.isPointInPath(x, y) || polygon.isPointInStroke(x, y))
    ) {
      return;
    }

    ctx.clearRect(0, 0, w, h);

    points.push([x, y]);
    if (points.length === 2) {
      polygon = new Path(ctx, points, "yellow", "black");
    } else if (points.length >= 3) {
      polygon.points = points;
      // polygon.points = polygon.points.filter(p => !polygon.isPointInPath(p[0], p[1]))
      // console.log(polygon.points);

      polygon.draw();
    }

    objects.push(new Dot(ctx, x, y, 10, "#ccc"));
    objects.forEach((item, index) => {
      item.setText(String(index + 1));
      item.draw();
    });
  });

  // Правый клик и проверка принадлежности точки
  canvas.addEventListener(
    "contextmenu",
    function (e) {
      e.preventDefault();
      const [x, y] = [e.clientX, e.clientY - panel.offsetHeight];
      const cur_point: Point = [x, y];
      let rad_sum = 0;

      for (let index = 0; index < polygon.points.length; index++) {
        let point1 = polygon.points[index];
        let point2: Point;
        if (index === polygon.points.length - 1) {
          point2 = polygon.points[0];
        } else {
          point2 = polygon.points[index + 1];
        }

        rad_sum += getAngle(cur_point, point1, cur_point, point2);
      }
      console.log(rad_sum);

      return false;
    },
    false
  );

  function getVector(x1: number, y1: number, x2: number, y2: number): Point {
    return [x2 - x1, y2 - y1];
  }

  function getAngle(a1: Point, a2: Point, b1: Point, b2: Point): number {
    const a = getVector(a1[0], a1[1], a2[0], a2[1]);
    const b = getVector(b1[0], b1[1], b2[0], b2[1]);

    let scalar = a[0] * b[0] + a[1] * b[1];

    let modA = Math.sqrt(a[0] * a[0] + a[1] * a[1]);
    let modB = Math.sqrt(b[0] * b[0] + b[1] * b[1]);

    let cos = scalar / (modA * modB);

    const opr = a[0] * b[1] - a[1] * b[0];
    let znak = 1;
    if (opr > 0) znak = -1;

    return ((Math.acos(cos) * 180) / Math.PI) * znak;
  }

  function reset() {
    objects = [];
    points = [];
    polygon = null;
    ctx.clearRect(0, 0, w, h);
  }

  function random() {
    reset();
    const points_num = Math.round(Math.random() + 5);
    let points = arpoly(points_num, w, h);
    if (points === undefined) return;

    polygon = new Path(ctx, points, "yellow", "black");

    objects = [
      ...polygon.points.map(
        (item) => new Dot(ctx, item[0], item[1], 10, "#ccc")
      ),
    ];
    points = [...polygon.points];
    objects.forEach((element, i) => {
      element.setText(String(i + 1));
      element.draw();
    });
    polygon.draw();
  }

  function loop() {
    requestAnimationFrame(loop);
  }
  loop();
}

main();


// console.log(intersects(1,3,4,1,4,1,4,4));

// console.log(arpoly(5, 1000, 1000));


