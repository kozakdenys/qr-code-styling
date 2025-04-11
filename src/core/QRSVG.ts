import calculateImageSize from "../tools/calculateImageSize";
import toDataUrl from "../tools/toDataUrl";
import errorCorrectionPercents from "../constants/errorCorrectionPercents";
import QRDot from "../figures/dot/QRDot";
import QRCornerSquare, { availableCornerSquareTypes } from "../figures/cornerSquare/QRCornerSquare";
import QRCornerDot, { availableCornerDotTypes } from "../figures/cornerDot/QRCornerDot";
import { RequiredOptions } from "./QROptions";
import gradientTypes from "../constants/gradientTypes";
import shapeTypes from "../constants/shapeTypes";
import { DotType, QRCode, FilterFunction, Gradient, Window } from "../types";
import { Image } from "canvas";

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

export default class QRSVG {
  _window: Window;
  _element: SVGElement;
  _defs: SVGElement;
  _backgroundClipPath?: SVGElement;
  _dotsClipPath?: SVGElement;
  _cornersSquareClipPath?: SVGElement;
  _cornersDotClipPath?: SVGElement;
  _options: RequiredOptions;
  _qr?: QRCode;
  _image?: HTMLImageElement | Image;
  _imageUri?: string;
  _instanceId: number;

  static instanceCount = 0;

  //TODO don't pass all options to this class
  constructor(options: RequiredOptions, window: Window) {
    this._window = window;
    this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this._element.setAttribute("width", String(options.width));
    this._element.setAttribute("height", String(options.height));
    this._element.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
    if (!options.dotsOptions.roundSize) {
      this._element.setAttribute("shape-rendering", "crispEdges");
    }
    this._element.setAttribute("viewBox", `0 0 ${options.width} ${options.height}`);
    this._defs = this._window.document.createElementNS("http://www.w3.org/2000/svg", "defs");
    this._element.appendChild(this._defs);
    this._imageUri = options.image;
    this._instanceId = QRSVG.instanceCount++;
    this._options = options;
  }

  get width(): number {
    return this._options.width;
  }

  get height(): number {
    return this._options.height;
  }

  getElement(): SVGElement {
    return this._element;
  }

  async drawQR(qr: QRCode): Promise<void> {
    const count = qr.getModuleCount();
    const minSize = Math.min(this._options.width, this._options.height) - this._options.margin * 2;
    const realQRSize = this._options.shape === shapeTypes.circle ? minSize / Math.sqrt(2) : minSize;
    const dotSize = this._roundSize(realQRSize / count);
    let drawImageSize = {
      hideXDots: 0,
      hideYDots: 0,
      width: 0,
      height: 0
    };

    this._qr = qr;

    if (this._options.image) {
      //We need it to get image size
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

    this.drawBackground();
    this.drawDots((row: number, col: number): boolean => {
      if (this._options.imageOptions.hideBackgroundDots) {
        if (
          row >= (count - drawImageSize.hideYDots) / 2 &&
          row < (count + drawImageSize.hideYDots) / 2 &&
          col >= (count - drawImageSize.hideXDots) / 2 &&
          col < (count + drawImageSize.hideXDots) / 2
        ) {
          return false;
        }
      }

      if (squareMask[row]?.[col] || squareMask[row - count + 7]?.[col] || squareMask[row]?.[col - count + 7]) {
        return false;
      }

      if (dotMask[row]?.[col] || dotMask[row - count + 7]?.[col] || dotMask[row]?.[col - count + 7]) {
        return false;
      }

      return true;
    });
    this.drawCorners();

    if (this._options.image) {
      await this.drawImage({ width: drawImageSize.width, height: drawImageSize.height, count, dotSize });
    }
  }

  drawBackground(): void {
    const element = this._element;
    const options = this._options;

    if (element) {
      const gradientOptions = options.backgroundOptions?.gradient;
      const color = options.backgroundOptions?.color;
      let height = options.height;
      let width = options.width;

      if (gradientOptions || color) {
        const element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "rect");
        this._backgroundClipPath = this._window.document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
        this._backgroundClipPath.setAttribute("id", `clip-path-background-color-${this._instanceId}`);
        this._defs.appendChild(this._backgroundClipPath);

        if (options.backgroundOptions?.round) {
          height = width = Math.min(options.width, options.height);
          element.setAttribute("rx", String((height / 2) * options.backgroundOptions.round));
        }

        element.setAttribute("x", String(this._roundSize((options.width - width) / 2)));
        element.setAttribute("y", String(this._roundSize((options.height - height) / 2)));
        element.setAttribute("width", String(width));
        element.setAttribute("height", String(height));

        this._backgroundClipPath.appendChild(element);

        this._createColor({
          options: gradientOptions,
          color: color,
          additionalRotation: 0,
          x: 0,
          y: 0,
          height: options.height,
          width: options.width,
          name: `background-color-${this._instanceId}`
        });
      }
    }
  }

