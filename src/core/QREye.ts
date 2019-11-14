import { drawArcCorner, DrawFunctionArgs, drawLine, drawSquare } from "../tools/drawUtils";
import { Options } from "./QROptions";

export default class QREye {
  _context: CanvasRenderingContext2D;
  _options: Options;

  constructor({ context, options }: { context: CanvasRenderingContext2D; options: Options }) {
    this._context = context;
    this._options = options;
  }

  draw(x: number, y: number, size: number): void {
    const context = this._context;
    const options = this._options;
    const drawFrameFunctionArgs = { x, y, size, context };
    const drawBallFunctionArgs = { x: x + 2 * size, y: y + 2 * size, size, context };

    context.lineWidth = size;

    context.fillStyle = options.eyeFramesOptions.color;
    context.strokeStyle = options.eyeFramesOptions.color;
    switch (options.eyeFramesOptions.type) {
      case 1:
        this._drawFrame1(drawFrameFunctionArgs);
        break;
      case 2:
        this._drawFrame2(drawFrameFunctionArgs);
        break;
      case 0:
      default:
        this._drawFrame0(drawFrameFunctionArgs);
        break;
    }

    context.fillStyle = options.eyeBallsOptions.color;
    context.strokeStyle = options.eyeBallsOptions.color;
    switch (options.eyeBallsOptions.type) {
      case 0:
      default:
        this._drawBall0(drawBallFunctionArgs);
        break;
    }
  }

  /**
   * Frame 0
   * - Square
   */
  _drawFrame0({ x, y, size, context }: DrawFunctionArgs): void {
    drawLine(context, x, y + size / 2, x + size * 7, y + size / 2); // top
    drawLine(context, x, y + size * 6 + size / 2, x + size * 7, y + size * 6 + size / 2); // bottom
    drawLine(context, x + size / 2, y + size, x + size / 2, y + size * 6); // left
    drawLine(context, x + size * 6 + size / 2, y + size, x + size * 6 + size / 2, y + size * 6); // right
  }

  /**
   * Frame 1
   * - square with rounded corners
   */
  _drawFrame1({ x, y, size, context }: DrawFunctionArgs): void {
    drawArcCorner({ x, y, size, context }, "top-left");
    drawArcCorner({ x: x + size * 5, y, size, context }, "top-right");
    drawArcCorner({ x, y: y + size * 5, size, context }, "bottom-left");
    drawArcCorner({ x: x + size * 5, y: y + size * 5, size, context }, "bottom-right");

    drawLine(context, x + size * 2, y + size / 2, x + size * 5, y + size / 2); // top
    drawLine(context, x + size * 2, y + size * 6 + size / 2, x + size * 5, y + size * 6 + size / 2); // bottom
    drawLine(context, x + size / 2, y + size * 2, x + size / 2, y + size * 5); // left
    drawLine(context, x + size * 6 + size / 2, y + size * 2, x + size * 6 + size / 2, y + size * 5); // right
  }

  /**
   * Frame 2
   * - square with rounded corners
   */
  _drawFrame2({ x, y, size, context }: DrawFunctionArgs): void {
    drawArcCorner({ x, y, size, context }, "top-left");
    drawArcCorner({ x: x + size * 5, y, size, context }, "top-right");
    drawArcCorner({ x, y: y + size * 5, size, context }, "bottom-left");

    drawLine(context, x + size * 2, y + size / 2, x + size * 5, y + size / 2); // top
    drawLine(context, x + size * 2, y + size * 6 + size / 2, x + size * 7, y + size * 6 + size / 2); // bottom
    drawLine(context, x + size / 2, y + size * 2, x + size / 2, y + size * 5); // left
    drawLine(context, x + size * 6 + size / 2, y + size * 2, x + size * 6 + size / 2, y + size * 6); // right
  }

  _drawBall0({ x, y, size, context }: DrawFunctionArgs): void {
    drawSquare({ x, y, size: size * 3, context });
  }
}
