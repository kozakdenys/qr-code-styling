import calculateImageSize from "../tools/calculateImageSize";
import errorCorrectionPercents from "../constants/errorCorrectionPercents";
import QRDot from "./QRDot";
import { Options } from "./QROptions";

type FilterFunction = (i: number, j: number) => boolean;

export default class QRCanvas {
  _canvas: HTMLCanvasElement;
  _options: Options;
  _qr?: QRCode;
  _image?: HTMLImageElement;

  //TODO don't pass all options to this class
  constructor(options: Options) {
    this._canvas = document.createElement("canvas");
    this._canvas.width = options.width;
    this._canvas.height = options.height;
    this._options = options;
  }

  get context(): CanvasRenderingContext2D | null {
    return this._canvas.getContext("2d");
  }

  get width(): number {
    return this._canvas.width;
  }

  get height(): number {
    return this._canvas.height;
  }

  getCanvas(): HTMLCanvasElement {
    return this._canvas;
  }

  clear(): void {
    const canvasContext = this.context;

    if (canvasContext) {
      canvasContext.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }
  }

  drawQR(qr: QRCode): Promise<void> {
    this.clear();
    this.drawBackground();
    this._qr = qr;

    if (this._options.image) {
      return this.drawImageAndDots();
    } else {
      this.drawDots();
      return Promise.resolve();
    }
  }

  drawBackground(): void {
    const canvasContext = this.context;
    const options = this._options;

    if (canvasContext) {
      canvasContext.fillStyle = options.backgroundOptions.color;
      canvasContext.fillRect(0, 0, this._canvas.width, this._canvas.height);
    }
  }

  drawDots(filter?: FilterFunction): void {
    if (!this._qr) {
      throw "QR code is not defined";
    }

    const canvasContext = this.context;

    if (!canvasContext) {
      throw "QR code is not defined";
    }

    const options = this._options;
    const count = this._qr.getModuleCount();

    if (count > options.width || count > options.height) {
      throw "The canvas is too small.";
    }

    const minSize = Math.min(options.width, options.height);
    const dotSize = Math.floor(minSize / count);
    const xBeginning = Math.floor((options.width - count * dotSize) / 2);
    const yBeginning = Math.floor((options.height - count * dotSize) / 2);
    const dot = new QRDot({ context: canvasContext, type: options.dotsOptions.type });

    for (let i = 0; i < count; i++) {
      for (let j = 0; j < count; j++) {
        if (filter && !filter(i, j)) {
          continue;
        }
        if (!this._qr.isDark(i, j)) {
          continue;
        }
        canvasContext.fillStyle = options.dotsOptions.color;
        dot.draw(
          xBeginning + i * dotSize,
          yBeginning + j * dotSize,
          dotSize,
          (xOffset: number, yOffset: number): boolean => {
            if (i + xOffset < 0 || j + yOffset < 0 || i + xOffset >= count || j + yOffset >= count) return false;
            if (filter && !filter(i + xOffset, j + yOffset)) return false;
            return !!this._qr && this._qr.isDark(i + xOffset, j + yOffset);
          }
        );
      }
    }
  }

  drawImageAndDots(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this._qr) {
        return reject("QR code is not defined");
      }

      const canvasContext = this.context;

      if (!canvasContext) {
        return reject("QR code is not defined");
      }

      const options = this._options;
      const count = this._qr.getModuleCount();
      const minSize = Math.min(options.width, options.height);
      const dotSize = Math.floor(minSize / count);
      const xBeginning = Math.floor((options.width - count * dotSize) / 2);
      const yBeginning = Math.floor((options.height - count * dotSize) / 2);
      const image = new Image();
      const coverLevel =
        options.imageOptions.imageSize * errorCorrectionPercents[options.qrOptions.errorCorrectionLevel];

      if (!options.image) {
        return reject("Image is not defined");
      }

      this._image = image;
      //TODO remove it from this place
      image.onload = (): void => {
        const maxHiddenDots = Math.floor(coverLevel * count * count);
        const { width, height, hideXDots, hideYDots } = calculateImageSize({
          originalWidth: image.width,
          originalHeight: image.height,
          maxHiddenDots,
          maxHiddenAxisDots: count - 14,
          dotSize
        });

        this.drawDots((i: number, j: number): boolean => {
          if (!options.imageOptions.hideBackgroundDots) {
            return true;
          }
          return (
            i < (count - hideXDots) / 2 ||
            i >= (count + hideXDots) / 2 ||
            j < (count - hideYDots) / 2 ||
            j >= (count + hideYDots) / 2
          );
        });

        canvasContext.drawImage(
          image,
          xBeginning + (count * dotSize - width) / 2,
          yBeginning + (count * dotSize - height) / 2,
          width,
          height
        );
        resolve();
      };
      image.src = options.image;
    });
  }
}
