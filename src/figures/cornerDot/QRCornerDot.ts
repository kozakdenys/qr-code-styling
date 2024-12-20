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
      case cornerDotTypes.ball15:
        drawFunction = this._drawBall15;
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

  _basicBall15(args: BasicFigureDrawArgs): void {
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

  _drawBall15({ x, y, size, rotation }: DrawArgs): void {
    this._basicBall15({ x, y, size, rotation });
  }
}
