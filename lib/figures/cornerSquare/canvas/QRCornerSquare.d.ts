import { CornerSquareType, RotateFigureArgsCanvas, BasicFigureDrawArgsCanvas, DrawArgsCanvas } from "../../../types";
export default class QRCornerSquare {
    _context: CanvasRenderingContext2D;
    _type: CornerSquareType;
    constructor({ context, type }: {
        context: CanvasRenderingContext2D;
        type: CornerSquareType;
    });
    draw(x: number, y: number, size: number, rotation: number): void;
    _rotateFigure({ x, y, size, context, rotation, draw }: RotateFigureArgsCanvas): void;
    _basicDot(args: BasicFigureDrawArgsCanvas): void;
    _basicSquare(args: BasicFigureDrawArgsCanvas): void;
    _basicExtraRounded(args: BasicFigureDrawArgsCanvas): void;
    _drawDot({ x, y, size, context, rotation }: DrawArgsCanvas): void;
    _drawSquare({ x, y, size, context, rotation }: DrawArgsCanvas): void;
    _drawExtraRounded({ x, y, size, context, rotation }: DrawArgsCanvas): void;
}
