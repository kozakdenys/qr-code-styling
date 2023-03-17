import QRCanvas from "./QRCanvas";
import QRSVG from "./QRSVG";
import { RequiredOptions } from "./QROptions";
import { Extension, QRCode, Options, DownloadOptions } from "../types";
export default class QRCodeStyling {
    _options: RequiredOptions;
    _container?: HTMLElement;
    _canvas?: QRCanvas;
    _svg?: QRSVG;
    _qr?: QRCode;
    _canvasDrawingPromise?: Promise<void>;
    _svgDrawingPromise?: Promise<void>;
    constructor(options?: Partial<Options>);
    static _clearContainer(container?: HTMLElement): void;
    _getQRStylingElement(extension?: Extension): Promise<QRCanvas | QRSVG>;
    update(options?: Partial<Options>): void;
    append(container?: HTMLElement): void;
    getRawData(extension?: Extension): Promise<Blob | null>;
    download(downloadOptions?: Partial<DownloadOptions> | string): Promise<void>;
}
