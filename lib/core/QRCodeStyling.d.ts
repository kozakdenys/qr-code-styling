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
    _getQRStylingElement(extension: "svg"): Promise<QRSVG>;
    _getQRStylingElement(extension: Omit<Extension, "svg">): Promise<QRCanvas>;
    update(options?: Partial<Options>): void;
    append(container?: HTMLElement): void;
    getRawData(extension?: Extension, quality?: number): Promise<Blob | null>;
    /**
     *
     * @param extension file format of the returned image
     * @param quality [0-1] with 1 being the highest quality
     * @returns
     */
    toDataUrl(extension?: Omit<Extension, "svg">, quality?: number): Promise<string>;
    download(downloadOptions?: Partial<DownloadOptions>): Promise<void>;
}
