type GetNeighbor = (x: number, y: number) => boolean;
type DrawFunctionArgs = {
  x: number;
  y: number;
  size: number;
  context: CanvasRenderingContext2D;
  getNeighbor: GetNeighbor;
};

export default class QRDot {
  _context: CanvasRenderingContext2D;
  _type: DotType;

  constructor({ context, type }: { context: CanvasRenderingContext2D; type: DotType }) {
    this._context = context;
    this._type = type;
  }

  draw(x: number, y: number, size: number, getNeighbor: GetNeighbor): void {
    const context = this._context;
    const type = this._type;
    let drawFunction;

    switch (type) {
      case "dots":
        drawFunction = this._drawDots;
        break;
      case "rounded":
        drawFunction = this._drawRounded;
        break;
      case "square":
      default:
        drawFunction = this._drawSquare;
    }

    drawFunction({ x, y, size, context, getNeighbor });
  }

  _drawDots({ x, y, size, context }: DrawFunctionArgs): void {
    context.beginPath();
    context.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
    context.fill();
  }

  _drawSquare({ x, y, size, context }: DrawFunctionArgs): void {
    context.fillRect(x, y, size, size);
  }

  _drawRounded({ x, y, size, context, getNeighbor }: DrawFunctionArgs): void {
    context.beginPath();
    context.moveTo(x, y + size / 2);

    if (getNeighbor(-1, 0) || getNeighbor(0, -1)) {
      context.lineTo(x, y);
      context.lineTo(x + size / 2, y);
    } else {
      context.arc(x + size / 2, y + size / 2, size / 2, -Math.PI, -Math.PI / 2);
    }

    if (getNeighbor(0, -1) || getNeighbor(1, 0)) {
      context.lineTo(x + size, y);
      context.lineTo(x + size, y + size / 2);
    } else {
      context.arc(x + size / 2, y + size / 2, size / 2, -Math.PI / 2, 0);
    }

    if (getNeighbor(1, 0) || getNeighbor(0, 1)) {
      context.lineTo(x + size, y + size);
      context.lineTo(x + size / 2, y + size);
    } else {
      context.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI / 2);
    }

    if (getNeighbor(0, 1) || getNeighbor(-1, 0)) {
      context.lineTo(x, y + size);
      context.lineTo(x, y + size / 2);
    } else {
      context.arc(x + size / 2, y + size / 2, size / 2, Math.PI / 2, Math.PI);
    }

    context.fill();
  }
}
