import cornerSquareTypes from "../../constants/cornerSquareTypes";
import { CornerSquareType, DrawArgs, BasicFigureDrawArgs, RotateFigureArgs, Window } from "../../types";

export default class QRCornerSquare {
  _element?: SVGElement;
  _svg: SVGElement;
  _type: CornerSquareType;
  _window: Window;

  constructor({ svg, type, window }: { svg: SVGElement; type: CornerSquareType; window: Window }) {
    this._svg = svg;
    this._type = type;
    this._window = window;
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
      case cornerSquareTypes.frame1:
        drawFunction = this._frame1;
        break;
      case cornerSquareTypes.frame2:
        drawFunction = this._frame2;
        break;
      case cornerSquareTypes.frame3:
        drawFunction = this._frame3;
        break;
      case cornerSquareTypes.frame4:
        drawFunction = this._frame4;
        break;
      case cornerSquareTypes.frame16:
        drawFunction = this._frame16;
        break;
      case cornerSquareTypes.dot:
      default:
        drawFunction = this._drawDot;
    }
    drawFunction.call(this, { x, y, size, rotation });
  }

  _rotateFigure({ x, y, size, rotation = 0, draw }: RotateFigureArgs): void {
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
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");
        this._element.setAttribute("clip-rule", "evenodd");
        this._element.setAttribute(
          "d",
          `M ${x + size / 2} ${y}` + // M cx, y //  Move to top of ring
          `a ${size / 2} ${size / 2} 0 1 0 0.1 0` + // a outerRadius, outerRadius, 0, 1, 0, 1, 0 // Draw outer arc, but don't close it
          `z` + // Z // Close the outer shape
          `m 0 ${dotSize}` + // m -1 outerRadius-innerRadius // Move to top point of inner radius
          `a ${size / 2 - dotSize} ${size / 2 - dotSize} 0 1 1 -0.1 0` + // a innerRadius, innerRadius, 0, 1, 1, -1, 0 // Draw inner arc, but don't close it
          `Z` // Z // Close the inner ring. Actually will still work without, but inner ring will have one unit missing in stroke
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
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");
        this._element.setAttribute("clip-rule", "evenodd");
        this._element.setAttribute(
          "d",
          `M ${x} ${y}` +
          `v ${size}` +
          `h ${size}` +
          `v ${-size}` +
          `z` +
          `M ${x + dotSize} ${y + dotSize}` +
          `h ${size - 2 * dotSize}` +
          `v ${size - 2 * dotSize}` +
          `h ${-size + 2 * dotSize}` +
          `z`
        );
      }
    },);
  }

  _basicExtraRounded(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const dotSize = size / 7;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");
        this._element.setAttribute("clip-rule", "evenodd");
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
          `M ${x + 2.5 * dotSize} ${y + dotSize}` +
          `h ${2 * dotSize}` +
          `a ${1.5 * dotSize} ${1.5 * dotSize}, 0, 0, 1, ${dotSize * 1.5} ${dotSize * 1.5}` +
          `v ${2 * dotSize}` +
          `a ${1.5 * dotSize} ${1.5 * dotSize}, 0, 0, 1, ${-dotSize * 1.5} ${dotSize * 1.5}` +
          `h ${-2 * dotSize}` +
          `a ${1.5 * dotSize} ${1.5 * dotSize}, 0, 0, 1, ${-dotSize * 1.5} ${-dotSize * 1.5}` +
          `v ${-2 * dotSize}` +
          `a ${1.5 * dotSize} ${1.5 * dotSize}, 0, 0, 1, ${dotSize * 1.5} ${-dotSize * 1.5}`
        );
      }
    });
  }

  _basicFrame1(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const borderRadius = size / 4;
    const dotSize = size / 7;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");
        this._element.setAttribute("clip-rule", "evenodd");
        this._element.setAttribute(
          "d",
          `M ${x + borderRadius} ${y}` +
          `h ${size - 2 * borderRadius}` +
          `a ${borderRadius} ${borderRadius} 0 0 1 ${borderRadius} ${borderRadius}` +
          `v ${size - 2 * borderRadius}` +
          `a ${borderRadius} ${borderRadius} 1 1 1 ${-borderRadius} ${borderRadius}` +
          `h ${-size + 2 * borderRadius}` +
          `a ${borderRadius} ${borderRadius} 0 0 1 ${-borderRadius} ${-borderRadius}` +
          `v ${-size + 2 * borderRadius}` +
          `a ${borderRadius} ${borderRadius} 0 0 1 ${borderRadius} ${-borderRadius}` +
          `z` +
          `M ${x + dotSize + borderRadius} ${y + dotSize}` +
          `h ${size - 2 * dotSize - 2 * borderRadius}` +
          `a ${borderRadius} ${borderRadius} 0 0 1 ${borderRadius} ${borderRadius}` +
          `v ${size - 1 * dotSize - borderRadius - dotSize}` +
          `L ${x + size - dotSize - borderRadius} ${y + size - dotSize}` +
          `h ${-size + 2 * dotSize + 2 * borderRadius}` +
          `a ${borderRadius} ${borderRadius} 0 0 1 ${-borderRadius} ${-borderRadius}` +
          `v ${-size + 2 * dotSize + 2 * borderRadius}` +
          `a ${borderRadius} ${borderRadius} 0 0 1 ${borderRadius} ${-borderRadius}` +
          `z`
        );
      },
    });
  }

  _basicFrame2(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const borderRadius = size / 4;
    const dotSize = size / 7;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");
        this._element.setAttribute("clip-rule", "evenodd");
        this._element.setAttribute(
          "d",
          `M ${x} ${y}` +
          `h ${size - borderRadius}` +
          `a ${borderRadius} ${borderRadius} 0 0 1 ${borderRadius} ${borderRadius}` +
          `v ${size - 2 * borderRadius}` +
          `a ${borderRadius} ${borderRadius} 1 1 1 ${-borderRadius} ${borderRadius}` +
          `h ${-size + 2 * borderRadius}` +
          `a ${borderRadius} ${borderRadius} 0 0 1 ${-borderRadius} ${-borderRadius}` +
          `v ${-size + borderRadius}` +
          `z` +
          `M ${x + dotSize} ${y + dotSize}` +
          `h ${size - 2 * dotSize - borderRadius}` +
          `a ${borderRadius} ${borderRadius} 0 0 1 ${borderRadius} ${borderRadius}` +
          `v ${size - 1 * dotSize - borderRadius - dotSize}` +
          `L ${x + size - dotSize - borderRadius} ${y + size - dotSize}` +
          `h ${-size + 2 * dotSize + 2 * borderRadius}` +
          `a ${borderRadius} ${borderRadius} 0 0 1 ${-borderRadius} ${-borderRadius}` +
          `v ${-size + 2 * dotSize + borderRadius}` +
          `L ${x + dotSize} ${y + dotSize}` +
          `z`
        );
      },
    });
  }

  _basicFrame3(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const dotSize = size / 7;
    const borderRadius = size / 5; // Adjust the border radius as needed

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");
        this._element.setAttribute("clip-rule", "evenodd");
        this._element.setAttribute(
          "d",
          `M ${x + borderRadius} ${y}` +
          `h ${size - borderRadius}` +
          `v ${size}` +
          `h ${-size}` +
          `v ${-size + borderRadius}` +
          `a ${borderRadius} ${borderRadius} 0 0 1 ${borderRadius} ${-borderRadius}` +
          `z` +
          `M ${x + dotSize + borderRadius} ${y + dotSize}` +
          `h ${size - 2 * dotSize - borderRadius}` +
          `v ${size - 2 * dotSize}` +
          `h ${-size + 2 * dotSize}` +
          `v ${-size + 2 * dotSize + borderRadius}` +
          `a ${borderRadius} ${borderRadius} 0 0 1 ${borderRadius} ${-borderRadius}` +
          `z`
        );
      }
    });
  }


  _basicFrame4(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const circleRadius = size / 14; // Adjust the radius of the circles
    const circleSpacing = circleRadius * 2; // Spacing between circles

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");
        this._element.setAttribute("clip-rule", "evenodd");

        // Generate the path data
        let pathData = "";

        // Top edge circles (excluding corners)
        for (let i = 1; i < size / circleSpacing - 1; i++) {
          const cx = x + circleSpacing * i + circleRadius;
          const cy = y + circleRadius;
          pathData += `M ${cx - circleRadius}, ${cy} a ${circleRadius},${circleRadius} 0 1,0 ${circleRadius * 2},0 a ${circleRadius},${circleRadius} 0 1,0 -${circleRadius * 2},0 `;
        }

        // Right edge circles (excluding corners)
        for (let i = 1; i < size / circleSpacing - 1; i++) {
          const cx = x + size - circleRadius;
          const cy = y + circleSpacing * i + circleRadius;
          pathData += `M ${cx - circleRadius}, ${cy} a ${circleRadius},${circleRadius} 0 1,0 ${circleRadius * 2},0 a ${circleRadius},${circleRadius} 0 1,0 -${circleRadius * 2},0 `;
        }

        // Bottom edge circles (excluding corners)
        for (let i = 1; i < size / circleSpacing - 1; i++) {
          const cx = x + size - circleSpacing * i - circleRadius;
          const cy = y + size - circleRadius;
          pathData += `M ${cx - circleRadius}, ${cy} a ${circleRadius},${circleRadius} 0 1,0 ${circleRadius * 2},0 a ${circleRadius},${circleRadius} 0 1,0 -${circleRadius * 2},0 `;
        }

        // Left edge circles (excluding corners)
        for (let i = 1; i < size / circleSpacing - 1; i++) {
          const cx = x + circleRadius;
          const cy = y + size - circleSpacing * i - circleRadius;
          pathData += `M ${cx - circleRadius}, ${cy} a ${circleRadius},${circleRadius} 0 1,0 ${circleRadius * 2},0 a ${circleRadius},${circleRadius} 0 1,0 -${circleRadius * 2},0 `;
        }

        // Corner circles
        const corners = [
          { cx: x + circleRadius, cy: y + circleRadius }, // Top-left
          { cx: x + size - circleRadius, cy: y + circleRadius }, // Top-right
          { cx: x + size - circleRadius, cy: y + size - circleRadius }, // Bottom-right
          { cx: x + circleRadius, cy: y + size - circleRadius }, // Bottom-left
        ];

        for (const { cx, cy } of corners) {
          pathData += `M ${cx - circleRadius}, ${cy} a ${circleRadius},${circleRadius} 0 1,0 ${circleRadius * 2},0 a ${circleRadius},${circleRadius} 0 1,0 -${circleRadius * 2},0 `;
        }

        // Set the 'd' attribute to the path data
        this._element.setAttribute("d", pathData);
      },
    });
  }


  _basicFrame16(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;

    // Adjust square size and spacing for the desired pattern
    const squareSize = size / 8; // Adjust for less space between squares
    const squareSpacing = squareSize * 1.141; // Adjust for less space between squares

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");
        this._element.setAttribute("clip-rule", "evenodd");

        // Generate the path data
        let pathData = "";

        // Helper function to draw a rotated square
        const drawRotatedSquare = (cx: number, cy: number, rotation: number) => {
          const halfSize = squareSize / 2.7;
          const cos = Math.cos(rotation);
          const sin = Math.sin(rotation);
          const points = [
            { x: -halfSize, y: -halfSize },
            { x: halfSize, y: -halfSize },
            { x: halfSize, y: halfSize },
            { x: -halfSize, y: halfSize },
          ].map(({ x, y }) => ({
            x: cx + x * cos - y * sin,
            y: cy + x * sin + y * cos,
          }));
          return `M ${points.map(p => `${p.x} ${p.y}`).join(' L ')} Z `;
        };

        // Draw edge squares (excluding corners) with adjustments for the pattern
        for (let i = 0; i < size / squareSpacing - 1; i++) {
          const cx = x + squareSpacing * i + squareSize / 2;
          const cy = y + squareSize / 2;
          pathData += drawRotatedSquare(cx, cy, Math.PI / 4);
        }

        for (let i = 1; i < size / squareSpacing - 1; i++) {
          const cx = x + size - squareSize / 2;
          const cy = y + squareSpacing * i + squareSize / 2;
          pathData += drawRotatedSquare(cx, cy, Math.PI / 4);
        }

        for (let i = 1; i < size / squareSpacing - 1; i++) {
          const cx = x + size - squareSpacing * i - squareSize / 2;
          const cy = y + size - squareSize / 2;
          pathData += drawRotatedSquare(cx, cy, Math.PI / 4);
        }

        for (let i = 1; i < size / squareSpacing - 1; i++) {
          const cx = x + squareSize / 2;
          const cy = y + size - squareSpacing * i - squareSize / 2;
          pathData += drawRotatedSquare(cx, cy, Math.PI / 4);
        }
        this._element.setAttribute("d", pathData);
      },
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

  _frame1({ x, y, size, rotation }: DrawArgs): void {
    this._basicFrame1({ x, y, size, rotation });
  }

  _frame2({ x, y, size, rotation }: DrawArgs): void {
    this._basicFrame2({ x, y, size, rotation });
  }

  _frame3({ x, y, size, rotation }: DrawArgs): void {
    this._basicFrame3({ x, y, size, rotation });
  }

  _frame4({ x, y, size, rotation }: DrawArgs): void {
    this._basicFrame4({ x, y, size, rotation });
  }

  _frame16({ x, y, size, rotation }: DrawArgs): void {
    this._basicFrame16({ x, y, size, rotation });
  }
}