  drawDots(filter?: FilterFunction): void {
    if (!this._qr) {
      throw "QR code is not defined";
    }

    const options = this._options;
    const count = this._qr.getModuleCount();

    if (count > options.width || count > options.height) {
      throw "The canvas is too small.";
    }

    const minSize = Math.min(options.width, options.height) - options.margin * 2;
    const realQRSize = options.shape === shapeTypes.circle ? minSize / Math.sqrt(2) : minSize;
    const dotSize = this._roundSize(realQRSize / count);
    const xBeginning = this._roundSize((options.width - count * dotSize) / 2);
    const yBeginning = this._roundSize((options.height - count * dotSize) / 2);
    const dot = new QRDot({
      svg: this._element,
      type: options.dotsOptions.type,
      window: this._window
    });

    this._dotsClipPath = this._window.document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
    this._dotsClipPath.setAttribute("id", `clip-path-dot-color-${this._instanceId}`);
    this._defs.appendChild(this._dotsClipPath);

    this._createColor({
      options: options.dotsOptions?.gradient,
      color: options.dotsOptions.color,
      additionalRotation: 0,
      x: 0,
      y: 0,
      height: options.height,
      width: options.width,
      name: `dot-color-${this._instanceId}`
    });

    for (let row = 0; row < count; row++) {
      for (let col = 0; col < count; col++) {
        if (filter && !filter(row, col)) {
          continue;
        }
        if (!this._qr?.isDark(row, col)) {
          continue;
        }

        dot.draw(
          xBeginning + col * dotSize,
          yBeginning + row * dotSize,
          dotSize,
          (xOffset: number, yOffset: number): boolean => {
            if (col + xOffset < 0 || row + yOffset < 0 || col + xOffset >= count || row + yOffset >= count) return false;
            if (filter && !filter(row + yOffset, col + xOffset)) return false;
            return !!this._qr && this._qr.isDark(row + yOffset, col + xOffset);
          }
        );

        if (dot._element && this._dotsClipPath) {
          this._dotsClipPath.appendChild(dot._element);
        }
      }
    }

    if (options.shape === shapeTypes.circle) {
      const additionalDots = this._roundSize((minSize / dotSize - count) / 2);
      const fakeCount = count + additionalDots * 2;
      const xFakeBeginning = xBeginning - additionalDots * dotSize;
      const yFakeBeginning = yBeginning - additionalDots * dotSize;
      const fakeMatrix: number[][] = [];
      const center = this._roundSize(fakeCount / 2);

      for (let row = 0; row < fakeCount; row++) {
        fakeMatrix[row] = [];
        for (let col = 0; col < fakeCount; col++) {
          if (
            row >= additionalDots - 1 &&
            row <= fakeCount - additionalDots &&
            col >= additionalDots - 1 &&
            col <= fakeCount - additionalDots
          ) {
            fakeMatrix[row][col] = 0;
            continue;
          }

          if (Math.sqrt((row - center) * (row - center) + (col - center) * (col - center)) > center) {
            fakeMatrix[row][col] = 0;
            continue;
          }

          //Get random dots from QR code to show it outside of QR code
          fakeMatrix[row][col] = this._qr.isDark(
            col - 2 * additionalDots < 0 ? col : col >= count ? col - 2 * additionalDots : col - additionalDots,
            row - 2 * additionalDots < 0 ? row : row >= count ? row - 2 * additionalDots : row - additionalDots
          )
            ? 1
            : 0;
        }
      }

      for (let row = 0; row < fakeCount; row++) {
        for (let col = 0; col < fakeCount; col++) {
          if (!fakeMatrix[row][col]) continue;

          dot.draw(
            xFakeBeginning + col * dotSize,
            yFakeBeginning + row * dotSize,
            dotSize,
            (xOffset: number, yOffset: number): boolean => {
              return !!fakeMatrix[row + yOffset]?.[col + xOffset];
            }
          );
          if (dot._element && this._dotsClipPath) {
            this._dotsClipPath.appendChild(dot._element);
          }
        }
      }
    }
  }

