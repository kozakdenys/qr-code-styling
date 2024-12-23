import cornerDotTypes from "../../constants/cornerDotTypes";
import { CornerDotType, RotateFigureArgs, BasicFigureDrawArgs, DrawArgs, Window } from "../../types";

export default class QRCornerDot {
  _element?: SVGElement;
  _svg: SVGElement;
  _type: CornerDotType;
  _window: Window;

  constructor({ svg, type, window }: { svg: SVGElement; type: CornerDotType; window: Window }) {
    this._svg = svg;
    this._type = type;
    this._window = window;
  }

  draw(x: number, y: number, size: number, rotation: number): void {
    const type = this._type;
    let drawFunction;

    switch (type) {
      case cornerDotTypes.square:
        drawFunction = this._drawSquare;
        break;
      case cornerDotTypes.ball1:
        drawFunction = this._drawBall1;
        break;
      case cornerDotTypes.ball2:
        drawFunction = this._drawBall2;
        break;
      case cornerDotTypes.ball3:
        drawFunction = this._drawBall3;
        break;
      case cornerDotTypes.ball5:
          drawFunction = this._drawBall5;
          break;
      case cornerDotTypes.ball15:
        drawFunction = this._drawBall15;
        break;
      case cornerDotTypes.ball18:
        drawFunction = this._drawBall18;
        break;
      case cornerDotTypes.ball19:
         drawFunction = this._drawBall19;
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
    this._element?.setAttribute("transform", `rotate(${(180 * rotation) / Math.PI},${cx},${cy})`);
  }

  _basicDot(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "circle");
        this._element.setAttribute("cx", String(x + size / 2));
        this._element.setAttribute("cy", String(y + size / 2));
        this._element.setAttribute("r", String(size / 2));
      }
    });
  }

  _basicSquare(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "rect");
        this._element.setAttribute("x", String(x));
        this._element.setAttribute("y", String(y));
        this._element.setAttribute("width", String(size));
        this._element.setAttribute("height", String(size));
      }
    });
  }

  _basicBall1(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");

        const cornerRadius = size / 5; // Adjust radius as needed

        // Define path data for a square with three rounded corners
        /*const pathData = `M ${x + cornerRadius},${y} 
          H ${x + size - cornerRadius} 
          A ${cornerRadius} ${cornerRadius} 0 0 1 ${x + size},${y + cornerRadius} 
          V ${y + size - cornerRadius} 
          A ${cornerRadius} ${cornerRadius} 0 0 1 ${x + size - cornerRadius},${y + size} 
          H ${x + cornerRadius} 
          A ${cornerRadius} ${cornerRadius} 0 0 1 ${x},${y + size - cornerRadius} 
          V ${y} Z`;*/

          const pathData = `M ${x + cornerRadius},${y} 
          H ${x + size - cornerRadius} 
          A ${cornerRadius} ${cornerRadius} 0 0 1 ${x + size},${y + cornerRadius} 
          V ${y + size - cornerRadius} 
          A ${cornerRadius} ${cornerRadius} 1 1 1 ${x + size - cornerRadius},${y + size} 
          H ${x + cornerRadius} 
          A ${cornerRadius} ${cornerRadius} 0 0 1 ${x},${y + size - cornerRadius} 
          V ${y + cornerRadius} 
          A ${cornerRadius} ${cornerRadius} 0 0 1 ${x + cornerRadius},${y} Z`;

        this._element.setAttribute("d", pathData);
        this._element.setAttribute("fill", "black"); // Adjust fill color as needed
      }
    });
  }

  _basicBall2(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");
        const cornerRadius = size / 5;
        const pathData = `M ${x + cornerRadius},${y} 
          H ${x + size - cornerRadius} 
          A ${cornerRadius} ${cornerRadius} 0 0 1 ${x + size},${y + cornerRadius} 
          V ${y + size - cornerRadius} 
          A ${cornerRadius} ${cornerRadius} 1 1 1 ${x + size - cornerRadius},${y + size} 
          H ${x + cornerRadius} 
          A ${cornerRadius} ${cornerRadius} 0 0 1 ${x},${y + size - cornerRadius} 
          V ${y + cornerRadius} 
          A ${cornerRadius} ${cornerRadius} 1 1 1 ${x + cornerRadius},${y} Z`;

        this._element.setAttribute("d", pathData);
        this._element.setAttribute("fill", "black");
      }
    });
  }

  _basicBall3(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");
        const cornerRadius = size / 5;
        const pathData = `M ${x + cornerRadius},${y} 
          H ${x + size - cornerRadius} 
          A ${cornerRadius} ${cornerRadius} 1 1 1 ${x + size},${y + cornerRadius} 
          V ${y + size - cornerRadius} 
          A ${cornerRadius} ${cornerRadius} 1 1 1 ${x + size - cornerRadius},${y + size} 
          H ${x + cornerRadius} 
          A ${cornerRadius} ${cornerRadius} 1 1 1 ${x},${y + size - cornerRadius} 
          V ${y + cornerRadius} 
          A ${cornerRadius} ${cornerRadius} 0 0 1 ${x + cornerRadius},${y} Z`;

        this._element.setAttribute("d", pathData);
        this._element.setAttribute("fill", "black");
      }
    });
  }

  _basicBall5(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
  
    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");  
        const circleRadius = size / 6;
        const spacing = size / 3;
  
        let pathData = "";
  
        for (let row = 0; row < 3; row++) {
          for (let col = 0; col < 3; col++) {
            const cx = x + col * spacing + circleRadius;
            const cy = y + row * spacing + circleRadius;
            const startX = cx - circleRadius;
            const startY = cy;
            const sweepFlag = 1;
            pathData += `M${startX},${startY} `;
            pathData += `A${circleRadius},${circleRadius} 0 0,${sweepFlag} ${cx + circleRadius},${cy} `;
            pathData += `A${circleRadius},${circleRadius} 0 0,${sweepFlag} ${startX},${startY} `;
          }
        }
        this._element.setAttribute("d", pathData);
        this._element.setAttribute("fill", "black");
      }
    });
  }

  _basicBall15(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const curveDepth = size / 10; // Depth of the inward curve
    const halfSize = size / 2;

    this._rotateFigure({
        ...args,
        draw: () => {
            const topLeftX = x;
            const topLeftY = y;

            // Create a path element to represent the square
            this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");

            // Define the path data for a square with inward-curved sides
            const pathData = `
                M${topLeftX + curveDepth},${topLeftY} 
                C${topLeftX + halfSize},${topLeftY - curveDepth} ${topLeftX + halfSize},${topLeftY - curveDepth} ${topLeftX + size - curveDepth},${topLeftY} 
                
                L${topLeftX + size},${topLeftY + curveDepth} 
                C${topLeftX + size + curveDepth},${topLeftY + halfSize} ${topLeftX + size + curveDepth},${topLeftY + halfSize} ${topLeftX + size},${topLeftY + size - curveDepth} 
                
                L${topLeftX + size - curveDepth},${topLeftY + size} 
                C${topLeftX + halfSize},${topLeftY + size + curveDepth} ${topLeftX + halfSize},${topLeftY + size + curveDepth} ${topLeftX + curveDepth},${topLeftY + size} 
                
                L${topLeftX},${topLeftY + size - curveDepth} 
                C${topLeftX - curveDepth},${topLeftY + halfSize} ${topLeftX - curveDepth},${topLeftY + halfSize} ${topLeftX},${topLeftY + curveDepth} 
                
                Z
            `;

            // Set the path data
            this._element.setAttribute("d", pathData.trim());
        }
    });
  }
  
  _basicBall18(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const halfSize = size / 2;
    const inset = size / 4.2;
    const angle = 41.62;
    const centerX = x + halfSize;
    const centerY = y + halfSize;

    const rotatePoint = (px: number, py: number, cx: number, cy: number, angle: number) => {
        const cosAngle = Math.cos(angle);
        const sinAngle = Math.sin(angle);
        const dx = px - cx;
        const dy = py - cy;

        const newX = cosAngle * dx - sinAngle * dy + cx;
        const newY = sinAngle * dx + cosAngle * dy + cy;

        return { x: newX, y: newY };
    };

    const points = [
        { x: centerX, y: centerY - halfSize },
        { x: centerX + inset, y: centerY - inset },
        { x: centerX + halfSize, y: centerY }, 
        { x: centerX + inset, y: centerY + inset },
        { x: centerX, y: centerY + halfSize },   
        { x: centerX - inset, y: centerY + inset }, 
        { x: centerX - halfSize, y: centerY },    
        { x: centerX - inset, y: centerY - inset },
    ];

    const rotatedPoints = points.map((point) => rotatePoint(point.x, point.y, centerX, centerY, angle));

    const pathData = `
        M${rotatedPoints[0].x},${rotatedPoints[0].y} 
        L${rotatedPoints[1].x},${rotatedPoints[1].y} 
        L${rotatedPoints[2].x},${rotatedPoints[2].y} 
        L${rotatedPoints[3].x},${rotatedPoints[3].y} 
        L${rotatedPoints[4].x},${rotatedPoints[4].y} 
        L${rotatedPoints[5].x},${rotatedPoints[5].y} 
        L${rotatedPoints[6].x},${rotatedPoints[6].y} 
        L${rotatedPoints[7].x},${rotatedPoints[7].y} 
        Z
    `;

    // Create the path element
    this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");
    this._element.setAttribute("d", pathData.trim());
    this._element.setAttribute("fill", "none");
    this._element.setAttribute("stroke", "black");
    this._element.setAttribute("stroke-width", "2");
  }
  
  _basicBall19(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;

    this._rotateFigure({
        ...args,
        draw: () => {
            this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");

            const squareSize = size / 4;
            const spacing = size / 3;
            const squareSizeBig = size / 1.8;

            let pathData = "";

            const drawRotatedSquare = (cx: number, cy: number, rotation: number) => {
                const halfSize = squareSize / 2.5;
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

            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    const squareX = x + col * spacing;
                    const squareY = y + row * spacing;

                    if (row === 1 && col === 1) {
                        const centerOffset = (squareSizeBig - squareSize) / 2;
                        const centeredX = squareX - centerOffset;
                        const centeredY = squareY - centerOffset;

                        pathData += `M${centeredX},${centeredY} `;
                        pathData += `h${squareSizeBig} `;
                        pathData += `v${squareSizeBig} `;
                        pathData += `h-${squareSizeBig} `;
                        pathData += `v-${squareSizeBig} `;
                    } else {
                        const rotationAngle = Math.random() * 360 - 180;
                        pathData += drawRotatedSquare(squareX + squareSize / 2, squareY + squareSize / 2, rotationAngle);
                    }
                }
            }

            this._element.setAttribute("d", pathData);
            this._element.setAttribute("fill", "none");
            this._element.setAttribute("stroke", "black");
            this._element.setAttribute("stroke-width", "2");
        }
    });
  }

  _drawDot({ x, y, size, rotation }: DrawArgs): void {
    this._basicDot({ x, y, size, rotation });
  }

  _drawSquare({ x, y, size, rotation }: DrawArgs): void {
    this._basicSquare({ x, y, size, rotation });
  }

  _drawBall1({ x, y, size, rotation }: DrawArgs): void {
    this._basicBall1({ x, y, size, rotation });
  }

  _drawBall2({ x, y, size, rotation }: DrawArgs): void {
    this._basicBall2({ x, y, size, rotation });
  }

  _drawBall3({ x, y, size, rotation }: DrawArgs): void {
    this._basicBall3({ x, y, size, rotation });
  }

  _drawBall5({ x, y, size, rotation }: DrawArgs): void {
    this._basicBall5({ x, y, size, rotation });
  }

  _drawBall15({ x, y, size, rotation }: DrawArgs): void {
    this._basicBall15({ x, y, size, rotation });
  }

  _drawBall18({ x, y, size, rotation }: DrawArgs): void {
    this._basicBall18({ x, y, size, rotation });
  }

  _drawBall19({ x, y, size, rotation }: DrawArgs): void {
    this._basicBall19({ x, y, size, rotation });
  }
}
