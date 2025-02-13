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
      case cornerSquareTypes.frame7:
          drawFunction = this._frame7;
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

  _basicFrame7(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const radius = size / 2.2; // Outer corner radius
    const innerMargin = size / 6; // Margin for inner cutout
    const innerRadius = size / 3.7; // Inner corner radius

    this._rotateFigure({
        ...args,
        draw: () => {
            this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");
            this._element.setAttribute("clip-rule", "evenodd");
            this._element.setAttribute(
                "d",
                `M ${x + radius} ${y} 
                 H ${x + size - radius} 
                 A ${radius} ${radius} 0 0 1 ${x + size} ${y + radius} 
                 V ${y + size - radius} 
                 A ${radius} ${radius} 0 0 1 ${x + size - radius} ${y + size} 
                 H ${x + radius} 
                 A ${radius} ${radius} 0 0 1 ${x} ${y + size - radius} 
                 V ${y + radius} 
                 A ${radius} ${radius} 0 0 1 ${x + radius} ${y} 
                 Z
                 
                 M ${x + innerMargin + innerRadius} ${y + innerMargin} 
                 H ${x + size - innerMargin - innerRadius} 
                 A ${innerRadius} ${innerRadius} 0 0 1 ${x + size - innerMargin} ${y + innerMargin + innerRadius} 
                 V ${y + size - innerMargin - innerRadius} 
                 A ${innerRadius} ${innerRadius} 0 0 1 ${x + size - innerMargin - innerRadius} ${y + size - innerMargin} 
                 H ${x + innerMargin + innerRadius} 
                 A ${innerRadius} ${innerRadius} 0 0 1 ${x + innerMargin} ${y + size - innerMargin - innerRadius} 
                 V ${y + innerMargin + innerRadius} 
                 A ${innerRadius} ${innerRadius} 0 0 1 ${x + innerMargin + innerRadius} ${y + innerMargin} 
                 Z`
            );
        }
    });
}




  _basicFrame16(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const squareSize = size / 8.5;
    const squareSpacing = squareSize * 1.22;
    const shrinkFactor = size / 45;

    const adjustedSize = size - shrinkFactor * 2;
    const adjustedX = x + shrinkFactor;
    const adjustedY = y + shrinkFactor;

    this._rotateFigure({
        ...args,
        draw: () => {
            this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");
            this._element.setAttribute("clip-rule", "evenodd");

            // Generate the path data
            let pathData = "";

            const drawSquare = (cx: number, cy: number, size: number, rotation: number) => {
              const halfSize = size / 2;
          
              // Ensure rotation is within -30 to 30 degrees
              const maxRotation = Math.PI / 6; // 30 degrees in radians
              rotation = Math.max(-maxRotation, Math.min(maxRotation, rotation)); // Clamping rotation
          
              // Calculate rotated square corners
              const points = [
                  { x: -halfSize, y: -halfSize },
                  { x: halfSize, y: -halfSize },
                  { x: halfSize, y: halfSize },
                  { x: -halfSize, y: halfSize },
              ].map(point => ({
                  x: point.x * Math.cos(rotation) - point.y * Math.sin(rotation) + cx,
                  y: point.x * Math.sin(rotation) + point.y * Math.cos(rotation) + cy,
              }));
          
              // Construct path data for an SVG square
              return `M ${points[0].x},${points[0].y} 
                      L ${points[1].x},${points[1].y} 
                      L ${points[2].x},${points[2].y} 
                      L ${points[3].x},${points[3].y} Z `;
          };
          
            const addSquares = (
              startX: number,
              startY: number,
              isVertical: boolean,
              direction: 1 | -1
          ) => {
              const count = Math.floor(adjustedSize / squareSpacing) - 1;
              for (let i = 0; i < count; i++) {
                  const cx = isVertical
                      ? startX
                      : startX + direction * (squareSpacing * (i + 1));
                  const cy = isVertical
                      ? startY + direction * (squareSpacing * (i + 1))
                      : startY;
          
                  const maxRotation = Math.PI / 6; // 30 degrees in radians
                  const rotation = (Math.random() * maxRotation) * (Math.random() < 0.5 ? 1 : -1); // Random rotation between -30 and 30 degrees
          
                  pathData += drawSquare(cx, cy, squareSize, rotation);
              }
          };
          

            // Top edge squares
            addSquares(adjustedX + squareSize / 2, adjustedY + squareSize / 2, false, 1);

            // Right edge squares
            addSquares(adjustedX + adjustedSize - squareSize / 2, adjustedY + squareSize / 2, true, 1);

            // Bottom edge squares
            addSquares(adjustedX + adjustedSize - squareSize / 2, adjustedY + adjustedSize - squareSize / 2, false, -1);

            // Left edge squares
            addSquares(adjustedX + squareSize / 2, adjustedY + adjustedSize - squareSize / 2, true, -1);

            // Corner squares
            const corners = [
                { cx: adjustedX + squareSize / 2, cy: adjustedY + squareSize / 2 }, // Top-left
                { cx: adjustedX + adjustedSize - squareSize / 2, cy: adjustedY + squareSize / 2 }, // Top-right
                { cx: adjustedX + adjustedSize - squareSize / 2, cy: adjustedY + adjustedSize - squareSize / 2 }, // Bottom-right
                { cx: adjustedX + squareSize / 2, cy: adjustedY + adjustedSize - squareSize / 2 }, // Bottom-left
            ];

            for (const { cx, cy } of corners) {
              const maxRotation = Math.PI / 6; // 30 degrees in radians
              const rotation = (Math.random() * 2 - 1) * maxRotation; // Random value between -30° and +30°
              pathData += drawSquare(cx, cy, squareSize, rotation);
          }
          

            // Set the 'd' attribute to the path data
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

  _frame7({ x, y, size, rotation }: DrawArgs): void {
    this._basicFrame7({ x, y, size, rotation });
  }

  _frame16({ x, y, size, rotation }: DrawArgs): void {
    this._basicFrame16({ x, y, size, rotation });
  }
}
