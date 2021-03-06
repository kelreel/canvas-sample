import { Dot } from "../lib/Dot";
import { Line } from "../lib/Line";
import { Path, Point } from "../lib/Path";
import { arpoly, getVector, intersects } from "../lib/utils";

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

  let points: Point[] = [];
  let dots: Dot[] = [];
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

  // Добавление точки полигона по клику
  canvas.addEventListener("click", function (e) {
    // Получаем координаты клика
    const [x, y] = [e.clientX, e.clientY - panel.offsetHeight];

    // Если полигон уже есть - выходим из функции
    if (polygon) return;

    // Запрещаем делать новые точки во всех, кроме первой
    for (let i = 1; i < dots.length; i++) {
      if (dots[i].isPointInPath(x, y)) return;
    }

    // Очищаем весь экран
    ctx.clearRect(0, 0, w, h);

    points.push([x, y]);
    dots.push(new Dot(ctx, x, y, 10, "#ccc"));

    if (dots.length > 1) {
      for (let i = 0; i < dots.length - 1; i++) {
        const line = new Line(ctx, [points[i], points[i + 1]], "black");
        line.draw();
      }
    }

    if (dots[0]?.isPointInPath(x, y)) {
      polygon = new Path(ctx, points, "yellow", "black");
      dots.pop();
      polygon.draw();
    }

    dots.forEach((dot, index) => {
      dot.setText(String(index + 1));
      dot.draw();
    });
  });

  (function langle() {
    const p = 0.5; // p-коэф.

    let a: Point = [200, 200];
    let b: Point = [300, 200];
    let c: Point = [350, 100];

    let points2: Point[] = [a, b, c];

    let l = new Line(ctx, points2, "black");
    l.draw();

    let angle = getAngle(points2[0], points2[1], points2[1], points2[2]);

    let vecV = getVector(a[0], a[1], b[0], b[1]);
    let vecW = getVector(b[0], b[1], c[0], c[1]);

    console.log("Vectors:", vecV, vecW);
    console.log("Angle:", angle);

    let vec1 = [a[0] - b[0], a[1] - b[1]];
    let vec2 = [c[0] - b[0], c[1] - b[1]];

    console.log('minus vectors:', vec1, vec2);

    let mod_vec1 = Math.sqrt(vec1[0] * vec1[0] + vec1[1] * vec1[1]);
    let mod_vec2 = Math.sqrt(vec2[0] * vec2[0] + vec2[1] * vec2[1]);

    console.log('vectors abs:', mod_vec1, mod_vec2);
    console.log(ctg(angle / 2));
    
    let r = Math.min((p * mod_vec1 + ctg(angle / 2)), (p * mod_vec2 + ctg(angle / 2)))
    console.log('Radius:', r);

    ctx.beginPath()
    ctx.arc(a[0] + r + 18, a[1] - r, r, 0, Math.PI * 2);
    ctx.fill()
    

    points2.forEach((point, i) => {
      let d = new Dot(ctx, point[0], point[1], 5, "#ccc");
      d.setText(String(i + 1));
      d.draw();
    });


    new Dot(ctx, vec1[0], vec1[1], 4, "red").draw();
  })();

  function ctg(x: number) { return 1 / Math.tan(x); }

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

    return ((Math.acos(cos)) * znak;
  }

  function reset() {
    dots = [];
    points = [];
    polygon = null;
    ctx.clearRect(0, 0, w, h);
    resText.innerText = "";
    anglesText.innerText = "";
  }

  function random() {
    reset();
    let points: Point[];

    try {
      points = arpoly([cx - 50, cy - 80], 30, 120, 6, 30);
    } catch (error) {
      console.log(error);
      points = arpoly([cx - 50, cy - 80], 30, 120, 6, 30);
    }

    polygon = new Path(ctx, points, "yellow", "black");

    dots = [
      ...polygon.points.map(
        (item) => new Dot(ctx, item[0], item[1], 10, "#ccc")
      ),
    ];
    points = [...polygon.points];
    polygon.draw();
    dots.forEach((element, i) => {
      element.setText(String(i + 1));
      element.draw();
    });
  }

  // Проверка ресайза окна
  window.onresize = function () {
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight - panel.offsetTop;
    cx = w / 2;
    cy = h / 2;
    dots.forEach((item) => {
      item.draw();
    });
    polygon.draw();
  };

  // let arr: Point[] = [];
  // for (let i = 0; i < 1000; i++) {
  //   let p: Point = [cx + i * 0.1, cy + i * 0.1];
  //   arr.push(p);
  // }
  // arr.push([100, 100])

  // let l = new Path(ctx, arr, "red", 'black');
  // l.draw();

  function loop() {
    requestAnimationFrame(loop);
  }
  loop();
}

main();