  drawCorners(): void {
    if (!this._qr) {
      throw "QR code is not defined";
    }

    const element = this._element;
    const options = this._options;

    if (!element) {
      throw "Element code is not defined";
    }

    const count = this._qr.getModuleCount();
    const minSize = Math.min(options.width, options.height) - options.margin * 2;
    const realQRSize = options.shape === shapeTypes.circle ? minSize / Math.sqrt(2) : minSize;
    const dotSize = this._roundSize(realQRSize / count);
    const cornersSquareSize = dotSize * 7;
    const cornersDotSize = dotSize * 3;
    const xBeginning = this._roundSize((options.width - count * dotSize) / 2);
    const yBeginning = this._roundSize((options.height - count * dotSize) / 2);

    [
      [0, 0, 0],
      [1, 0, Math.PI / 2],
      [0, 1, -Math.PI / 2]
    ].forEach(([column, row, rotation]) => {
      const x = xBeginning + column * dotSize * (count - 7);
      const y = yBeginning + row * dotSize * (count - 7);
      let cornersSquareClipPath = this._dotsClipPath;
      let cornersDotClipPath = this._dotsClipPath;

      if (options.cornersSquareOptions?.gradient || options.cornersSquareOptions?.color) {
        cornersSquareClipPath = this._window.document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
        cornersSquareClipPath.setAttribute("id", `clip-path-corners-square-color-${column}-${row}-${this._instanceId}`);
        this._defs.appendChild(cornersSquareClipPath);
        this._cornersSquareClipPath = this._cornersDotClipPath = cornersDotClipPath = cornersSquareClipPath;

        this._createColor({
          options: options.cornersSquareOptions?.gradient,
          color: options.cornersSquareOptions?.color,
          additionalRotation: rotation,
          x,
          y,
          height: cornersSquareSize,
          width: cornersSquareSize,
          name: `corners-square-color-${column}-${row}-${this._instanceId}`
        });
      }

      if (options.cornersSquareOptions?.type && availableCornerSquareTypes.includes(options.cornersSquareOptions.type)) {
        const cornersSquare = new QRCornerSquare({
          svg: this._element,
          type: options.cornersSquareOptions.type,
          window: this._window
        });

        cornersSquare.draw(x, y, cornersSquareSize, rotation);

        if (cornersSquare._element && cornersSquareClipPath) {
          cornersSquareClipPath.appendChild(cornersSquare._element);
        }
      } else {
        const dot = new QRDot({
          svg: this._element,
          type: (options.cornersSquareOptions?.type as DotType) || options.dotsOptions.type,
          window: this._window
        });

        for (let row = 0; row < squareMask.length; row++) {
          for (let col = 0; col < squareMask[row].length; col++) {
            if (!squareMask[row]?.[col]) {
              continue;
            }

            dot.draw(
              x + col * dotSize,
              y + row * dotSize,
              dotSize,
              (xOffset: number, yOffset: number): boolean => !!squareMask[row + yOffset]?.[col + xOffset]
            );

            if (dot._element && cornersSquareClipPath) {
              cornersSquareClipPath.appendChild(dot._element);
            }
          }
        }
      }

      if (options.cornersDotOptions?.gradient || options.cornersDotOptions?.color) {
        cornersDotClipPath = this._window.document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
        cornersDotClipPath.setAttribute("id", `clip-path-corners-dot-color-${column}-${row}-${this._instanceId}`);
        this._defs.appendChild(cornersDotClipPath);
        this._cornersDotClipPath = cornersDotClipPath;

        this._createColor({
          options: options.cornersDotOptions?.gradient,
          color: options.cornersDotOptions?.color,
          additionalRotation: rotation,
          x: x + dotSize * 2,
          y: y + dotSize * 2,
          height: cornersDotSize,
          width: cornersDotSize,
          name: `corners-dot-color-${column}-${row}-${this._instanceId}`
        });
      }

      if (options.cornersDotOptions?.type && availableCornerDotTypes.includes(options.cornersDotOptions.type)) {
        const cornersDot = new QRCornerDot({
          svg: this._element,
          type: options.cornersDotOptions.type,
          window: this._window
        });

        cornersDot.draw(x + dotSize * 2, y + dotSize * 2, cornersDotSize, rotation);

        if (cornersDot._element && cornersDotClipPath) {
          cornersDotClipPath.appendChild(cornersDot._element);
        }
      } else {
        const dot = new QRDot({
          svg: this._element,
          type: (options.cornersDotOptions?.type as DotType) || options.dotsOptions.type,
          window: this._window
        });

        for (let row = 0; row < dotMask.length; row++) {
          for (let col = 0; col < dotMask[row].length; col++) {
            if (!dotMask[row]?.[col]) {
              continue;
            }

            dot.draw(
              x + col * dotSize,
              y + row * dotSize,
              dotSize,
              (xOffset: number, yOffset: number): boolean => !!dotMask[row + yOffset]?.[col + xOffset]
            );

            if (dot._element && cornersDotClipPath) {
              cornersDotClipPath.appendChild(dot._element);
            }
          }
        }
      }
    });
  }

