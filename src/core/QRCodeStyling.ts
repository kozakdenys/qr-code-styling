import getMode from "../tools/getMode";
import mergeDeep from "../tools/merge";
import downloadURI from "../tools/downloadURI";
import QRSVG from "./QRSVG";
import drawTypes from "../constants/drawTypes";

import defaultOptions, { RequiredOptions } from "./QROptions";
import sanitizeOptions from "../tools/sanitizeOptions";
import { FileExtension, QRCode, Options, DownloadOptions, ExtensionFunction, Window, Canvas } from "../types";
import qrcode from "qrcode-generator";

declare const window: Window;

export default class QRCodeStyling {
  _options: RequiredOptions;
  _window: Window;
  _container?: HTMLElement;
  _canvas?: Canvas;
  _svg?: SVGElement;
  _qr?: QRCode;
  _extension?: ExtensionFunction;
  _canvasDrawingPromise?: Promise<void>;
  _svgDrawingPromise?: Promise<void>;

  constructor(options?: Partial<Options>) {
    if (options?.jsdom) {
      this._window = new options.jsdom("", { resources: "usable" }).window;
    } else {
      this._window = window;
    }
    this._options = options ? sanitizeOptions(mergeDeep(defaultOptions, options) as RequiredOptions) : defaultOptions;
    this.update();
  }

  static _clearContainer(container?: HTMLElement): void {
    if (container) {
      container.innerHTML = "";
    }
  }

  _setupSvg(): void {
    if (!this._qr) {
      return;
    }
    const qrSVG = new QRSVG(this._options, this._window);

    this._svg = qrSVG.getElement();
    this._svgDrawingPromise = qrSVG.drawQR(this._qr).then(() => {
      if (!this._svg) return;
      this._extension?.(qrSVG.getElement(), this._options);
    });
  }

  _setupCanvas(): void {
    if (!this._qr) {
      return;
    }

    if (this._options.nodeCanvas?.createCanvas) {
      this._canvas = this._options.nodeCanvas.createCanvas(this._options.width, this._options.height);
    } else {
      this._canvas = document.createElement("canvas");
    }
    this._canvas.width = this._options.width;
    this._canvas.height = this._options.height;

    this._setupSvg();
    this._canvasDrawingPromise = this._svgDrawingPromise?.then(() => {
      if (!this._svg) return;

      const svg = this._svg;
      const xml = new this._window.XMLSerializer().serializeToString(svg);
      const svg64 = btoa(xml);
      const image64 = "data:image/svg+xml;base64," + svg64;

      if (this._options.nodeCanvas?.loadImage) {
        return this._options.nodeCanvas.loadImage(image64).then((image: HTMLImageElement) => {
          // fix blurry svg
          image.width = this._options.width;
          image.height = this._options.height;
          this._canvas?.getContext("2d")?.drawImage(image, 0, 0);
        });
      } else {
        const image = new this._window.Image();

        return new Promise((resolve) => {
          image.onload = (): void => {
            this._canvas?.getContext("2d")?.drawImage(image, 0, 0);
            resolve();
          };

          image.src = image64;
        });
      }
    });
  }

  async _getElement(extension: FileExtension = "png"): Promise<SVGElement | Canvas | undefined> {
    if (!this._qr) throw "QR code is empty";

    if (extension.toLowerCase() === "svg") {
      if (!this._svg || !this._svgDrawingPromise) {
        this._setupSvg();
      }
      await this._svgDrawingPromise;
      return this._svg;
    } else {
      if (!this._canvas || !this._canvasDrawingPromise) {
        this._setupCanvas();
      }
      await this._canvasDrawingPromise;
      return this._canvas;
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

    if (this._options.type === drawTypes.canvas) {
      this._setupCanvas();
    } else {
      this._setupSvg();
    }

    this.append(this._container);
  }

  append(container?: HTMLElement): void {
    if (!container) {
      return;
    }

    if (typeof container.appendChild !== "function") {
      throw "Container should be a single DOM node";
    }

    if (this._options.type === drawTypes.canvas) {
      if (this._canvas) {
        container.appendChild(this._canvas);
      }
    } else {
      if (this._svg) {
        container.appendChild(this._svg);
      }
    }

    this._container = container;
  }

  applyExtension(extension: ExtensionFunction): void {
    if (!extension) {
      throw "Extension function should be defined.";
    }

    this._extension = extension;
    this.update();
  }

  deleteExtension(): void {
    this._extension = undefined;
    this.update();
  }

  async getRawData(extension: FileExtension = "png"): Promise<Blob | Buffer | null> {
    if (!this._qr) throw "QR code is empty";
    const element = await this._getElement(extension);

    if (!element) {
      return null;
    }

    if (extension.toLowerCase() === "svg") {
      const serializer = new this._window.XMLSerializer();
      const source = serializer.serializeToString(element);
      const svgString = `<?xml version="1.0" standalone="no"?>\r\n${source}`;
      if (typeof Blob !== "undefined" && !this._options.jsdom) {
        return new Blob([svgString], { type: "image/svg+xml" });
      } else {
        return Buffer.from(svgString);
      }
    } else {
      return new Promise((resolve) => {
        const canvas = element as Canvas;
        if (canvas.toBuffer) {
          resolve(canvas.toBuffer(`image/${extension}`));
        } else {
          canvas.toBlob(resolve, `image/${extension}`, 1);
        }
      });
    }
  }

  async download(downloadOptions?: Partial<DownloadOptions> | string): Promise<void> {
    if (!this._qr) throw "QR code is empty";
    if (typeof Blob === "undefined") throw "Cannot download in Node.js, call getRawData instead.";
    let extension = "png" as FileExtension;
    let name = "qr";

    //TODO remove deprecated code in the v2
    if (typeof downloadOptions === "string") {
      extension = downloadOptions as FileExtension;
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
    }

    const element = await this._getElement(extension);

    if (!element) {
      return;
    }

    if (extension.toLowerCase() === "svg") {
      const serializer = new XMLSerializer();
      let source = serializer.serializeToString(element);

      source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
      const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
      downloadURI(url, `${name}.svg`);
    } else {
      const url = (element as HTMLCanvasElement).toDataURL(`image/${extension}`);
      downloadURI(url, `${name}.${extension}`);
    }
  }
}
