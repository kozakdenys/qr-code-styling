import cornerDotTypes from "../../../constants/cornerDotTypes";
import { CornerDotType, RotateFigureArgsCanvas, BasicFigureDrawArgsCanvas, DrawArgsCanvas } from "../../../types";

export default class QRCornerDot {
  _context: CanvasRenderingContext2D;
  _type: CornerDotType;

  constructor({ context, type }: { context: CanvasRenderingContext2D; type: CornerDotType }) {
    this._context = context;
    this._type = type;
  }

  draw(x: number, y: number, size: number, rotation: number): void {
    const context = this._context;
    const type = this._type;
    let drawFunction;

    switch (type) {
      case cornerDotTypes.square:
        drawFunction = this._drawSquare;
        break;
      // case cornerDotTypes.heart:
      //   drawFunction = this._drawHeart;
      //   break;
      case cornerDotTypes.dot:
      default:
        drawFunction = this._drawDot;
    }

    drawFunction.call(this, { x, y, size, context, rotation });
  }

  _rotateFigure({ x, y, size, context, rotation = 0, draw }: RotateFigureArgsCanvas): void {
    const cx = x + size / 2;
    const cy = y + size / 2;

    context.translate(cx, cy);
    // rotation && context.rotate(rotation);
    draw();
    context.closePath();
    // rotation && context.rotate(-rotation);
    context.translate(-cx, -cy);
  }

  _basicDot(args: BasicFigureDrawArgsCanvas): void {
    const { size, context } = args;

    this._rotateFigure({
      ...args,
      draw: () => {
        context.arc(0, 0, size / 2, 0, Math.PI * 2);
      }
    });
  }

  _basicSquare(args: BasicFigureDrawArgsCanvas): void {
    const { size, context } = args;

    this._rotateFigure({
      ...args,
      draw: () => {
        context.rect(-size / 2, -size / 2, size, size);
      }
    });
  }

  // _basicHeart(args: BasicFigureDrawArgsCanvas): void {
  //   const { x, y, size, context } = args;

  //   this._rotateFigure({
  //     ...args,
  //     draw: () => {
  //       context.save();
  //       context.scale(size / 700, size / 700);
  //       context.moveTo(x / 2, y / 2);
  //       context.beginPath();
  //       context.moveTo(480, -120);
  //       context.lineTo(422, -172);
  //       context.quadraticCurveTo(321, -263, 255, -329);
  //       context.quadraticCurveTo(189, -395, 150, -447.5);
  //       context.quadraticCurveTo(111, -500, 95.5, -544);
  //       context.quadraticCurveTo(80, -588, 80, -634);
  //       context.quadraticCurveTo(80, -728, 143, -791);
  //       context.quadraticCurveTo(206, -854, 300, -854);
  //       context.quadraticCurveTo(352, -854, 399, -832);
  //       context.quadraticCurveTo(446, -810, 480, -770);
  //       context.quadraticCurveTo(514, -810, 561, -832);
  //       context.quadraticCurveTo(608, -854, 660, -854);
  //       context.quadraticCurveTo(754, -854, 817, -791);
  //       context.quadraticCurveTo(880, -728, 880, -634);
  //       context.quadraticCurveTo(880, -588, 864.5, -544);
  //       context.quadraticCurveTo(849, -500, 810, -447.5);
  //       context.quadraticCurveTo(771, -395, 705, -329);
  //       context.quadraticCurveTo(639, -263, 538, -172);
  //       context.lineTo(480, -120);
  //       context.closePath();
  //       context.fill();
  //       context.stroke();
  //       context.restore();
  //       context.restore();
  //     }
  //   });
  // }

  _drawDot({ x, y, size, context, rotation }: DrawArgsCanvas): void {
    this._basicDot({ x, y, size, context, rotation });
  }

  _drawSquare({ x, y, size, context, rotation }: DrawArgsCanvas): void {
    this._basicSquare({ x, y, size, context, rotation });
  }

  // _drawHeart({ x, y, size, context, rotation }: DrawArgsCanvas): void {
  //   this._basicHeart({ x, y, size, context, rotation });
  // }
}
