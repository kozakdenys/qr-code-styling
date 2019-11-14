import { drawCircle, DrawFunctionArgs, drawSquare } from "../tools/drawUtils";

type GetNeighbor = (x: number, y: number) => boolean;

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
    const drawFunctionArgs = { x, y, size, context, getNeighbor };

    switch (type) {
      case "dots":
        drawCircle(drawFunctionArgs);
        break;
      case "small-dots":
        drawCircle(drawFunctionArgs, 3);
        break;
      case "rounded":
        this._drawRounded(drawFunctionArgs, getNeighbor);
        break;
      case "square":
      default:
        drawSquare(drawFunctionArgs);
        break;
    }
  }

  _drawRounded({ x, y, size, context }: DrawFunctionArgs, getNeighbor: GetNeighbor): void {
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
