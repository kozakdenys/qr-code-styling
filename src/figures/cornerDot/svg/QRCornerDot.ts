import cornerDotTypes from "../../../constants/cornerDotTypes";
import {
  CornerDotType,
  RotateFigureArgs,
  BasicFigureDrawArgs,
  DrawArgs,
} from "../../../types";

export default class QRCornerDot {
  _svg: SVGElement;
  _type: CornerDotType;
  _element: SVGElement | null;

  constructor({ svg, type }: { svg: SVGElement; type: CornerDotType }) {
    this._svg = svg;
    this._type = type;
    this._element = null;
  }

  draw(x: number, y: number, size: number, rotation: number): void {
    const type = this._type;
    let drawFunction;

    switch (type) {
      case cornerDotTypes.square:
        drawFunction = this._drawSquare;
        break;
      case cornerDotTypes.star:
        drawFunction = this._drawStar;
        break;
      case cornerDotTypes.squareRounded:
        drawFunction = this._drawSquareRounded;
        break;
      case cornerDotTypes.rightBottomSquare:
        drawFunction = this._drawSquareRoundedRightBottomEdge;
        break;
      case cornerDotTypes.plus:
        drawFunction = this._drawPlus;
        break;
      case cornerDotTypes.cross:
        drawFunction = this._drawCross;
        break;
      case cornerDotTypes.rhombus:
        drawFunction = this._drawRhombus;
        break;
      case cornerDotTypes.leaf:
        drawFunction = this._drawLead;
        break;
      case cornerDotTypes.leftTopCircle:
        drawFunction = this._drawCircleLeftTopEdge;
        break;
      case cornerDotTypes.rightBottomCircle:
        drawFunction = this._drawCircleRightBottomEdge;
        break;
      case cornerDotTypes.diamond:
        drawFunction = this._drawDiamond;
        break;
      case cornerDotTypes.dot:
      default:
        drawFunction = this._drawDot;
    }

    drawFunction.call(this, { x, y, size, rotation });
  }

  _rotateFigure({ x, y, size, rotation = 0, draw }: RotateFigureArgs): void {
    const cx = x + size / 2;
    const cy = y + size / 2;

    draw();
    const lastChild = this._svg.lastChild as SVGElement | null;
    if (lastChild) {
      lastChild.setAttribute(
        "transform",
        `rotate(${(180 * rotation) / Math.PI},${cx},${cy})`
      );
    }
  }

