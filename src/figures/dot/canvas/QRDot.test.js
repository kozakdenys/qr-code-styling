import QRDot from "./QRDot";
import fs from "fs";
import path from "path";

describe("Test QRDot class", () => {
  const canvasSize = 100;
  let canvas, canvasContext;

  beforeAll(() => {
    canvas = global.document.createElement("canvas");
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    canvasContext = canvas.getContext("2d");
  });

  beforeEach(() => {
    canvasContext.fillStyle = "#fff";
    canvasContext.fillRect(0, 0, canvasSize, canvasSize);
    canvasContext.fillStyle = "#000";
    canvasContext.beginPath();
  });

  afterEach(() => {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  });

  it("Should draw simple square dot", () => {
    const dotSize = 50;
    const imgFile = fs.readFileSync(path.resolve(__dirname, "../../../assets/test/simple_square_dot.png"), "base64");
    const dot = new QRDot({ context: canvasContext, type: "square" });
    dot.draw(dotSize / 2, dotSize / 2, dotSize, () => false);
    canvasContext.fill("evenodd");

    expect(canvas.toDataURL()).toEqual(expect.stringContaining(imgFile));
  });

  it("Should draw simple dots", () => {
    const dotSize = 40;
    const imgFile = fs.readFileSync(path.resolve(__dirname, "../../../assets/test/simple_dots.png"), "base64");
    const dot = new QRDot({ context: canvasContext, type: "dots" });
    dot.draw(10, 30, dotSize, () => false);
    dot.draw(50, 30, dotSize, () => false);
    canvasContext.fill("evenodd");

    expect(canvas.toDataURL()).toEqual(expect.stringContaining(imgFile));
  });
  it("Should draw rounded dots", () => {
    const dotSize = 10;
    const matrix = [
      [1, 0, 1, 1, 0],
      [0, 0, 0, 0, 0],
      [1, 1, 0, 1, 1],
      [0, 1, 0, 1, 1],
      [0, 0, 1, 0, 0]
    ];
    const imgFile = fs.readFileSync(path.resolve(__dirname, "../../../assets/test/rounded_dots.png"), "base64");
    const dot = new QRDot({ context: canvasContext, type: "rounded" });

    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[y].length; x++) {
        if (!matrix[y][x]) {
          continue;
        }
        dot.draw(25 + x * dotSize, 25 + y * dotSize, dotSize, (xOffset, yOffset) => {
          if (matrix[y + yOffset]) {
            return !!matrix[y + yOffset][x + xOffset];
          } else {
            return false;
          }
        });
      }
    }
    canvasContext.fill("evenodd");

    expect(canvas.toDataURL()).toEqual(expect.stringContaining(imgFile));
  });
});
