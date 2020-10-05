import { Point } from "./Path";

export function getRandomRgb() {
  var num = Math.round(0xffffff * Math.random());
  var r = num >> 16;
  var g = (num >> 8) & 255;
  var b = num & 255;
  return "rgb(" + r + ", " + g + ", " + b + ")";
}

/**
 * Return vector from 4 points
 * @param  {number} x1
 * @param  {number} y1
 * @param  {number} x2
 * @param  {number} y2
 * @returns [number, number]
 */
export const getVector = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
): [number, number] => {
  return [x2 - x1, y2 - y1];
};

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
  p: Point,
  a: number,
  b: number,
  m: number,
  M: number
): Point[] {
  const rnd_step = (): number => {
    return a + Math.random() * (b - a);
  };

  const rnd_angle = (): number => {
    return Math.random() * 2 * Math.PI;
  };

  const rnd_point = (p: Point): Point => {
    let angle = rnd_angle();
    let d = rnd_step();
    let x = d * Math.cos(angle);
    let y = d * Math.sin(angle);
    return [p[0] + x, p[1] + y];
  };

  let points: Point[] = [p];
  points.push(rnd_point(points[points.length - 1]));
  points.push(rnd_point(points[points.length - 1]));

  for (let i = 3; i < m; i++) {
    let c = 0;
    let is_looped = true;

    if (m >= M) throw "polygon generates loop error";

    while (c < M && is_looped === true) {
      let p = rnd_point(points[points.length - 1]);
      let is_intersected = false;
      c++;

      // if point not last
      if (i !== m - 1) {
        for (let j = 0; j < points.length - 1; j++) {
          if (
            intersects(
              points[j][0],
              points[j][1],
              points[j + 1][0],
              points[j + 1][1],
              points[points.length - 1][0],
              points[points.length - 1][1],
              p[0],
              p[1]
            )
          ) {
            is_intersected = true;
            break;
          }
        }
      }

      // last point
      if (i === m - 1) {
        for (let j = 0; j < points.length - 1; j++) {
          if (
            intersects(
              points[j][0],
              points[j][1],
              points[j + 1][0],
              points[j + 1][1],
              points[0][0],
              points[0][1],
              p[0],
              p[1]
            ) ||
            intersects(
              points[j][0],
              points[j][1],
              points[j + 1][0],
              points[j + 1][1],
              points[points.length - 1][0],
              points[points.length - 1][1],
              p[0],
              p[1]
            )
          ) {
            is_intersected = true;
            break;
          }
        }
        if (is_intersected) {
          m++;
        }
      }

      if (is_intersected === false) {
        is_looped = false;
        points.push(p);
        break;
      }
    }
  }

  return points;
}