  _basicDot(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;

    this._rotateFigure({
      ...args,
      draw: () => {
        const circle = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle"
        );
        circle.setAttribute("cx", String(x + size / 2));
        circle.setAttribute("cy", String(y + size / 2));
        circle.setAttribute("r", String(size / 2));
        this._svg.appendChild(circle);
      },
    });
  }

  _basicSquare(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;

    this._rotateFigure({
      ...args,
      draw: () => {
        const rect = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect"
        );
        rect.setAttribute("x", String(x));
        rect.setAttribute("y", String(y));
        rect.setAttribute("width", String(size));
        rect.setAttribute("height", String(size));
        this._svg.appendChild(rect);
      },
    });
  }

  _basicRoundedSquare(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const radius = size / 5; // Adjust the radius as needed

    this._rotateFigure({
      ...args,
      draw: () => {
        const rect = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect"
        );
        rect.setAttribute("x", String(x));
        rect.setAttribute("y", String(y));
        rect.setAttribute("width", String(size));
        rect.setAttribute("height", String(size));
        rect.setAttribute("rx", String(radius));
        rect.setAttribute("ry", String(radius));
        this._svg.appendChild(rect);
      },
    });
  }

  _basicRoundedSquareRightBottomEdge(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const radius = size / 5; // Adjust the radius as needed

    this._rotateFigure({
      ...args,
      draw: () => {
        const rect = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect"
        );
        rect.setAttribute("x", String(x));
        rect.setAttribute("y", String(y));
        rect.setAttribute("width", String(size));
        rect.setAttribute("height", String(size));
        rect.setAttribute("rx", String(radius));
        rect.setAttribute("ry", String(radius));

        // Create a small rectangle to cover the bottom right corner
        const flatCornerRect = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect"
        );
        flatCornerRect.setAttribute("x", String(x + size - radius));
        flatCornerRect.setAttribute("y", String(y + size - radius));
        flatCornerRect.setAttribute("width", String(radius));
        flatCornerRect.setAttribute("height", String(radius));

        this._svg.appendChild(rect);
        this._svg.appendChild(flatCornerRect);
      },
    });
  }

  _basicLeaf(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const extension = size / 4; // Adjust the extension as needed
    const cornerRadius = size / 10; // Adjust the corner radius as needed

    this._rotateFigure({
      ...args,
      draw: () => {
        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        const d = `
        M ${x - size / 2.2 - extension},${
          y - size / 2.2 - extension
        }  // Move to the top left corner
        L ${x + size / 2.2},${y - size / 2.2}  // Draw top edge
        L ${x + size / 2.2},${y + size / 2.2}  // Draw right edge
        L ${x - size / 2.2},${y + size / 2.2}  // Draw bottom edge
        A ${cornerRadius},${cornerRadius} 0 0 1 ${
          x - size / 2.2 - extension + cornerRadius
        },${y - size / 2.2 + cornerRadius}  // Draw rounded left top corner
        Z  // Close the path
      `
          .replace(/\/\/.*$/gm, "")
          .trim(); // Remove comments and trim whitespace
        path.setAttribute("d", d);
        this._svg.appendChild(path);
      },
    });
  }

  // _basicCircleLeftTopEdge(args: BasicFigureDrawArgs): void {
  //   const { size, x, y } = args;
  //   const radius = size / 2;

  //   this._rotateFigure({
  //     ...args,
  //     draw: () => {
  //       const circle = document.createElementNS(
  //         "http://www.w3.org/2000/svg",
  //         "circle"
  //       );

  //       // Adjust the attributes to position the circle with a flat top left corner
  //       circle.setAttribute("cx", String(x + radius)); // Adjusted to radius for left edge
  //       circle.setAttribute("cy", String(y + radius)); // Adjusted to radius for top edge
  //       circle.setAttribute("r", String(radius)); // Use radius as the size

  //       this._svg.appendChild(circle);
  //     },
  //   });
  // }

  _basicCircleLeftTopEdge(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const radius = size / 2;

    this._rotateFigure({
      ...args,
      draw: () => {
        // Create a circle for the curved part
        const circle = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle"
        );
        circle.setAttribute("cx", String(x + radius));
        circle.setAttribute("cy", String(y + radius));
        circle.setAttribute("r", String(radius));

        // Create a rectangle for the flat corner
        const rect = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect"
        );
        rect.setAttribute("x", String(x));
        rect.setAttribute("y", String(y));
        rect.setAttribute("width", String(radius));
        rect.setAttribute("height", String(radius));

        // Add both shapes to the SVG
        this._svg.appendChild(circle);
        this._svg.appendChild(rect);
      },
    });
  }

  _basicCircleRightBottomEdge(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const radius = size / 2;

    this._rotateFigure({
      ...args,
      draw: () => {
        // Create a circle for the curved part
        const circle = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle"
        );
        circle.setAttribute("cx", String(x + radius));
        circle.setAttribute("cy", String(y + radius));
        circle.setAttribute("r", String(radius));

        // Create a rectangle for the flat bottom-right corner
        const rect = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect"
        );
        rect.setAttribute("x", String(x + radius));
        rect.setAttribute("y", String(y + radius));
        rect.setAttribute("width", String(radius));
        rect.setAttribute("height", String(radius));

        // Add both shapes to the SVG
        this._svg.appendChild(circle);
        this._svg.appendChild(rect);
      },
    });
  }

  // _basicExtendedSquare(args: BasicFigureDrawArgs): void {
  //   const { size, x, y } = args;
  //   const extension = size / 6;  // Adjust the extension as needed

  //   this._rotateFigure({
  //     ...args,
  //     draw: () => {
  //       const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  //       rect.setAttribute("x", String(x - extension));
  //       rect.setAttribute("y", String(y - extension));
  //       rect.setAttribute("width", String(size + extension));
  //       rect.setAttribute("height", String(size + extension));
  //       this._svg.appendChild(rect);
  //     }
  //   });
  // }

  _basicDiamond(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;

    this._rotateFigure({
      ...args,
      draw: () => {
        const polygon = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "polygon"
        );
        polygon.setAttribute(
          "points",
          `
          ${x + size / 2}, ${y}
          ${x + size}, ${y + size / 2}
          ${x + size / 2}, ${y + size}
          ${x}, ${y + size / 2}
        `
        );
        this._svg.appendChild(polygon);
      },
    });
  }

  _basicStar(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;

    const numPoints = 5;
    const outerRadius = size / 2;
    const innerRadius = outerRadius / 2.5;
    const step = Math.PI / numPoints;

    this._rotateFigure({
      ...args,
      draw: () => {
        const points = [];
        for (let i = 0; i < 2 * numPoints; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const angle = i * step;
          const px = x + size / 2 + radius * Math.cos(angle);
          const py = y + size / 2 + radius * Math.sin(angle);
          points.push(`${px},${py}`);
        }

        const polygon = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "polygon"
        );
        polygon.setAttribute("points", points.join(" "));
        this._svg.appendChild(polygon);
      },
    });
  }

  _basicPlus(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;

    const thickness = size / 5;
    const halfThickness = thickness / 2;
    const halfSize = size / 2;

    this._rotateFigure({
      ...args,
      draw: () => {
        const group = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "g"
        );

        const verticalRect = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect"
        );
        verticalRect.setAttribute("x", String(x + halfSize - halfThickness));
        verticalRect.setAttribute("y", String(y));
        verticalRect.setAttribute("width", String(thickness));
        verticalRect.setAttribute("height", String(size));
        group.appendChild(verticalRect);

        const horizontalRect = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect"
        );
        horizontalRect.setAttribute("x", String(x));
        horizontalRect.setAttribute("y", String(y + halfSize - halfThickness));
        horizontalRect.setAttribute("width", String(size));
        horizontalRect.setAttribute("height", String(thickness));
        group.appendChild(horizontalRect);

        this._svg.appendChild(group);
      },
    });
  }

  _basicCross(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;

    const thickness = size / 2.5;
    const halfThickness = thickness / 2;
    const halfSize = size / 2;

    this._rotateFigure({
      ...args,
      draw: () => {
        const group = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "g"
        );

        const verticalRect = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect"
        );
        verticalRect.setAttribute("x", String(x + halfSize - halfThickness));
        verticalRect.setAttribute("y", String(y));
        verticalRect.setAttribute("width", String(thickness));
        verticalRect.setAttribute("height", String(size));
        verticalRect.setAttribute(
          "transform",
          `rotate(45 ${x + halfSize} ${y + halfSize})`
        );
        verticalRect.setAttribute("rx", String(thickness / 2)); // add this line
        group.appendChild(verticalRect);

        const horizontalRect = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect"
        );
        horizontalRect.setAttribute("x", String(x));
        horizontalRect.setAttribute("y", String(y + halfSize - halfThickness));
        horizontalRect.setAttribute("width", String(size));
        horizontalRect.setAttribute("height", String(thickness));
        horizontalRect.setAttribute(
          "transform",
          `rotate(45 ${x + halfSize} ${y + halfSize})`
        );
        horizontalRect.setAttribute("rx", String(thickness / 2)); // add this line
        group.appendChild(horizontalRect);

        this._svg.appendChild(group);
      },
    });
  }

  _basicRhombus(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;

    const thickness = size / 1.8;
    const halfThickness = thickness / 2;
    const halfSize = size / 2;

    this._rotateFigure({
      ...args,
      draw: () => {
        const group = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "g"
        );

        // group.setAttribute("transform", `rotate(45 ${x + halfSize} ${y + halfSize})`);

        const verticalRect = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect"
        );
        verticalRect.setAttribute("x", String(x + halfSize - halfThickness));
        verticalRect.setAttribute("y", String(y));
        verticalRect.setAttribute("width", String(thickness));
        verticalRect.setAttribute("height", String(size));

        const verticalTopTriangle = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "polygon"
        );
        verticalTopTriangle.setAttribute(
          "points",
          `
          ${x + halfSize - halfThickness},${y}
          ${x + halfSize},${y - halfThickness}
          ${x + halfSize + halfThickness},${y}
        `
        );

        const verticalBottomTriangle = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "polygon"
        );
        verticalBottomTriangle.setAttribute(
          "points",
          `
          ${x + halfSize - halfThickness},${y + size}
          ${x + halfSize + halfThickness},${y + size}
          ${x + halfSize},${y + size + halfThickness}
        `
        );

        group.appendChild(verticalRect);
        group.appendChild(verticalTopTriangle);
        group.appendChild(verticalBottomTriangle);

        const horizontalRect = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect"
        );
        horizontalRect.setAttribute("x", String(x));
        horizontalRect.setAttribute("y", String(y + halfSize - halfThickness));
        horizontalRect.setAttribute("width", String(size));
        horizontalRect.setAttribute("height", String(thickness));

        const horizontalLeftTriangle = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "polygon"
        );
        horizontalLeftTriangle.setAttribute(
          "points",
          `
          ${x},${y + halfSize - halfThickness}
          ${x - halfThickness},${y + halfSize}
          ${x},${y + halfSize + halfThickness}
        `
        );

        const horizontalRightTriangle = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "polygon"
        );
        horizontalRightTriangle.setAttribute(
          "points",
          `
          ${x + size},${y + halfSize - halfThickness}
          ${x + size + halfThickness},${y + halfSize}
          ${x + size},${y + halfSize + halfThickness}
        `
        );

        group.appendChild(horizontalRect);
        group.appendChild(horizontalLeftTriangle);
        group.appendChild(horizontalRightTriangle);

        this._svg.appendChild(group);
      },
    });
  }

  _drawDot({ x, y, size, rotation }: DrawArgs): void {
    this._basicDot({ x, y, size, rotation });
  }

  _drawSquare({ x, y, size, rotation }: DrawArgs): void {
    this._basicSquare({ x, y, size, rotation });
  }

  _drawStar({ x, y, size, rotation }: DrawArgs): void {
    this._basicStar({ x, y, size, rotation });
  }

  _drawPlus({ x, y, size, rotation }: DrawArgs): void {
    this._basicPlus({ x, y, size, rotation });
  }

  _drawSquareRounded({ x, y, size, rotation }: DrawArgs): void {
    this._basicRoundedSquare({ x, y, size, rotation });
  }

  _drawSquareRoundedRightBottomEdge({ x, y, size, rotation }: DrawArgs): void {
    this._basicRoundedSquareRightBottomEdge({ x, y, size, rotation });
  }

  _drawLead({ x, y, size, rotation }: DrawArgs): void {
    this._basicLeaf({ x, y, size, rotation });
  }

  _drawCircleLeftTopEdge({ x, y, size, rotation }: DrawArgs): void {
    this._basicCircleLeftTopEdge({ x, y, size, rotation });
  }
  _drawCircleRightBottomEdge({ x, y, size, rotation }: DrawArgs): void {
    this._basicCircleRightBottomEdge({ x, y, size, rotation });
  }

  _drawDiamond({ x, y, size, rotation }: DrawArgs): void {
    this._basicDiamond({ x, y, size, rotation });
  }
  _drawCross({ x, y, size, rotation }: DrawArgs): void {
    this._basicCross({ x, y, size, rotation });
  }

  _drawRhombus({ x, y, size, rotation }: DrawArgs): void {
    this._basicRhombus({ x, y, size, rotation });
  }
}