  loadImage(): Promise<void> {
    return new Promise((resolve, reject) => {
      const options = this._options;

      if (!options.image) {
        return reject("Image is not defined");
      }

      if (options.nodeCanvas?.loadImage) {
        options.nodeCanvas
          .loadImage(options.image)
          .then((image: Image) => {
            this._image = image;
            if (this._options.imageOptions.saveAsBlob) {
              const canvas = options.nodeCanvas?.createCanvas( this._image.width,  this._image.height);
              canvas?.getContext('2d')?.drawImage(image, 0, 0);
              this._imageUri = canvas?.toDataURL();
            }
            resolve();
          })
          .catch(reject);
      } else {
        const image = new this._window.Image();

        if (typeof options.imageOptions.crossOrigin === "string") {
          image.crossOrigin = options.imageOptions.crossOrigin;
        }

        this._image = image;
        image.onload = async () => {
          if (this._options.imageOptions.saveAsBlob) {
            this._imageUri = await toDataUrl(options.image || "", this._window);
          }
          resolve();
        };
        image.src = options.image;
      }
    });
  }

  async drawImage({
    width,
    height,
    count,
    dotSize
  }: {
    width: number;
    height: number;
    count: number;
    dotSize: number;
  }): Promise<void> {
    const options = this._options;
    const xBeginning = this._roundSize((options.width - count * dotSize) / 2);
    const yBeginning = this._roundSize((options.height - count * dotSize) / 2);
    const dx = xBeginning + this._roundSize(options.imageOptions.margin + (count * dotSize - width) / 2);
    const dy = yBeginning + this._roundSize(options.imageOptions.margin + (count * dotSize - height) / 2);
    const dw = width - options.imageOptions.margin * 2;
    const dh = height - options.imageOptions.margin * 2;

    const image = this._window.document.createElementNS("http://www.w3.org/2000/svg", "image");
    image.setAttribute("href", this._imageUri || "");
    image.setAttribute("xlink:href", this._imageUri || "");
    image.setAttribute("x", String(dx));
    image.setAttribute("y", String(dy));
    image.setAttribute("width", `${dw}px`);
    image.setAttribute("height", `${dh}px`);

    this._element.appendChild(image);
  }

