abstract class CanvasItem {
  path: Path2D;
  abstract draw(): void;
  abstract isPointInPath(x, y): boolean;
}

export default CanvasItem;