export type DrawFunctionArgs = {
  x: number;
  y: number;
  size: number;
  context: CanvasRenderingContext2D;
};
type DrawCornerRotation = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export const drawSquare = function({ x, y, size, context }: DrawFunctionArgs): void {
  context.fillRect(x, y, size, size);
};

export const drawCircle = function({ x, y, size, context }: DrawFunctionArgs, circleRadiusDivisor = 2): void {
  context.beginPath();
  context.arc(x + size / 2, y + size / 2, size / circleRadiusDivisor, 0, Math.PI * 2);
  context.fill();
};

export const drawLine = function(
  context: CanvasRenderingContext2D,
  xFrom: number,
  yFrom: number,
  xTo: number,
  yTo: number
): void {
  context.beginPath();
  context.moveTo(xFrom, yFrom);
  context.lineTo(xTo, yTo);
  context.stroke();
};

export const drawArcCorner = function(
  { x, y, size, context }: DrawFunctionArgs,
  cornerRotation: DrawCornerRotation
): void {
  context.beginPath();

  switch (cornerRotation) {
    case "top-left":
    default:
      context.arc(x + size * 2, y + size * 2, size + size / 2, -Math.PI, -Math.PI / 2);
      break;
    case "top-right":
      context.arc(x, y + size * 2, size + size / 2, -Math.PI / 2, 0);
      break;
    case "bottom-left":
      context.arc(x + size * 2, y, size + size / 2, Math.PI / 2, Math.PI);
      break;
    case "bottom-right":
      context.arc(x, y, size + size / 2, 0, Math.PI / 2);
      break;
  }
  context.stroke();
};
