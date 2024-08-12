import cornerDotTypes from "../../../constants/cornerDotTypes";
import {
  CornerDotType,
  RotateFigureArgsCanvas,
  BasicFigureDrawArgsCanvas,
  DrawArgsCanvas,
} from "../../../types";

export default class QRCornerDot {
  _context: CanvasRenderingContext2D;
  _type: CornerDotType;

  constructor({
    context,
    type,
  }: {
    context: CanvasRenderingContext2D;
    type: CornerDotType;
  }) {
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
      case cornerDotTypes.squareRounded:
        drawFunction = this._drawSquareRounded;
        break;
      case cornerDotTypes.rightBottomSquare:
        drawFunction = this._drawSquareRoundedRightBottomEdge;
        break;

      case cornerDotTypes.star:
        drawFunction = this._drawStar;
        break;
      case cornerDotTypes.plus:
        drawFunction = this._drawPlus;
        break;
      case cornerDotTypes.cross:
        drawFunction = this._drawCross;
        break;
      case cornerDotTypes.diamond:
        drawFunction = this._drawDiamond;
        break;
      case cornerDotTypes.leaf:
        drawFunction = this._drawLeaf;
        break;
      case cornerDotTypes.leftTopCircle:
        drawFunction = this._drawCircleLeftTopEdge;
        break;
      case cornerDotTypes.rightBottomCircle:
        drawFunction = this._drawCircleRightBottomEdge;
        break;
      case cornerDotTypes.dot:
      default:
        drawFunction = this._drawDot;
    }

