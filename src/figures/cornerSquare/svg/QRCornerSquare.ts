import cornerSquareTypes from "../../../constants/cornerSquareTypes";
import { CornerSquareType } from "../../../types";

type DrawArgs = {
  x: number;
  y: number;
  size: number;
  rotation: number;
};

type BasicFigureDrawArgs = {
  x: number;
  y: number;
  size: number;
  rotation: number;
};

type RotateFigureArgs = {
  x: number;
  y: number;
  size: number;
  rotation: number;
  draw: () => void;
};

export default class QRCornerSquare {
  _element?: SVGElement;
  _svg: SVGElement;
  _type: CornerSquareType;

  constructor({ svg, type }: { svg: SVGElement; type: CornerSquareType }) {
    this._svg = svg;
    this._type = type;
  }

  draw(x: number, y: number, size: number, rotation: number): void {
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

    drawFunction.call(this, { x, y, size, rotation });
  }

  _rotateFigure({ x, y, size, rotation, draw }: RotateFigureArgs): void {
    const cx = x + size / 2;
    const cy = y + size / 2;

    draw();
    this._element?.setAttribute("transform", `rotate(${(180 * rotation) / Math.PI},${cx},${cy})`);
  }

  _basicDot(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const dotSize = size / 7;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = document.createElementNS("http://www.w3.org/2000/svg", "path");
        this._element.setAttribute("fill-rule", "evenodd");
        this._element.setAttribute(
          "d",
          `M ${x} ${y + size / 2}` +
            `a ${size / 2} ${size / 2}, 0, 1, 0, ${size} 0` +
            `a ${size / 2} ${size / 2}, 0, 1, 0, ${-size} 0` +
            `M ${x + dotSize} ${y + size / 2}` +
            `a ${size / 2 - dotSize} ${size / 2 - dotSize}, 0, 1, 0, ${size - 2 * dotSize} 0` +
            `a ${size / 2 - dotSize} ${size / 2 - dotSize}, 0, 1, 0, ${-size + 2 * dotSize} 0`
        );
      }
    });
  }

  _basicSquare(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const dotSize = size / 7;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = document.createElementNS("http://www.w3.org/2000/svg", "path");
        this._element.setAttribute("fill-rule", "evenodd");
        this._element.setAttribute(
          "d",
          `M ${x} ${y}` +
            `v ${size}` +
            `h ${size}` +
            `v ${-size}` +
            `z` +
            `M ${x + dotSize} ${y + dotSize}` +
            `v ${size - 2 * dotSize}` +
            `h ${size - 2 * dotSize}` +
            `v ${-size + 2 * dotSize}` +
            `z`
        );
      }
    });
  }

  _basicExtraRounded(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const dotSize = size / 7;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = document.createElementNS("http://www.w3.org/2000/svg", "path");
        this._element.setAttribute("fill-rule", "evenodd");
        this._element.setAttribute(
          "d",
          `M ${x} ${y + 2.5 * dotSize}` +
            `v ${2 * dotSize}` +
            `a ${2.5 * dotSize} ${2.5 * dotSize}, 0, 0, 0, ${dotSize * 2.5} ${dotSize * 2.5}` +
            `h ${2 * dotSize}` +
            `a ${2.5 * dotSize} ${2.5 * dotSize}, 0, 0, 0, ${dotSize * 2.5} ${-dotSize * 2.5}` +
            `v ${-2 * dotSize}` +
            `a ${2.5 * dotSize} ${2.5 * dotSize}, 0, 0, 0, ${-dotSize * 2.5} ${-dotSize * 2.5}` +
            `h ${-2 * dotSize}` +
            `a ${2.5 * dotSize} ${2.5 * dotSize}, 0, 0, 0, ${-dotSize * 2.5} ${dotSize * 2.5}` +
            `M ${x + dotSize} ${y + 2.5 * dotSize}` +
            `v ${2 * dotSize}` +
            `a ${1.5 * dotSize} ${1.5 * dotSize}, 0, 0, 0, ${dotSize * 1.5} ${dotSize * 1.5}` +
            `h ${2 * dotSize}` +
            `a ${1.5 * dotSize} ${1.5 * dotSize}, 0, 0, 0, ${dotSize * 1.5} ${-dotSize * 1.5}` +
            `v ${-2 * dotSize}` +
            `a ${1.5 * dotSize} ${1.5 * dotSize}, 0, 0, 0, ${-dotSize * 1.5} ${-dotSize * 1.5}` +
            `h ${-2 * dotSize}` +
            `a ${1.5 * dotSize} ${1.5 * dotSize}, 0, 0, 0, ${-dotSize * 1.5} ${dotSize * 1.5}`
        );
      }
    });
  }

  _drawDot({ x, y, size, rotation }: DrawArgs): void {
    this._basicDot({ x, y, size, rotation });
  }

  _drawSquare({ x, y, size, rotation }: DrawArgs): void {
    this._basicSquare({ x, y, size, rotation });
  }

  _drawExtraRounded({ x, y, size, rotation }: DrawArgs): void {
    this._basicExtraRounded({ x, y, size, rotation });
  }
}
