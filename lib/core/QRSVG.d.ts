import { RequiredOptions } from "./QROptions";
import { QRCode, FilterFunction, Gradient } from "../types";
export default class QRSVG {
    _element: SVGElement;
    _style: SVGStyleElement;
    _defs: SVGElement;
    _dotsClipPath?: SVGElement;
    _cornersSquareClipPath?: SVGElement;
    _cornersDotClipPath?: SVGElement;
    _dots?: SVGElement;
    _cornerSquares?: SVGElement;
    _corners?: SVGElement;
    _cornerDots?: SVGElement;
    _options: RequiredOptions;
    _qr?: QRCode;
    _image?: HTMLImageElement;
    constructor(options: RequiredOptions);
    get width(): number;
    get height(): number;
    getElement(): SVGElement;
    clear(): void;
    drawQR(qr: QRCode): Promise<void>;
    drawBackground(): void;
    drawDots(filter?: FilterFunction): void;
    drawCorners(): void;
    loadImage(): Promise<void>;
    drawImage({ width, height, count, dotSize }: {
        width: number;
        height: number;
        count: number;
        dotSize: number;
    }): Promise<void>;
    _getImageBlob(url: string): Promise<Blob>;
    _blobToBase64(blob: Blob): Promise<string>;
    _getBase64Image(url: string): Promise<string>;
    _createColor({ options, color, additionalRotation, x, y, height, width, name }: {
        options?: Gradient;
        color?: string;
        additionalRotation: number;
        x: number;
        y: number;
        height: number;
        width: number;
        name: string;
    }): void;
    _createStyle({ color, name }: {
        color?: string;
        name: string;
    }): void;
}
