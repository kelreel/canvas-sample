abstract class CanvasItem {
  abstract draw(): void;
  abstract isPointInPath(x, y): boolean;
}

export default CanvasItem;