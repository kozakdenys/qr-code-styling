import calculateImageSize from "../tools/calculateImageSize";
import errorCorrectionPercents from "../constants/errorCorrectionPercents";
import QRDot from "./QRDot";
import { Options } from "./QROptions";
import { QRCode } from "qrcode-generator-ts";
import QREye from "./QREye";

type FilterFunction = (i: number, j: number) => boolean;

export default class QRCanvas {
  _canvas: HTMLCanvasElement;
  _options: Options;
  _qr?: QRCode;
  _image?: HTMLImageElement;
  private _positionProbeModules: any = {};

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

    this.setupPositionProbeModules(0, 0);
    this.setupPositionProbeModules(this._qr.getModuleCount() - 7, 0);
    this.setupPositionProbeModules(0, this._qr.getModuleCount() - 7);
    this.drawEyes();

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
        if (i in this._positionProbeModules && j in this._positionProbeModules[i]) {
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

  drawEyes(): void {
    if (!this._qr) {
      throw "QR code is not defined";
    }

    const canvas = this._canvas;
    const canvasContext = this.context;
    const options = this._options;
    const count = this._qr.getModuleCount();

    if (!canvasContext) {
      throw "QR code is not defined";
    }
    if (count > options.width || count > options.height) {
      throw "The canvas is too small.";
    }

    const minSize = Math.min(options.width, options.height);
    const dotSize = Math.floor(minSize / count);
    const xBeginning = Math.floor((options.width - count * dotSize) / 2);
    const yBeginning = Math.floor((options.height - count * dotSize) / 2);

    const qrEye = new QREye({
      context: canvasContext,
      options: options
    });

    qrEye.draw(xBeginning, yBeginning, dotSize);

    canvasContext.save();
    canvasContext.translate(canvas.width, 0);
    canvasContext.scale(-1, 1);
    qrEye.draw(xBeginning, yBeginning, dotSize);
    canvasContext.restore();

    canvasContext.save();
    canvasContext.translate(0, canvas.height);
    canvasContext.scale(1, -1);
    qrEye.draw(xBeginning, yBeginning, dotSize);
    canvasContext.restore();
  }

  private setupPositionProbeModules(row: number, col: number): void {
    if (!this._qr) {
      throw "QR code is not defined";
    }

    for (let r = -1; r <= 7; r += 1) {
      for (let c = -1; c <= 7; c += 1) {
        if (
          row + r <= -1 ||
          this._qr.getModuleCount() <= row + r ||
          col + c <= -1 ||
          this._qr.getModuleCount() <= col + c
        ) {
          continue;
        }

        if (
          (0 <= r && r <= 6 && (c == 0 || c == 6)) ||
          (0 <= c && c <= 6 && (r == 0 || r == 6)) ||
          (2 <= r && r <= 4 && 2 <= c && c <= 4)
        ) {
          if (!(row + r in this._positionProbeModules)) {
            this._positionProbeModules[row + r] = {};
          }
          this._positionProbeModules[row + r][col + c] = true;
        }
      }
    }
  }
}
