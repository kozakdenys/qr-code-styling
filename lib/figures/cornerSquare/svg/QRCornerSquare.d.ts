import { CornerSquareType, DrawArgs, BasicFigureDrawArgs, RotateFigureArgs } from "../../../types";
export default class QRCornerSquare {
    _element?: SVGElement;
    _svg: SVGElement;
    _type: CornerSquareType;
    constructor({ svg, type }: {
        svg: SVGElement;
        type: CornerSquareType;
    });
    draw(x: number, y: number, size: number, rotation: number): void;
    _rotateFigure({ x, y, size, rotation, draw }: RotateFigureArgs): void;
    _basicDot(args: BasicFigureDrawArgs): void;
    _basicSquare(args: BasicFigureDrawArgs): void;
    _basicExtraRounded(args: BasicFigureDrawArgs): void;
    _drawDot({ x, y, size, rotation }: DrawArgs): void;
    _drawSquare({ x, y, size, rotation }: DrawArgs): void;
    _drawExtraRounded({ x, y, size, rotation }: DrawArgs): void;
}