    drawFunction.call(this, { x, y, size, context, rotation });
  }

  _rotateFigure({
    x,
    y,
    size,
    context,
    rotation = 0,
    draw,
  }: RotateFigureArgsCanvas): void {
    const cx = x + size / 2;
    const cy = y + size / 2;

    context.translate(cx, cy);
    rotation && context.rotate(rotation);
    draw();
    context.closePath();
    rotation && context.rotate(-rotation);
    context.translate(-cx, -cy);
  }

  _basicDot(args: BasicFigureDrawArgsCanvas): void {
    const { size, context } = args;

    this._rotateFigure({
      ...args,
      draw: () => {
        context.arc(0, 0, size / 2, 0, Math.PI * 2);
      },
    });
  }

  _basicSquare(args: BasicFigureDrawArgsCanvas): void {
    const { size, context } = args;

    this._rotateFigure({
      ...args,
      draw: () => {
        context.rect(-size / 2, -size / 2, size, size);
      },
    });
  }

  _basicRoundedSquare(args: BasicFigureDrawArgsCanvas): void {
    const { size, context } = args;
    const radius = size / 5; // Adjust the radius as needed

    this._rotateFigure({
      ...args,
      draw: () => {
        const halfSize = size / 2;
        context.beginPath();
        context.moveTo(-halfSize + radius, -halfSize);
        context.lineTo(halfSize - radius, -halfSize);
        context.arcTo(
          halfSize,
          -halfSize,
          halfSize,
          -halfSize + radius,
          radius
        );
        context.lineTo(halfSize, halfSize - radius);
        context.arcTo(halfSize, halfSize, halfSize - radius, halfSize, radius);
        context.lineTo(-halfSize + radius, halfSize);
        context.arcTo(
          -halfSize,
          halfSize,
          -halfSize,
          halfSize - radius,
          radius
        );
        context.lineTo(-halfSize, -halfSize + radius);
        context.arcTo(
          -halfSize,
          -halfSize,
          -halfSize + radius,
          -halfSize,
          radius
        );
        context.closePath();
      },
    });
  }

  _basicRoundedSquareRightBottomEdge(args: BasicFigureDrawArgsCanvas): void {
    const { size, context } = args;
    const radius = size / 5; // Adjust the radius as needed

    this._rotateFigure({
      ...args,
      draw: () => {
        const halfSize = size / 2;
        context.beginPath();
        context.moveTo(-halfSize + radius, -halfSize);
        context.lineTo(halfSize - radius, -halfSize);
        context.arcTo(
          halfSize,
          -halfSize,
          halfSize,
          -halfSize + radius,
          radius
        );
        context.lineTo(halfSize, -halfSize + radius);
        context.lineTo(halfSize, halfSize);
        context.lineTo(halfSize - radius, halfSize);
        context.arcTo(
          halfSize - radius,
          halfSize,
          halfSize - radius,
          halfSize - radius,
          radius
        );
        context.lineTo(-halfSize + radius, halfSize);
        context.arcTo(
          -halfSize,
          halfSize,
          -halfSize,
          halfSize - radius,
          radius
        );
        context.lineTo(-halfSize, -halfSize + radius);
        context.arcTo(
          -halfSize,
          -halfSize,
          -halfSize + radius,
          -halfSize,
          radius
        );
        context.closePath();
      },
    });
  }

  _basicLeaf(args: BasicFigureDrawArgsCanvas): void {
    const { size, context } = args;
    const extension = size / 4; // Adjust the extension as needed
    const cornerRadius = size / 10; // Adjust the corner radius as needed

    this._rotateFigure({
      ...args,
      draw: () => {
        context.beginPath();
        context.moveTo(-size / 2.2 - extension, -size / 2.2 - extension); // Start at the top left corner
        context.lineTo(size / 2.2, -size / 2.2); // Draw top edge
        context.lineTo(size / 2.2, size / 2.2); // Draw right edge
        context.lineTo(-size / 2.2, size / 2.2); // Draw bottom edge

        // Draw rounded left top corner
        context.arc(
          -size / 2.2 - extension + cornerRadius,
          -size / 2.2 + cornerRadius - extension,
          cornerRadius,
          Math.PI,
          Math.PI * 1.5
        );

        context.closePath();

        context.fill();
      },
    });
  }

  _basicCircleLeftTopEdge(args: BasicFigureDrawArgsCanvas): void {
    const { size, context } = args;
    const radius = size / 2; // Radius of the rounded corners
    const cornerSize = radius / 32; // Size of the flat top-left corner

    this._rotateFigure({
      ...args,
      draw: () => {
        const halfSize = size / 2;

        // Draw the full rounded square
        context.beginPath();

        // Move to the starting point of the top-right corner
        context.moveTo(-halfSize + cornerSize, -halfSize);

        // Draw the top-right corner
        context.lineTo(halfSize - radius, -halfSize);
        context.arcTo(
          halfSize,
          -halfSize,
          halfSize,
          -halfSize + radius,
          radius
        );

        // Draw the right side
        context.lineTo(halfSize, halfSize - radius);
        context.arcTo(halfSize, halfSize, halfSize - radius, halfSize, radius);

        // Draw the bottom side
        context.lineTo(-halfSize + radius, halfSize);
        context.arcTo(
          -halfSize,
          halfSize,
          -halfSize,
          halfSize - radius,
          radius
        );

        // Draw the left side
        context.lineTo(-halfSize, -halfSize + cornerSize);

        // Draw the flat top-left corner
        context.lineTo(-halfSize + cornerSize, -halfSize);

        context.closePath();
        // context.fillStyle = '#000'; // Set color for the rounded square
        context.fill();
      },
    });
  }

  _basicCircleRightBottomEdge(args: BasicFigureDrawArgsCanvas): void {
    const { size, context } = args;
    const radius = size / 2; // Radius of the rounded corners
    const cornerSize = radius / 32; // Size of the flat right-bottom corner

    this._rotateFigure({
      ...args,
      draw: () => {
        const halfSize = size / 2;

        // Draw the full rounded square
        context.beginPath();

        // Move to the starting point of the top-left corner
        context.moveTo(-halfSize, -halfSize + cornerSize);

        // Draw the top-left corner
        context.lineTo(-halfSize + radius, -halfSize);
        context.arcTo(
          -halfSize,
          -halfSize,
          -halfSize,
          -halfSize + radius,
          radius
        );

        // Draw the top side
        context.lineTo(halfSize - radius, -halfSize);
        context.arcTo(
          halfSize,
          -halfSize,
          halfSize,
          -halfSize + radius,
          radius
        );

        // Draw the right side
        context.lineTo(halfSize, halfSize - cornerSize);

        // Draw the flat right-bottom corner
        context.lineTo(halfSize, halfSize);
        context.lineTo(halfSize - cornerSize, halfSize);

        // Draw the bottom side
        context.lineTo(-halfSize + radius, halfSize);
        context.arcTo(
          -halfSize,
          halfSize,
          -halfSize,
          halfSize - radius,
          radius
        );

        context.closePath();
        // context.fillStyle = '#000'; // Set color for the rounded square
        context.fill();
      },
    });
  }

  _basicDiamond(args: BasicFigureDrawArgsCanvas): void {
    const { size, context } = args;
    const halfSize = size / 2; // Half the size of the diamond

    this._rotateFigure({
      ...args,
      draw: () => {
        context.beginPath();

        // Move to the top point of the diamond
        context.moveTo(0, -halfSize);

        // Draw the right point
        context.lineTo(halfSize, 0);

        // Draw the bottom point
        context.lineTo(0, halfSize);

        // Draw the left point
        context.lineTo(-halfSize, 0);

        // Close the path to the top point
        context.closePath();

        // context.fillStyle = "#000"; // Set color for the diamond
        context.fill();
      },
    });
  }

  _basicStar(args: BasicFigureDrawArgsCanvas): void {
    const { size, context } = args;

    const numPoints = 5;
    const outerRadius = size / 2;
    const innerRadius = outerRadius / 2.5;
    const step = Math.PI / numPoints;

    this._rotateFigure({
      ...args,
      draw: () => {
        context.beginPath();
        for (let i = 0; i < 2 * numPoints; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const angle = i * step;
          context.lineTo(radius * Math.cos(angle), radius * Math.sin(angle));
        }
        context.closePath();
      },
    });
  }

  _basicPlus(args: BasicFigureDrawArgsCanvas): void {
    const { size, context } = args;

    const thickness = size / 5;
    const halfThickness = thickness / 2;
    const halfSize = size / 2;

    this._rotateFigure({
      ...args,
      draw: () => {
        context.beginPath();
        context.rect(-halfThickness, -halfSize, thickness, size); // vertical rectangle
        context.rect(-halfSize, -halfThickness, size, thickness); // horizontal rectangle
        context.closePath();
      },
    });
  }

  _basicCross(args: BasicFigureDrawArgsCanvas): void {
    const { size, context } = args;
    const lineWidth = size / 4; // Width of the cross lines
    const halfSize = size / 2; // Half the size of the cross

    this._rotateFigure({
        ...args,
        draw: () => {
            context.save(); // Save the current state
            context.translate(0, 0); // Move to the center
            context.rotate(Math.PI / 4); // Rotate 45 degrees (pi/4 radians)

            context.beginPath();
            
            // Draw the horizontal line of the cross
            context.rect(-halfSize, -lineWidth / 2, size, lineWidth);

            // Draw the vertical line of the cross
            context.rect(-lineWidth / 2, -halfSize, lineWidth, size);

            context.fillStyle = '#000'; // Set c//olor for the cross
            context.fill();

            context.restore(); // Restore the state
        },
    });
  }

  _drawDot({ x, y, size, context, rotation }: DrawArgsCanvas): void {
    this._basicDot({ x, y, size, context, rotation });
  }

  _drawSquare({ x, y, size, context, rotation }: DrawArgsCanvas): void {
    this._basicSquare({ x, y, size, context, rotation });
  }

  _drawStar({ x, y, size, context, rotation }: DrawArgsCanvas): void {
    this._basicStar({ x, y, size, context, rotation });
  }

  _drawPlus({ x, y, size, context, rotation }: DrawArgsCanvas): void {
    this._basicPlus({ x, y, size, context, rotation });
  }

  _drawCross({ x, y, size, context, rotation }: DrawArgsCanvas): void {
    this._basicCross({ x, y, size, context, rotation });
  }

  _drawDiamond({ x, y, size, context, rotation }: DrawArgsCanvas): void {
    this._basicDiamond({ x, y, size, context, rotation });
  }

  _drawSquareRounded({ x, y, size, context, rotation }: DrawArgsCanvas): void {
    this._basicRoundedSquare({ x, y, size, context, rotation });
  }

  _drawSquareRoundedRightBottomEdge({
    x,
    y,
    size,
    context,
    rotation,
  }: DrawArgsCanvas): void {
    this._basicRoundedSquareRightBottomEdge({ x, y, size, context, rotation });
  }

  _drawLeaf({ x, y, size, context, rotation }: DrawArgsCanvas): void {
    this._basicLeaf({ x, y, size, context, rotation });
  }

  _drawCircleLeftTopEdge({
    x,
    y,
    size,
    context,
    rotation,
  }: DrawArgsCanvas): void {
    this._basicCircleLeftTopEdge({ x, y, size, context, rotation });
  }

  _drawCircleRightBottomEdge({
    x,
    y,
    size,
    context,
    rotation,
  }: DrawArgsCanvas): void {
    this._basicCircleRightBottomEdge({ x, y, size, context, rotation });
  }
}
