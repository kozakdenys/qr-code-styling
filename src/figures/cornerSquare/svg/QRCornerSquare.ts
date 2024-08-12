import cornerSquareTypes from "../../../constants/cornerSquareTypes";
import {
  CornerSquareType,
  DrawArgs,
  BasicFigureDrawArgs,
  RotateFigureArgs,
} from "../../../types";

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
      case cornerSquareTypes.dottedSquare:
        drawFunction = this._drawDottedSquare;
        break;
      case cornerSquareTypes.rightBottomSquare:
        drawFunction = this._drawRoundedSquareRightBottomEdge;
        break;
      case cornerSquareTypes.leftTopSquare:
        drawFunction = this._drawRoundedSquareLeftTopEdge;
        break;
      case cornerSquareTypes.leftTopCircle:
        drawFunction = this._drawCircleLeftTopFlat;
        break;
      case cornerSquareTypes.rightBottomCircle:
        drawFunction = this._drawCircleRightBottomFlat;
        break;
      case cornerSquareTypes.peanut:
        drawFunction = this._drawPeanutShape;
        break;
      case cornerSquareTypes.circleInSquare:
        drawFunction = this._drawCircleInSquare;
        break;
      // case cornerSquareTypes.paragonal:
      //   drawFunction = this._drawParagonalShape;
      //   break;
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
    this._element?.setAttribute(
      "transform",
      `rotate(${(180 * rotation) / Math.PI},${cx},${cy})`
    );
  }

  _basicDot(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const dotSize = size / 7;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
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
      },
    });
  }

  _basicSquare(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const dotSize = size / 7;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
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
      },
    });
  }

  _basicExtraRounded(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const dotSize = size / 7;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        this._element.setAttribute("clip-rule", "evenodd");
        this._element.setAttribute(
          "d",
          `M ${x} ${y + 2.5 * dotSize}` +
            `v ${2 * dotSize}` +
            `a ${2.5 * dotSize} ${2.5 * dotSize}, 0, 0, 0, ${dotSize * 2.5} ${
              dotSize * 2.5
            }` +
            `h ${2 * dotSize}` +
            `a ${2.5 * dotSize} ${2.5 * dotSize}, 0, 0, 0, ${dotSize * 2.5} ${
              -dotSize * 2.5
            }` +
            `v ${-2 * dotSize}` +
            `a ${2.5 * dotSize} ${2.5 * dotSize}, 0, 0, 0, ${-dotSize * 2.5} ${
              -dotSize * 2.5
            }` +
            `h ${-2 * dotSize}` +
            `a ${2.5 * dotSize} ${2.5 * dotSize}, 0, 0, 0, ${-dotSize * 2.5} ${
              dotSize * 2.5
            }` +
            `M ${x + 2.5 * dotSize} ${y + dotSize}` +
            `h ${2 * dotSize}` +
            `a ${1.5 * dotSize} ${1.5 * dotSize}, 0, 0, 1, ${dotSize * 1.5} ${
              dotSize * 1.5
            }` +
            `v ${2 * dotSize}` +
            `a ${1.5 * dotSize} ${1.5 * dotSize}, 0, 0, 1, ${-dotSize * 1.5} ${
              dotSize * 1.5
            }` +
            `h ${-2 * dotSize}` +
            `a ${1.5 * dotSize} ${1.5 * dotSize}, 0, 0, 1, ${-dotSize * 1.5} ${
              -dotSize * 1.5
            }` +
            `v ${-2 * dotSize}` +
            `a ${1.5 * dotSize} ${1.5 * dotSize}, 0, 0, 1, ${dotSize * 1.5} ${
              -dotSize * 1.5
            }`
        );
      },
    });
  }

  _basicDottedSquare(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const squareSize = size / 7;
    const gap = squareSize * 1.2;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        this._element.setAttribute("clip-rule", "evenodd");
        this._element.setAttribute("fill", "#000"); // Add this line to fill the squares

        let pathData = "";
        // Top edge
        for (let i = 0; i <= size - squareSize; i += gap) {
          pathData += `M ${
            x + i
          } ${y} h ${squareSize} v ${squareSize} h -${squareSize} z `;
        }
        // Right edge
        for (let i = 0; i <= size - squareSize; i += gap) {
          pathData += `M ${x + size - squareSize} ${
            y + i
          } h ${squareSize} v ${squareSize} h -${squareSize} z `;
        }
        // Bottom edge
        for (let i = 0; i <= size - squareSize; i += gap) {
          pathData += `M ${x + size - i - squareSize} ${
            y + size - squareSize
          } h ${squareSize} v ${squareSize} h -${squareSize} z `;
        }
        // Left edge
        for (let i = 0; i <= size - squareSize; i += gap) {
          pathData += `M ${x} ${
            y + size - i - squareSize
          } h ${squareSize} v ${squareSize} h -${squareSize} z `;
        }
        // Top-left corner
        pathData += `M ${x} ${y} h ${squareSize} v ${squareSize} h -${squareSize} z `;
        // Top-right corner
        pathData += `M ${
          x + size - squareSize
        } ${y} h ${squareSize} v ${squareSize} h -${squareSize} z `;
        // Bottom-right corner
        pathData += `M ${x + size - squareSize} ${
          y + size - squareSize
        } h ${squareSize} v ${squareSize} h -${squareSize} z `;
        // Bottom-left corner
        pathData += `M ${x} ${
          y + size - squareSize
        } h ${squareSize} v ${squareSize} h -${squareSize} z `;

        this._element.setAttribute("d", pathData);
      },
    });
  }

  _basicRoundedSquareRightBottomEdge(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const radius = size / 4; // Adjust this value to control the rounding radius
    const innerSquareSize = size / 1.4; // Size of the inner square
    const innerSquareRadius = innerSquareSize / 4; // Radius for the inner square
    const innerX = x + (size - innerSquareSize) / 2; // X position for the inner square
    const innerY = y + (size - innerSquareSize) / 2; // Y position for the inner square

    this._rotateFigure({
      ...args,
      draw: () => {
        // Create the main shape path
        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        path.setAttribute("clip-rule", "evenodd");
        path.setAttribute(
          "d",
          `M ${x + radius} ${y}` + // Start at the top-left rounded corner
            `H ${x + size - radius}` + // Draw a horizontal line to the right
            `a ${radius} ${radius} 0 0 1 ${radius} ${radius}` + // Draw the top-right arc
            `V ${y + size - radius}` + // Draw a vertical line down to the bottom-right flat edge
            `H ${x + size}` + // Move to the bottom-right flat edge
            `V ${y + size}` + // Draw a vertical line down to the bottom
            `H ${x + radius}` + // Draw a horizontal line to the left
            `a ${radius} ${radius} 0 0 1 -${radius} -${radius}` + // Draw the bottom-left arc
            `V ${y + radius}` + // Draw a vertical line up to the starting point
            `a ${radius} ${radius} 0 0 1 ${radius} -${radius}` + // Draw the top-left arc
            `Z` // Close the path
        );
        path.setAttribute("fill", "white"); // Set fill to white
        path.setAttribute("stroke", "black"); // Set the stroke color
        path.setAttribute("stroke-width", "1"); // Set the stroke width
        this._element = path;

        // Create the inner square path
        const innerPath = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        innerPath.setAttribute("clip-rule", "evenodd");
        innerPath.setAttribute(
          "d",
          `M ${innerX + innerSquareRadius} ${innerY}` + // Start at the top-left rounded corner
            `H ${innerX + innerSquareSize - innerSquareRadius}` + // Draw a horizontal line to the right
            `a ${innerSquareRadius} ${innerSquareRadius} 0 0 1 ${innerSquareRadius} ${innerSquareRadius}` + // Draw the top-right arc
            `V ${innerY + innerSquareSize - innerSquareRadius}` + // Draw a vertical line down to the bottom-right flat edge
            `H ${innerX + innerSquareSize}` + // Move to the bottom-right flat edge
            `V ${innerY + innerSquareSize}` + // Draw a vertical line down to the bottom
            `H ${innerX + innerSquareRadius}` + // Draw a horizontal line to the left
            `a ${innerSquareRadius} ${innerSquareRadius} 0 0 1 -${innerSquareRadius} -${innerSquareRadius}` + // Draw the bottom-left arc
            `V ${innerY + innerSquareRadius}` + // Draw a vertical line up to the starting point
            `a ${innerSquareRadius} ${innerSquareRadius} 0 0 1 ${innerSquareRadius} -${innerSquareRadius}` + // Draw the top-left arc
            `Z` // Close the path
        );
        innerPath.setAttribute("fill", "white"); // Set fill to white for the inner square
        innerPath.setAttribute("stroke", "black"); // Set the stroke color
        innerPath.setAttribute("stroke-width", "1"); // Set the stroke width

        // Append the elements to the SVG container
        const svgContainer = document.querySelector("svg"); // Adjust this selector to match your SVG container
        if (svgContainer) {
          svgContainer.appendChild(this._element);
          svgContainer.appendChild(innerPath);
        }
      },
    });
  }

  _basicRoundedSquareLeftTopEdge(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const radius = size / 4; // Adjust this value to control the rounding radius
    const innerSquareSize = size / 1.4; // Size of the inner square
    const innerSquareRadius = innerSquareSize / 4; // Radius for the inner square
    const innerX = x + (size - innerSquareSize) / 2; // X position for the inner square
    const innerY = y + (size - innerSquareSize) / 2; // Y position for the inner square

    this._rotateFigure({
      ...args,
      draw: () => {
        // Create the main shape path
        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        path.setAttribute("clip-rule", "evenodd");
        path.setAttribute(
          "d",
          `M ${x + radius} ${y}` + // Start at the top-left flat edge
            `H ${x + size - radius}` + // Draw a horizontal line to the right
            `a ${radius} ${radius} 0 0 1 ${radius} ${radius}` + // Draw the top-right arc
            `V ${y + size - radius}` + // Draw a vertical line down to the bottom-right
            `a ${radius} ${radius} 0 0 1 -${radius} ${radius}` + // Draw the bottom-right arc
            `H ${x + radius}` + // Draw a horizontal line to the left
            `a ${radius} ${radius} 0 0 1 -${radius} -${radius}` + // Draw the bottom-left arc
            `V ${y + radius}` + // Draw a vertical line up to the starting point
            `H ${x}` + // Draw a horizontal line to the left to the starting point
            `V ${y}` + // Move up to the top to ensure the flat corner is complete
            `Z` // Close the path
        );
        path.setAttribute("fill", "white"); // Set fill to white
        path.setAttribute("stroke", "black"); // Set the stroke color
        path.setAttribute("stroke-width", "1"); // Set the stroke width
        this._element = path;

        // Create the inner square path
        const innerPath = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        innerPath.setAttribute("clip-rule", "evenodd");
        innerPath.setAttribute(
          "d",
          `M ${innerX + innerSquareRadius} ${innerY}` + // Start at the top-left flat edge
            `H ${innerX + innerSquareSize - innerSquareRadius}` + // Draw a horizontal line to the right
            `a ${innerSquareRadius} ${innerSquareRadius} 0 0 1 ${innerSquareRadius} ${innerSquareRadius}` + // Draw the top-right arc
            `V ${innerY + innerSquareSize - innerSquareRadius}` + // Draw a vertical line down to the bottom-right
            `a ${innerSquareRadius} ${innerSquareRadius} 0 0 1 -${innerSquareRadius} ${innerSquareRadius}` + // Draw the bottom-right arc
            `H ${innerX + innerSquareRadius}` + // Draw a horizontal line to the left
            `a ${innerSquareRadius} ${innerSquareRadius} 0 0 1 -${innerSquareRadius} -${innerSquareRadius}` + // Draw the bottom-left arc
            `V ${innerY + innerSquareRadius}` + // Draw a vertical line up to the starting point
            `H ${innerX}` + // Draw a horizontal line to the left to the starting point
            `V ${innerY}` + // Move up to the top to ensure the flat corner is complete
            `Z` // Close the path
        );
        innerPath.setAttribute("fill", "white"); // Set fill to white for the inner square
        innerPath.setAttribute("stroke", "black"); // Set the stroke color
        innerPath.setAttribute("stroke-width", "1"); // Set the stroke width

        // Append the elements to the SVG container
        const svgContainer = document.querySelector("svg"); // Adjust this selector to match your SVG container
        if (svgContainer) {
          svgContainer.appendChild(this._element);
          svgContainer.appendChild(innerPath);
        }
      },
    });
  }

  _basicCircleInSquare(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const borderWidth = size / 7; // Adjust the border width as needed
    const circleRadius = size / 2 - borderWidth / 2;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        this._element.setAttribute("fill", "none");
        this._element.setAttribute(
          "d",
          `M ${x} ${y}` +
            `h ${size}` +
            `v ${size}` +
            `h ${-size}` +
            `z` + // Outer square border
            `M ${x + size / 2}, ${y + size / 2}` +
            `m -${circleRadius}, 0` +
            `a ${circleRadius},${circleRadius} 0 1,0 ${2 * circleRadius},0` +
            `a ${circleRadius},${circleRadius} 0 1,0 -${2 * circleRadius},0` // Circle in the center
        );
      },
    });
  }

  _basicLeftTopCircle(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const radius = size / 2;
    const flatEdgeLength = size / 16; // Adjust this value as needed to control the length of the flat edge
    const smallDotRadius = radius / 1.4; // Adjust this value to control the size of the small dot

    this._rotateFigure({
      ...args,
      draw: () => {
        // Create the main shape path
        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        path.setAttribute("clip-rule", "evenodd");
        path.setAttribute(
          "d",
          `M ${x + flatEdgeLength} ${y}` + // Start at the top-left flat edge
            `H ${x + size - radius}` + // Draw a horizontal line to the right
            `a ${radius} ${radius} 0 0 1 ${radius} ${radius}` + // Draw the top-right arc
            `V ${y + size - radius}` + // Draw a vertical line down to the bottom-right
            `a ${radius} ${radius} 0 0 1 -${radius} ${radius}` + // Draw the bottom-right arc
            `H ${x + radius}` + // Draw a horizontal line to the left
            `a ${radius} ${radius} 0 0 1 -${radius} -${radius}` + // Draw the bottom-left arc
            `V ${y + flatEdgeLength}` + // Draw a vertical line up to the starting point to close the path
            `a ${radius} ${radius} 0 0 1 ${radius} -${radius}` + // Draw the top-left arc
            `Z` // Close the path
        );
        path.setAttribute("fill", "none"); // No fill
        path.setAttribute("stroke", "black"); // Set the stroke color
        path.setAttribute("stroke-width", "1"); // Set the stroke width
        this._element = path;

        // Create the white rounded dot with flat corner
        const smallDot = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle"
        );
        smallDot.setAttribute("cx", `${x + radius}`); // Center x
        smallDot.setAttribute("cy", `${y + radius}`); // Center y
        smallDot.setAttribute("r", `${smallDotRadius}`); // Radius of the white circle
        smallDot.setAttribute("fill", "white"); // White fill
        smallDot.setAttribute("stroke", "none"); // No stroke

        // Append both elements to the SVG container
        const svgContainer = document.querySelector("svg"); // Adjust this selector to match your SVG container
        if (svgContainer) {
          svgContainer.appendChild(this._element);
          svgContainer.appendChild(smallDot);
        }
      },
    });
  }

  _basicRightBottomCircle(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const radius = size / 2;
    const flatEdgeLength = size / 16; // Adjust this value as needed to control the length of the flat edge
    const smallDotRadius = radius / 1.4; // Adjust this value to control the size of the small dot

    this._rotateFigure({
      ...args,
      draw: () => {
        // Create the main shape path
        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        path.setAttribute("clip-rule", "evenodd");
        path.setAttribute(
          "d",
          `M ${x} ${y + radius}` + // Start at the top-left arc
            `a ${radius} ${radius} 0 0 1 ${radius} -${radius}` + // Draw the top-left arc
            `H ${x + size - radius}` + // Draw a horizontal line to the right
            `a ${radius} ${radius} 0 0 1 ${radius} ${radius}` + // Draw the top-right arc
            `V ${y + size - radius}` + // Draw a vertical line down to the bottom-right flat edge
            `H ${x + size - flatEdgeLength}` + // Draw a horizontal line to the left to the flat edge
            `V ${y + size}` + // Draw a vertical line down to the bottom
            `H ${x + radius}` + // Draw a horizontal line to the left
            `a ${radius} ${radius} 0 0 1 -${radius} -${radius}` + // Draw the bottom-left arc
            `Z` // Close the path
        );
        path.setAttribute("fill", "none"); // No fill
        path.setAttribute("stroke", "black"); // Set the stroke color
        path.setAttribute("stroke-width", "1"); // Set the stroke width
        this._element = path;

        // Create the white rounded dot with flat corner
        const smallDot = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle"
        );
        smallDot.setAttribute("cx", `${x + radius}`); // Center x
        smallDot.setAttribute("cy", `${y + radius}`); // Center y
        smallDot.setAttribute("r", `${smallDotRadius}`); // Radius of the white circle
        smallDot.setAttribute("fill", "white"); // White fill
        smallDot.setAttribute("stroke", "none"); // No stroke

        // Append both elements to the SVG container
        const svgContainer = document.querySelector("svg"); // Adjust this selector to match your SVG container
        if (svgContainer) {
          svgContainer.appendChild(this._element);
          svgContainer.appendChild(smallDot);
        }
      },
    });
  }

  _basicPeanutShape(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const radius = size / 3.7; // Adjust this value to control the rounding radius
    const innerSquareSize = size / 1.4; // Size of the inner square
    const innerSquareRadius = innerSquareSize / 3.7; // Radius for the inner square
    const innerX = x + (size - innerSquareSize) / 2; // X position for the inner square
    const innerY = y + (size - innerSquareSize) / 2; // Y position for the inner square

    this._rotateFigure({
      ...args,
      draw: () => {
        // Create the main shape path
        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        path.setAttribute("clip-rule", "evenodd");
        path.setAttribute(
          "d",
          `M ${x + radius} ${y}` + // Start at the top-left flat edge
            `H ${x + size - radius}` + // Draw a horizontal line to the right
            `a ${radius} ${radius} 0 0 1 ${radius} ${radius}` + // Draw the top-right arc
            `V ${y + size - radius}` + // Draw a vertical line down to the bottom-right flat edge
            `H ${x + size}` + // Move to the bottom-right flat edge
            `V ${y + size}` + // Draw a vertical line down to the bottom
            `H ${x + radius}` + // Draw a horizontal line to the left
            `a ${radius} ${radius} 0 0 1 -${radius} -${radius}` + // Draw the bottom-left arc
            `V ${y + radius}` + // Draw a vertical line up to the starting point
            `H ${x}` + // Move to the top-left flat edge
            `V ${y}` + // Draw a vertical line up to the top
            `Z` // Close the path
        );
        path.setAttribute("fill", "white"); // Set fill to white
        path.setAttribute("stroke", "black"); // Set the stroke color
        path.setAttribute("stroke-width", "1"); // Set the stroke width
        this._element = path;

        // Create the inner square path
        const innerPath = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        innerPath.setAttribute("clip-rule", "evenodd");
        innerPath.setAttribute(
          "d",
          `M ${innerX + innerSquareRadius} ${innerY}` + // Start at the top-left flat edge
            `H ${innerX + innerSquareSize - innerSquareRadius}` + // Draw a horizontal line to the right
            `a ${innerSquareRadius} ${innerSquareRadius} 0 0 1 ${innerSquareRadius} ${innerSquareRadius}` + // Draw the top-right arc
            `V ${innerY + innerSquareSize - innerSquareRadius}` + // Draw a vertical line down to the bottom-right flat edge
            `H ${innerX + innerSquareSize}` + // Move to the bottom-right flat edge
            `V ${innerY + innerSquareSize}` + // Draw a vertical line down to the bottom
            `H ${innerX + innerSquareRadius}` + // Draw a horizontal line to the left
            `a ${innerSquareRadius} ${innerSquareRadius} 0 0 1 -${innerSquareRadius} -${innerSquareRadius}` + // Draw the bottom-left arc
            `V ${innerY + innerSquareRadius}` + // Draw a vertical line up to the starting point
            `H ${innerX}` + // Move to the top-left flat edge
            `V ${innerY}` + // Draw a vertical line up to the top
            `Z` // Close the path
        );
        innerPath.setAttribute("fill", "white"); // Set fill to white for the inner square
        innerPath.setAttribute("stroke", "black"); // Set the stroke color
        innerPath.setAttribute("stroke-width", "1"); // Set the stroke width

        // Append the elements to the SVG container
        const svgContainer = document.querySelector("svg"); // Adjust this selector to match your SVG container
        if (svgContainer) {
          svgContainer.appendChild(this._element);
          svgContainer.appendChild(innerPath);
        }
      },
    });
  }

  // _basicParagonalShape(args: BasicFigureDrawArgs): void {
  //   const { size, x, y } = args;
  
  //   this._rotateFigure({
  //     ...args,
  //     draw: () => {
  //       const element = document.createElementNS("http://www.w3.org/2000/svg", "path");
  //       element.setAttribute("clip-rule", "evenodd");
  //       element.setAttribute(
  //         "d",
  //         `M ${x + size * 0.2} ${y}` + // Move to the top-left corner
  //         `L ${x + size * 0.8} ${y}` + // Draw line to top-right corner
  //         `L ${x + size * 0.9} ${y + size * 0.3}` + // Draw line to right-middle corner
  //         `L ${x + size * 0.7} ${y + size}` + // Draw line to bottom-right corner
  //         `L ${x + size * 0.3} ${y + size}` + // Draw line to bottom-left corner
  //         `L ${x + size * 0.1} ${y + size * 0.7}` + // Draw line to left-middle corner
  //         `Z` // Close the shape
  //       );
  //       element.setAttribute("fill", "black"); // Set fill color to black
  
  //       // Append the shape to the parent element
  //       args.parent.appendChild(element);
  //     },
  //   });
  // }
  
  

  _drawDot({ x, y, size, rotation }: DrawArgs): void {
    this._basicDot({ x, y, size, rotation });
  }

  _drawSquare({ x, y, size, rotation }: DrawArgs): void {
    this._basicSquare({ x, y, size, rotation });
  }

  _drawExtraRounded({ x, y, size, rotation }: DrawArgs): void {
    this._basicExtraRounded({ x, y, size, rotation });
  }

  _drawDottedSquare({ x, y, size, rotation }: DrawArgs): void {
    this._basicDottedSquare({ x, y, size, rotation });
  }

  _drawRoundedSquareRightBottomEdge({ x, y, size, rotation }: DrawArgs): void {
    this._basicRoundedSquareRightBottomEdge({ x, y, size, rotation });
  }

  _drawRoundedSquareLeftTopEdge({ x, y, size, rotation }: DrawArgs): void {
    this._basicRoundedSquareLeftTopEdge({ x, y, size, rotation });
  }

  _drawCircleInSquare({ x, y, size, rotation }: DrawArgs): void {
    this._basicCircleInSquare({ x, y, size, rotation });
  }

  _drawCircleLeftTopFlat({ x, y, size, rotation }: DrawArgs): void {
    this._basicLeftTopCircle({ x, y, size, rotation });
  }

  _drawCircleRightBottomFlat({ x, y, size, rotation }: DrawArgs): void {
    this._basicRightBottomCircle({ x, y, size, rotation });
  }
  _drawPeanutShape({ x, y, size, rotation }: DrawArgs): void {
    this._basicPeanutShape({ x, y, size, rotation });
  }
  // _drawParagonalShape({ x, y, size, rotation }: DrawArgs): void {
  //   this._basicParagonalShape({ x, y, size, rotation });
  // }
}
