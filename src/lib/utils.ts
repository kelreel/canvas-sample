import { Point } from "./Path";

export function getRandomRgb() {
  var num = Math.round(0xffffff * Math.random());
  var r = num >> 16;
  var g = (num >> 8) & 255;
  var b = num & 255;
  return "rgb(" + r + ", " + g + ", " + b + ")";
}

export function intersects(a, b, c, d, p, q, r, s): boolean {
  var det, gamma, lambda;
  det = (c - a) * (s - q) - (r - p) * (d - b);
  if (det === 0) {
    return false;
  } else {
    lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
    gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
    return 0 < lambda && lambda < 1 && 0 < gamma && gamma < 1;
  }
}

export function arpoly(
  points_num: number = 5,
  weight: number,
  height: number
): Point[] {
  let points: Point[] = [];
  // console.log(intersects(0,0, 0, 5, 0,2,2,2));

  let gen_point = (): Point => {
    return [
      Math.round(50 + Math.random() * (weight - 50)),
      Math.round(50 + Math.random() * (height - 50)),
    ];
  };

  points.push(gen_point(), gen_point(), gen_point());

  let p = gen_point();

  let c = 0;
  while (points.length < points_num - 1) {
    let is_intersected = false;
    c++;
    for (let i = 0; i < points.length - 1; i++) {
      if (
        intersects(
          p[0],
          p[1],
          points[points.length - 1][0],
          points[points.length - 1][1],
          points[i][0],
          points[i][1],
          points[i + 1][0],
          points[i + 1][1]
        )
      ) {
        is_intersected = true;
      }
      if (points.length === points_num - 2) {
        p = points[points.length - 1];
        for (let i = 0; i < points.length - 1; i++) {
          if (
            intersects(
              p[0],
              p[1],
              points[1][0],
              points[1][1],
              points[i][0],
              points[i][1],
              points[i + 1][0],
              points[i + 1][1]
            )
          ) {
            is_intersected = true;
          }
        }
      }
    }
    if (is_intersected) {
      p = gen_point();
    } else {
      points.push(p);
      p = gen_point();
    }

    if (c > 1000) return;
  }
  console.log(c);

  return points;
}
