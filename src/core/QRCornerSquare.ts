import cornerSquareTypes from "../constants/cornerSquareTypes";

type DrawArgs = {
  x: number;
  y: number;
  size: number;
  context: CanvasRenderingContext2D;
  rotation: number;
};

type BasicFigureDrawArgs = {
  x: number;
  y: number;
  size: number;
  context: CanvasRenderingContext2D;
  rotation: number;
};

type RotateFigureArgs = {
  x: number;
  y: number;
  size: number;
  context: CanvasRenderingContext2D;
  rotation: number;
  draw: () => void;
};

export default class QRCornerSquare {
  _context: CanvasRenderingContext2D;
  _type: CornerSquareType;

  constructor({ context, type }: { context: CanvasRenderingContext2D; type: CornerSquareType }) {
    this._context = context;
    this._type = type;
  }

  draw(x: number, y: number, size: number, rotation: number): void {
    const context = this._context;
    const type = this._type;
    let drawFunction;

    switch (type) {
      case cornerSquareTypes.square:
        drawFunction = this._drawSquare;
        break;
      case cornerSquareTypes.extraRounded:
        drawFunction = this._drawExtraRounded;
        break;
      case cornerSquareTypes.dot:
      default:
        drawFunction = this._drawDot;
    }

    drawFunction.call(this, { x, y, size, context, rotation });
  }

  _rotateFigure({ x, y, size, context, rotation, draw }: RotateFigureArgs): void {
    const cx = x + size / 2;
    const cy = y + size / 2;

    context.translate(cx, cy);
    rotation && context.rotate(rotation);
    context.beginPath();
    draw();
    rotation && context.rotate(-rotation);
    context.translate(-cx, -cy);
  }

  _basicDot(args: BasicFigureDrawArgs): void {
    const { size, context } = args;
    const dotSize = size / 7;

    this._rotateFigure({
      ...args,
      draw: () => {
        context.lineWidth = dotSize;
        context.arc(0, 0, size / 2 - dotSize / 2, 0, Math.PI * 2);
        context.stroke();
      }
    });
  }

  _basicSquare(args: BasicFigureDrawArgs): void {
    const { size, context } = args;
    const dotSize = size / 7;

    this._rotateFigure({
      ...args,
      draw: () => {
        context.lineWidth = dotSize;
        context.rect(-size / 2 + dotSize / 2, -size / 2 + dotSize / 2, size - dotSize, size - dotSize);
        context.stroke();
      }
    });
  }

  _basicExtraRounded(args: BasicFigureDrawArgs): void {
    const { size, context } = args;
    const dotSize = size / 7;

    this._rotateFigure({
      ...args,
      draw: () => {
        context.lineWidth = dotSize;
        context.arc(-dotSize, -dotSize, 2 * dotSize, Math.PI, -Math.PI / 2);
        context.lineTo(dotSize, -3 * dotSize);
        context.arc(dotSize, -dotSize, 2 * dotSize, -Math.PI / 2, 0);
        context.lineTo(3 * dotSize, -dotSize);
        context.arc(dotSize, dotSize, 2 * dotSize, 0, Math.PI / 2);
        context.lineTo(-dotSize, 3 * dotSize);
        context.arc(-dotSize, dotSize, 2 * dotSize, Math.PI / 2, Math.PI);
        context.lineTo(-3 * dotSize, -dotSize);
        context.stroke();
      }
    });
  }

  _drawDot({ x, y, size, context, rotation }: DrawArgs): void {
    this._basicDot({ x, y, size, context, rotation });
  }

  _drawSquare({ x, y, size, context, rotation }: DrawArgs): void {
    this._basicSquare({ x, y, size, context, rotation });
  }

  _drawExtraRounded({ x, y, size, context, rotation }: DrawArgs): void {
    this._basicExtraRounded({ x, y, size, context, rotation });
  }
}
