import { DotType, GetNeighbor, RotateFigureArgsCanvas, BasicFigureDrawArgsCanvas, DrawArgsCanvas } from "../../../types";
export default class QRDot {
    _context: CanvasRenderingContext2D;
    _type: DotType;
    constructor({ context, type }: {
        context: CanvasRenderingContext2D;
        type: DotType;
    });
    draw(x: number, y: number, size: number, getNeighbor: GetNeighbor): void;
    _rotateFigure({ x, y, size, context, rotation, draw }: RotateFigureArgsCanvas): void;
    _basicDot(args: BasicFigureDrawArgsCanvas): void;
    _basicSquare(args: BasicFigureDrawArgsCanvas): void;
    _basicSideRounded(args: BasicFigureDrawArgsCanvas): void;
    _basicCornerRounded(args: BasicFigureDrawArgsCanvas): void;
    _basicCornerExtraRounded(args: BasicFigureDrawArgsCanvas): void;
    _basicCornersRounded(args: BasicFigureDrawArgsCanvas): void;
    _basicCornersExtraRounded(args: BasicFigureDrawArgsCanvas): void;
    _drawDot({ x, y, size, context }: DrawArgsCanvas): void;
    _drawSquare({ x, y, size, context }: DrawArgsCanvas): void;
    _drawRounded({ x, y, size, context, getNeighbor }: DrawArgsCanvas): void;
    _drawExtraRounded({ x, y, size, context, getNeighbor }: DrawArgsCanvas): void;
    _drawClassy({ x, y, size, context, getNeighbor }: DrawArgsCanvas): void;
    _drawClassyRounded({ x, y, size, context, getNeighbor }: DrawArgsCanvas): void;
}
