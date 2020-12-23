import calculateImageSize from "../tools/calculateImageSize";
import errorCorrectionPercents from "../constants/errorCorrectionPercents";
import QRDot from "./QRDot";
import QRCornerSquare from "./QRCornerSquare";
import QRCornerDot from "./QRCornerDot";
import { Options } from "./QROptions";

type FilterFunction = (i: number, j: number) => boolean;

const squareMask = [
  [1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1]
];

const dotMask = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 0, 0],
  [0, 0, 1, 1, 1, 0, 0],
  [0, 0, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0]
];

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

  drawCornersSquare(filter?: FilterFunction): void {
    if (!this._qr) {
      throw "QR code is not defined";
    }

    const canvasContext = this.context;

    if (!canvasContext) {
      throw "QR code is not defined";
    }

    const options = this._options;

    if (!options.cornersSquareOptions?.type) {
      throw "Type is not defined";
    }

    const count = this._qr.getModuleCount();
    const minSize = Math.min(options.width, options.height);
    const dotSize = Math.floor(minSize / count);
    const cornersSquareSize = dotSize * 7;
    const xBeginning = Math.floor((options.width - count * dotSize) / 2);
    const yBeginning = Math.floor((options.height - count * dotSize) / 2);
    const cornersSquare = new QRCornerSquare({ context: canvasContext, type: options.cornersSquareOptions?.type });

    [
      [0, 0, 0],
      [1, 0, -Math.PI / 2],
      [0, 1, Math.PI / 2]
    ].forEach(([i, j, rotation]) => {
      if (filter && !filter(i, j)) {
        return;
      }

      canvasContext.fillStyle = options.cornersSquareOptions?.color || options.dotsOptions.color;
      canvasContext.strokeStyle = options.cornersSquareOptions?.color || options.dotsOptions.color;
      cornersSquare.draw(
        xBeginning + i * dotSize * (count - 7),
        yBeginning + j * dotSize * (count - 7),
        cornersSquareSize,
        rotation
      );
    });
  }

  drawCornersDot(filter?: FilterFunction): void {
    if (!this._qr) {
      throw "QR code is not defined";
    }

    const canvasContext = this.context;

    if (!canvasContext) {
      throw "QR code is not defined";
    }

    const options = this._options;

    if (!options.cornersDotOptions?.type) {
      throw "Type is not defined";
    }

    const count = this._qr.getModuleCount();
    const minSize = Math.min(options.width, options.height);
    const dotSize = Math.floor(minSize / count);
    const cornersDotSize = dotSize * 3;
    const xBeginning = Math.floor((options.width - count * dotSize) / 2);
    const yBeginning = Math.floor((options.height - count * dotSize) / 2);
    const cornersDot = new QRCornerDot({ context: canvasContext, type: options.cornersDotOptions?.type });

    [
      [0, 0, 0],
      [1, 0, -Math.PI / 2],
      [0, 1, Math.PI / 2]
    ].forEach(([i, j, rotation]) => {
      if (filter && !filter(i, j)) {
        return;
      }

      canvasContext.fillStyle = options.cornersDotOptions?.color || options.dotsOptions.color;
      canvasContext.strokeStyle = options.cornersDotOptions?.color || options.dotsOptions.color;
      cornersDot.draw(
        xBeginning + dotSize * 2 + i * dotSize * (count - 7),
        yBeginning + dotSize * 2 + j * dotSize * (count - 7),
        cornersDotSize,
        rotation
      );
    });
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

      if (typeof options.imageOptions.crossOrigin === "string") {
        image.crossOrigin = options.imageOptions.crossOrigin;
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
          if (options.imageOptions.hideBackgroundDots) {
            if (
              i >= (count - hideXDots) / 2 &&
              i < (count + hideXDots) / 2 &&
              j >= (count - hideYDots) / 2 &&
              j < (count + hideYDots) / 2
            ) {
              return false;
            }
          }

          if (options.cornersSquareOptions?.type) {
            if (squareMask[i]?.[j] || squareMask[i - count + 7]?.[j] || squareMask[i]?.[j - count + 7]) {
              return false;
            }
          }

          if (options.cornersDotOptions?.type) {
            if (dotMask[i]?.[j] || dotMask[i - count + 7]?.[j] || dotMask[i]?.[j - count + 7]) {
              return false;
            }
          }

          return true;
        });

        this.drawCornersSquare((): boolean => {
          return !!options.cornersSquareOptions?.type;
        });

        this.drawCornersDot((): boolean => {
          return !!options.cornersDotOptions?.type;
        });

        const dx = xBeginning + options.imageOptions.margin + (count * dotSize - width) / 2;
        const dy = yBeginning + options.imageOptions.margin + (count * dotSize - height) / 2;
        const dw = width - options.imageOptions.margin * 2;
        const dh = height - options.imageOptions.margin * 2;

        canvasContext.drawImage(image, dx, dy, dw < 0 ? 0 : dw, dh < 0 ? 0 : dh);
        resolve();
      };
      image.src = options.image;
    });
  }
}
