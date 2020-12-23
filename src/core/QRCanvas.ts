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

  async drawQR(qr: QRCode): Promise<void> {
    const count = qr.getModuleCount();
    const minSize = Math.min(this._options.width, this._options.height);
    const dotSize = Math.floor(minSize / count);
    let drawImageSize = {
      hideXDots: 0,
      hideYDots: 0,
      width: 0,
      height: 0
    };

    this._qr = qr;

    if (this._options.image) {
      await this.loadImage();
      if (!this._image) return;
      const { imageOptions, qrOptions } = this._options;
      const coverLevel = imageOptions.imageSize * errorCorrectionPercents[qrOptions.errorCorrectionLevel];
      const maxHiddenDots = Math.floor(coverLevel * count * count);

      drawImageSize = calculateImageSize({
        originalWidth: this._image.width,
        originalHeight: this._image.height,
        maxHiddenDots,
        maxHiddenAxisDots: count - 14,
        dotSize
      });
    }

    this.clear();
    this.drawBackground();
    this.drawDots((i: number, j: number): boolean => {
      if (this._options.imageOptions.hideBackgroundDots) {
        if (
          i >= (count - drawImageSize.hideXDots) / 2 &&
          i < (count + drawImageSize.hideXDots) / 2 &&
          j >= (count - drawImageSize.hideYDots) / 2 &&
          j < (count + drawImageSize.hideYDots) / 2
        ) {
          return false;
        }
      }

      if (this._options.cornersSquareOptions?.type) {
        if (squareMask[i]?.[j] || squareMask[i - count + 7]?.[j] || squareMask[i]?.[j - count + 7]) {
          return false;
        }
      }

      if (this._options.cornersDotOptions?.type) {
        if (dotMask[i]?.[j] || dotMask[i - count + 7]?.[j] || dotMask[i]?.[j - count + 7]) {
          return false;
        }
      }

      return true;
    });
    this.drawCornersSquare((): boolean => {
      return !!this._options.cornersSquareOptions?.type;
    });
    this.drawCornersDot((): boolean => {
      return !!this._options.cornersDotOptions?.type;
    });

    if (this._options.image) {
      this.drawImage({ width: drawImageSize.width, height: drawImageSize.height, count, dotSize });
    }
  }

  drawBackground(): void {
    const canvasContext = this.context;
    const options = this._options;

    if (canvasContext) {
      if (options.backgroundOptions.gradient) {
        const gradientOptions = options.backgroundOptions.gradient;
        const gradient = canvasContext.createLinearGradient(
          (gradientOptions.start.x * this._canvas.width) / 100,
          (gradientOptions.start.y * this._canvas.height) / 100,
          (gradientOptions.end.x * this._canvas.width) / 100,
          (gradientOptions.end.y * this._canvas.height) / 100
        );

        gradientOptions.colorStops.forEach(({ offset, color }: { offset: number; color: string }) => {
          gradient.addColorStop(offset, color);
        });

        canvasContext.fillStyle = gradient;
      } else if (options.backgroundOptions.color) {
        canvasContext.fillStyle = options.backgroundOptions.color;
      }
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

    canvasContext.beginPath();

    for (let i = 0; i < count; i++) {
      for (let j = 0; j < count; j++) {
        if (filter && !filter(i, j)) {
          continue;
        }
        if (!this._qr.isDark(i, j)) {
          continue;
        }
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

    if (options.dotsOptions.gradient) {
      const gradientOptions = options.dotsOptions.gradient;
      const gradient = canvasContext.createLinearGradient(
        (gradientOptions.start.x * count * dotSize) / 100,
        (gradientOptions.start.y * count * dotSize) / 100,
        (gradientOptions.end.x * count * dotSize) / 100,
        (gradientOptions.end.y * count * dotSize) / 100
      );

      gradientOptions.colorStops.forEach(({ offset, color }: { offset: number; color: string }) => {
        gradient.addColorStop(offset, color);
      });

      canvasContext.fillStyle = canvasContext.strokeStyle = gradient;
    } else if (options.dotsOptions.color) {
      canvasContext.fillStyle = canvasContext.strokeStyle = options.dotsOptions.color;
    }

    canvasContext.fill("evenodd");
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
      return;
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
      [1, 0, Math.PI / 2],
      [0, 1, -Math.PI / 2]
    ].forEach(([i, j, rotation]) => {
      if (filter && !filter(i, j)) {
        return;
      }
      const x = xBeginning + i * dotSize * (count - 7);
      const y = yBeginning + j * dotSize * (count - 7);

      canvasContext.beginPath();
      cornersSquare.draw(x, y, cornersSquareSize, rotation);

      if (options.cornersSquareOptions?.gradient) {
        const gradientOptions = options.cornersSquareOptions.gradient;
        const gradient = canvasContext.createLinearGradient(
          (gradientOptions.start.x * cornersSquareSize) / 100 + x,
          (gradientOptions.start.y * cornersSquareSize) / 100 + y,
          (gradientOptions.end.x * cornersSquareSize) / 100 + x,
          (gradientOptions.end.y * cornersSquareSize) / 100 + y
        );

        gradientOptions.colorStops.forEach(({ offset, color }: { offset: number; color: string }) => {
          gradient.addColorStop(offset, color);
        });

        canvasContext.fillStyle = canvasContext.strokeStyle = gradient;
      } else if (options.cornersSquareOptions?.color) {
        canvasContext.fillStyle = canvasContext.strokeStyle = options.cornersSquareOptions.color;
      }

      canvasContext.fill("evenodd");
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
      return;
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
      [1, 0, Math.PI / 2],
      [0, 1, -Math.PI / 2]
    ].forEach(([i, j, rotation]) => {
      if (filter && !filter(i, j)) {
        return;
      }
      const x = xBeginning + dotSize * 2 + i * dotSize * (count - 7);
      const y = yBeginning + dotSize * 2 + j * dotSize * (count - 7);

      canvasContext.beginPath();
      cornersDot.draw(x, y, cornersDotSize, rotation);

      if (options.cornersDotOptions?.gradient) {
        const gradientOptions = options.cornersDotOptions.gradient;
        const gradient = canvasContext.createLinearGradient(
          (gradientOptions.start.x * cornersDotSize) / 100 + x,
          (gradientOptions.start.y * cornersDotSize) / 100 + y,
          (gradientOptions.end.x * cornersDotSize) / 100 + x,
          (gradientOptions.end.y * cornersDotSize) / 100 + y
        );

        gradientOptions.colorStops.forEach(({ offset, color }: { offset: number; color: string }) => {
          gradient.addColorStop(offset, color);
        });

        canvasContext.fillStyle = canvasContext.strokeStyle = gradient;
      } else if (options.cornersDotOptions?.color) {
        canvasContext.fillStyle = canvasContext.strokeStyle = options.cornersDotOptions.color;
      }

      canvasContext.fill("evenodd");
    });
  }

  loadImage(): Promise<void> {
    return new Promise((resolve, reject) => {
      const options = this._options;
      const image = new Image();

      if (!options.image) {
        return reject("Image is not defined");
      }

      if (typeof options.imageOptions.crossOrigin === "string") {
        image.crossOrigin = options.imageOptions.crossOrigin;
      }

      this._image = image;
      image.onload = (): void => {
        resolve();
      };
      image.src = options.image;
    });
  }

  drawImage({
    width,
    height,
    count,
    dotSize
  }: {
    width: number;
    height: number;
    count: number;
    dotSize: number;
  }): void {
    const canvasContext = this.context;

    if (!canvasContext) {
      throw "canvasContext is not defined";
    }

    if (!this._image) {
      throw "image is not defined";
    }

    const options = this._options;
    const xBeginning = Math.floor((options.width - count * dotSize) / 2);
    const yBeginning = Math.floor((options.height - count * dotSize) / 2);
    const dx = xBeginning + options.imageOptions.margin + (count * dotSize - width) / 2;
    const dy = yBeginning + options.imageOptions.margin + (count * dotSize - height) / 2;
    const dw = width - options.imageOptions.margin * 2;
    const dh = height - options.imageOptions.margin * 2;

    canvasContext.drawImage(this._image, dx, dy, dw < 0 ? 0 : dw, dh < 0 ? 0 : dh);
  }
}