  _createColor({
    options,
    color,
    additionalRotation,
    x,
    y,
    height,
    width,
    name
  }: {
    options?: Gradient;
    color?: string;
    additionalRotation: number;
    x: number;
    y: number;
    height: number;
    width: number;
    name: string;
  }): void {
    const size = width > height ? width : height;
    const rect = this._window.document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", String(x));
    rect.setAttribute("y", String(y));
    rect.setAttribute("height", String(height));
    rect.setAttribute("width", String(width));
    rect.setAttribute("clip-path", `url('#clip-path-${name}')`);

    if (options) {
      let gradient: SVGElement;
      if (options.type === gradientTypes.radial) {
        gradient = this._window.document.createElementNS("http://www.w3.org/2000/svg", "radialGradient");
        gradient.setAttribute("id", name);
        gradient.setAttribute("gradientUnits", "userSpaceOnUse");
        gradient.setAttribute("fx", String(x + width / 2));
        gradient.setAttribute("fy", String(y + height / 2));
        gradient.setAttribute("cx", String(x + width / 2));
        gradient.setAttribute("cy", String(y + height / 2));
        gradient.setAttribute("r", String(size / 2));
      } else {
        const rotation = ((options.rotation || 0) + additionalRotation) % (2 * Math.PI);
        const positiveRotation = (rotation + 2 * Math.PI) % (2 * Math.PI);
        let x0 = x + width / 2;
        let y0 = y + height / 2;
        let x1 = x + width / 2;
        let y1 = y + height / 2;

        if (
          (positiveRotation >= 0 && positiveRotation <= 0.25 * Math.PI) ||
          (positiveRotation > 1.75 * Math.PI && positiveRotation <= 2 * Math.PI)
        ) {
          x0 = x0 - width / 2;
          y0 = y0 - (height / 2) * Math.tan(rotation);
          x1 = x1 + width / 2;
          y1 = y1 + (height / 2) * Math.tan(rotation);
        } else if (positiveRotation > 0.25 * Math.PI && positiveRotation <= 0.75 * Math.PI) {
          y0 = y0 - height / 2;
          x0 = x0 - width / 2 / Math.tan(rotation);
          y1 = y1 + height / 2;
          x1 = x1 + width / 2 / Math.tan(rotation);
        } else if (positiveRotation > 0.75 * Math.PI && positiveRotation <= 1.25 * Math.PI) {
          x0 = x0 + width / 2;
          y0 = y0 + (height / 2) * Math.tan(rotation);
          x1 = x1 - width / 2;
          y1 = y1 - (height / 2) * Math.tan(rotation);
        } else if (positiveRotation > 1.25 * Math.PI && positiveRotation <= 1.75 * Math.PI) {
          y0 = y0 + height / 2;
          x0 = x0 + width / 2 / Math.tan(rotation);
          y1 = y1 - height / 2;
          x1 = x1 - width / 2 / Math.tan(rotation);
        }

        gradient = this._window.document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
        gradient.setAttribute("id", name);
        gradient.setAttribute("gradientUnits", "userSpaceOnUse");
        gradient.setAttribute("x1", String(Math.round(x0)));
        gradient.setAttribute("y1", String(Math.round(y0)));
        gradient.setAttribute("x2", String(Math.round(x1)));
        gradient.setAttribute("y2", String(Math.round(y1)));
      }

      options.colorStops.forEach(({ offset, color }: { offset: number; color: string }) => {
        const stop = this._window.document.createElementNS("http://www.w3.org/2000/svg", "stop");
        stop.setAttribute("offset", `${100 * offset}%`);
        stop.setAttribute("stop-color", color);
        gradient.appendChild(stop);
      });

      rect.setAttribute("fill", `url('#${name}')`);
      this._defs.appendChild(gradient);
    } else if (color) {
      rect.setAttribute("fill", color);
    }

    this._element.appendChild(rect);
  }

  _roundSize = (value: number) => {
    if (this._options.dotsOptions.roundSize) {
      return Math.floor(value);
    }
    return value;
  }
}
