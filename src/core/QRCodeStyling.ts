import mergeDeep from "../tools/merge";
import downloadURI from "../tools/downloadURI";
import QRCanvas from "./QRCanvas";
import defaultOptions, { Options } from "./QROptions";
import { QRCode } from "qrcode-generator-ts";

export default class QRCodeStyling {
  _options: Options;
  _container?: HTMLElement;
  _canvas?: QRCanvas;
  _qr?: QRCode;

  constructor(options?: Partial<Options>) {
    this._options = options ? (mergeDeep(defaultOptions, options) as Options) : defaultOptions;
    this.update();
  }

  static _clearContainer(container?: HTMLElement): void {
    if (container) {
      container.innerHTML = "";
    }
  }

  update(options?: Partial<Options>): void {
    QRCodeStyling._clearContainer(this._container);
    this._options = options ? (mergeDeep(this._options, options) as Options) : this._options;

    if (!this._options.data) {
      return;
    }

    this._qr = new QRCode();
    this._qr.setTypeNumber(this._options.qrOptions.typeNumber);
    this._qr.setErrorCorrectLevel(this._options.qrOptions.errorCorrectionLevel);
    this._qr.addData(this._options.data);
    this._qr.make();
    this._canvas = new QRCanvas(this._options);
    this._canvas.drawQR(this._qr);
    this.append(this._container);
  }

  append(container?: HTMLElement): void {
    if (!container) {
      return;
    }

    if (typeof container.appendChild !== "function") {
      throw "Container should be a single DOM node";
    }

    if (this._canvas) {
      container.appendChild(this._canvas.getCanvas());
    }

    this._container = container;
  }

  download(extension?: Extension): void {
    if (!this._canvas) return;
    const data = this._canvas.getCanvas().toDataURL(extension ? `image/${extension}` : undefined);
    downloadURI(data, `qr.${extension || "png"}`);
  }

  getQRCanvas(): QRCanvas | undefined {
    return this._canvas;
  }
}
