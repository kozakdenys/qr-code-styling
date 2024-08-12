import calculateImageSize from "../tools/calculateImageSize";
import errorCorrectionPercents from "../constants/errorCorrectionPercents";
import QRDot from "../figures/dot/canvas/QRDot";
import QRCornerSquare from "../figures/cornerSquare/canvas/QRCornerSquare";
import QRCornerDot from "../figures/cornerDot/canvas/QRCornerDot";
import { RequiredOptions } from "./QROptions";
import gradientTypes from "../constants/gradientTypes";
import { QRCode, Gradient, FilterFunction } from "../types";

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
  _options: RequiredOptions;
  _qr?: QRCode;
  _image?: HTMLImageElement;

  //TODO don't pass all options to this class
  constructor(options: RequiredOptions) {
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
    const minSize = Math.min(this._options.width, this._options.height) - this._options.margin * 2;
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

      if (squareMask[i]?.[j] || squareMask[i - count + 7]?.[j] || squareMask[i]?.[j - count + 7]) {
        return false;
      }

      if (dotMask[i]?.[j] || dotMask[i - count + 7]?.[j] || dotMask[i]?.[j - count + 7]) {
        return false;
      }

      return true;
    });
    this.drawCorners();

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
        const gradient = this._createGradient({
          context: canvasContext,
          options: gradientOptions,
          additionalRotation: 0,
          x: 0,
          y: 0,
          size: this._canvas.width > this._canvas.height ? this._canvas.width : this._canvas.height
        });

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

    const minSize = Math.min(options.width, options.height) - options.margin * 2;
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
      const gradient = this._createGradient({
        context: canvasContext,
        options: gradientOptions,
        additionalRotation: 0,
        x: xBeginning,
        y: yBeginning,
        size: count * dotSize
      });

      gradientOptions.colorStops.forEach(({ offset, color }: { offset: number; color: string }) => {
        gradient.addColorStop(offset, color);
      });

      canvasContext.fillStyle = canvasContext.strokeStyle = gradient;
    } else if (options.dotsOptions.color) {
      canvasContext.fillStyle = canvasContext.strokeStyle = options.dotsOptions.color;
    }

    canvasContext.fill("evenodd");
  }

  drawCorners(filter?: FilterFunction): void {
    if (!this._qr) {
      throw "QR code is not defined";
    }

    const canvasContext = this.context;

    if (!canvasContext) {
      throw "QR code is not defined";
    }

    const options = this._options;

    const count = this._qr.getModuleCount();
    const minSize = Math.min(options.width, options.height) - options.margin * 2;
    const dotSize = Math.floor(minSize / count);
    const cornersSquareSize = dotSize * 7;
    const cornersDotSize = dotSize * 3;
    const xBeginning = Math.floor((options.width - count * dotSize) / 2);
    const yBeginning = Math.floor((options.height - count * dotSize) / 2);

    [
      [0, 0, 0],
      [1, 0, Math.PI / 2],
      [0, 1, -Math.PI / 2]
    ].forEach(([column, row, rotation]) => {
      if (filter && !filter(column, row)) {
        return;
      }

      const x = xBeginning + column * dotSize * (count - 7);
      const y = yBeginning + row * dotSize * (count - 7);

      if (options.cornersSquareOptions?.type) {
        const cornersSquare = new QRCornerSquare({ context: canvasContext, type: options.cornersSquareOptions?.type });

        canvasContext.beginPath();
        cornersSquare.draw(x, y, cornersSquareSize, rotation);
      } else {
        const dot = new QRDot({ context: canvasContext, type: options.dotsOptions.type });

        canvasContext.beginPath();

        for (let i = 0; i < squareMask.length; i++) {
          for (let j = 0; j < squareMask[i].length; j++) {
            if (!squareMask[i]?.[j]) {
              continue;
            }

            dot.draw(
              x + i * dotSize,
              y + j * dotSize,
              dotSize,
              (xOffset: number, yOffset: number): boolean => !!squareMask[i + xOffset]?.[j + yOffset]
            );
          }
        }
      }

      if (options.cornersSquareOptions?.gradient) {
        const gradientOptions = options.cornersSquareOptions.gradient;
        const gradient = this._createGradient({
          context: canvasContext,
          options: gradientOptions,
          additionalRotation: rotation,
          x,
          y,
          size: cornersSquareSize
        });

        gradientOptions.colorStops.forEach(({ offset, color }: { offset: number; color: string }) => {
          gradient.addColorStop(offset, color);
        });

        canvasContext.fillStyle = canvasContext.strokeStyle = gradient;
      } else if (options.cornersSquareOptions?.color) {
        canvasContext.fillStyle = canvasContext.strokeStyle = options.cornersSquareOptions.color;
      }

      canvasContext.fill("evenodd");

      if (options.cornersDotOptions?.type) {
        const cornersDot = new QRCornerDot({ context: canvasContext, type: options.cornersDotOptions?.type });

        canvasContext.beginPath();
        cornersDot.draw(x + dotSize * 2, y + dotSize * 2, cornersDotSize, rotation);
      } else {
        const dot = new QRDot({ context: canvasContext, type: options.dotsOptions.type });

        canvasContext.beginPath();

        for (let i = 0; i < dotMask.length; i++) {
          for (let j = 0; j < dotMask[i].length; j++) {
            if (!dotMask[i]?.[j]) {
              continue;
            }

            dot.draw(
              x + i * dotSize,
              y + j * dotSize,
              dotSize,
              (xOffset: number, yOffset: number): boolean => !!dotMask[i + xOffset]?.[j + yOffset]
            );
          }
        }
      }

      if (options.cornersDotOptions?.gradient) {
        const gradientOptions = options.cornersDotOptions.gradient;
        const gradient = this._createGradient({
          context: canvasContext,
          options: gradientOptions,
          additionalRotation: rotation,
          x: x + dotSize * 2,
          y: y + dotSize * 2,
          size: cornersDotSize
        });

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

  _createGradient({
    context,
    options,
    additionalRotation,
    x,
    y,
    size
  }: {
    context: CanvasRenderingContext2D;
    options: Gradient;
    additionalRotation: number;
    x: number;
    y: number;
    size: number;
  }): CanvasGradient {
    let gradient;

    if (options.type === gradientTypes.radial) {
      gradient = context.createRadialGradient(x + size / 2, y + size / 2, 0, x + size / 2, y + size / 2, size / 2);
    } else {
      const rotation = ((options.rotation || 0) + additionalRotation) % (2 * Math.PI);
      const positiveRotation = (rotation + 2 * Math.PI) % (2 * Math.PI);
      let x0 = x + size / 2;
      let y0 = y + size / 2;
      let x1 = x + size / 2;
      let y1 = y + size / 2;

      if (
        (positiveRotation >= 0 && positiveRotation <= 0.25 * Math.PI) ||
        (positiveRotation > 1.75 * Math.PI && positiveRotation <= 2 * Math.PI)
      ) {
        x0 = x0 - size / 2;
        y0 = y0 - (size / 2) * Math.tan(rotation);
        x1 = x1 + size / 2;
        y1 = y1 + (size / 2) * Math.tan(rotation);
      } else if (positiveRotation > 0.25 * Math.PI && positiveRotation <= 0.75 * Math.PI) {
        y0 = y0 - size / 2;
        x0 = x0 - size / 2 / Math.tan(rotation);
        y1 = y1 + size / 2;
        x1 = x1 + size / 2 / Math.tan(rotation);
      } else if (positiveRotation > 0.75 * Math.PI && positiveRotation <= 1.25 * Math.PI) {
        x0 = x0 + size / 2;
        y0 = y0 + (size / 2) * Math.tan(rotation);
        x1 = x1 - size / 2;
        y1 = y1 - (size / 2) * Math.tan(rotation);
      } else if (positiveRotation > 1.25 * Math.PI && positiveRotation <= 1.75 * Math.PI) {
        y0 = y0 + size / 2;
        x0 = x0 + size / 2 / Math.tan(rotation);
        y1 = y1 - size / 2;
        x1 = x1 - size / 2 / Math.tan(rotation);
      }

      gradient = context.createLinearGradient(Math.round(x0), Math.round(y0), Math.round(x1), Math.round(y1));
    }

    return gradient;
  }
}
