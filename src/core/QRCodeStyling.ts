import getMode from "../tools/getMode";
import mergeDeep from "../tools/merge";
import downloadURI from "../tools/downloadURI";
import QRCanvas from "./QRCanvas";
import defaultOptions, { Options, RequiredOptions } from "./QROptions";
import sanitizeOptions from "../tools/sanitizeOptions";
import { Extension, QRCode } from "../types";
import qrcode from "qrcode-generator";

type DownloadOptions = {
  name?: string;
  extension?: Extension;
  buffer?: boolean;
  skipDownload?: boolean;
};

export default class QRCodeStyling {
  _options: RequiredOptions;
  _container?: HTMLElement;
  _canvas?: QRCanvas;
  _qr?: QRCode;
  _drawingPromise?: Promise<void>;

  constructor(options?: Partial<Options>) {
    this._options = options ? sanitizeOptions(mergeDeep(defaultOptions, options) as RequiredOptions) : defaultOptions;
    this.update();
  }

  static _clearContainer(container?: HTMLElement): void {
    if (container) {
      container.innerHTML = "";
    }
  }

  update(options?: Partial<Options>): void {
    QRCodeStyling._clearContainer(this._container);
    this._options = options ? sanitizeOptions(mergeDeep(this._options, options) as RequiredOptions) : this._options;

    if (!this._options.data) {
      return;
    }

    this._qr = qrcode(this._options.qrOptions.typeNumber, this._options.qrOptions.errorCorrectionLevel);
    this._qr.addData(this._options.data, this._options.qrOptions.mode || getMode(this._options.data));
    this._qr.make();
    this._canvas = new QRCanvas(this._options);
    this._drawingPromise = this._canvas.drawQR(this._qr);
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

  download(downloadOptions?: Partial<DownloadOptions> | string): Promise<string | Buffer> {
    return new Promise((resolve, reject) => {
      let buffer = false;
      if (typeof downloadOptions === "object" && downloadOptions?.buffer) {
        buffer = downloadOptions.buffer;
      }
      if (!this._drawingPromise) return resolve(buffer ? Buffer.from([]) : "");

      this._drawingPromise
        .then(() => {
          if (!this._canvas) return resolve(buffer ? Buffer.from([]) : "");

          let extension = "png";
          let name = "qr";
          let skipDownload = false;

          //TODO remove deprecated code in the v2
          if (typeof downloadOptions === "string") {
            extension = downloadOptions;
            console.warn(
              "Extension is deprecated as argument for 'download' method, please pass object { name: '...', extension: '...' } as argument"
            );
          } else if (typeof downloadOptions === "object" && downloadOptions !== null) {
            if (downloadOptions.name) {
              name = downloadOptions.name;
            }
            if (downloadOptions.extension) {
              extension = downloadOptions.extension;
            }
            if (downloadOptions.skipDownload) {
              skipDownload = downloadOptions.skipDownload;
            }
          }
          if (!this._options.nodeCanvas) {
            skipDownload = true;
          }

          let data;
          if (this._options.nodeCanvas && buffer) {
            data = this._canvas.getCanvas().toBuffer?.(`image/${extension}`) ?? Buffer.from([]);
          } else {
            data = this._canvas.getCanvas().toDataURL(`image/${extension}`);
            if (!skipDownload) downloadURI(data, `${name}.${extension}`);
          }
          resolve(data);
        })
        .catch(reject);
    });
  }
}
