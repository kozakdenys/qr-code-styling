import calculateImageSize from "../tools/calculateImageSize";
import errorCorrectionPercents from "../constants/errorCorrectionPercents";
import QRDot from "../figures/dot/svg/QRDot";
import QRCornerSquare from "../figures/cornerSquare/svg/QRCornerSquare";
import QRCornerDot from "../figures/cornerDot/svg/QRCornerDot";
import { RequiredOptions, Gradient } from "./QROptions";
import gradientTypes from "../constants/gradientTypes";
import { QRCode } from "../types";

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

export default class QRSVG {
  _element: SVGElement;
  _defs: SVGElement;
  _options: RequiredOptions;
  _qr?: QRCode;
  _image?: HTMLImageElement;

  //TODO don't pass all options to this class
  constructor(options: RequiredOptions) {
    this._element = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this._element.setAttribute("width", String(options.width));
    this._element.setAttribute("height", String(options.height));
    this._defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    this._element.appendChild(this._defs);

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

  clear(): void {
    this._element?.parentNode?.replaceChild(this._element.cloneNode(false), this._element);
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
    const element = this._element;
    const options = this._options;

    if (element) {
      if (options.backgroundOptions.gradient) {
        const gradientOptions = options.backgroundOptions.gradient;

        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("width", "100%");
        rect.setAttribute("height", "100%");
        rect.setAttribute("fill", "url('#background-gradient')");

        const gradient = this._createGradient({
          options: gradientOptions,
          additionalRotation: 0,
          x: 0,
          y: 0,
          size: options.width > options.height ? options.width : options.height,
          name: "background-gradient"
        });

        this._defs.appendChild(gradient);

        gradientOptions.colorStops.forEach(({ offset, color }: { offset: number; color: string }) => {
          const stop = document.createElementNS("http://www.w3.org/2000/svg", "stop");
          stop.setAttribute("offset", `${100 * offset}%`);
          stop.setAttribute("stop-color", color);
          gradient.appendChild(stop);
        });
        this._element.appendChild(rect);
      } else if (options.backgroundOptions.color) {
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("width", "100%");
        rect.setAttribute("height", "100%");
        rect.setAttribute("fill", options.backgroundOptions.color);
        this._element.appendChild(rect);
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
    const dotSize = Math.floor(minSize / count);
    const xBeginning = Math.floor((options.width - count * dotSize) / 2);
    const yBeginning = Math.floor((options.height - count * dotSize) / 2);
    const dot = new QRDot({ svg: this._element, type: options.dotsOptions.type });

    for (let i = 0; i < count; i++) {
      for (let j = 0; j < count; j++) {
        if (filter && !filter(i, j)) {
          continue;
        }
        if (!this._qr?.isDark(i, j)) {
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

        if (options.dotsOptions?.gradient) {
          dot._element?.setAttribute("fill", "url('#dot-gradient')");
        } else {
          dot._element?.setAttribute("fill", options.dotsOptions.color);
        }

        if (dot._element) {
          this._element.appendChild(dot._element);
        }
      }
    }

    if (options.dotsOptions?.gradient) {
      const gradientOptions = options.dotsOptions.gradient;
      const gradient = this._createGradient({
        options: gradientOptions,
        additionalRotation: 0,
        x: xBeginning,
        y: yBeginning,
        size: count * dotSize,
        name: "dot-gradient"
      });

      this._defs.appendChild(gradient);

      gradientOptions.colorStops.forEach(({ offset, color }: { offset: number; color: string }) => {
        const stop = document.createElementNS("http://www.w3.org/2000/svg", "stop");
        stop.setAttribute("offset", `${100 * offset}%`);
        stop.setAttribute("stop-color", color);
        gradient.appendChild(stop);
      });
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
      const x = xBeginning + column * dotSize * (count - 7);
      const y = yBeginning + row * dotSize * (count - 7);

      if (options.cornersSquareOptions?.type) {
        const cornersSquare = new QRCornerSquare({ svg: this._element, type: options.cornersSquareOptions.type });

        cornersSquare.draw(x, y, cornersSquareSize, rotation);

        if (options.cornersSquareOptions?.gradient) {
          cornersSquare._element?.setAttribute("fill", `url('#corner-square-gradient-${column}-${row}')`);
        } else if (options.cornersSquareOptions?.color) {
          cornersSquare._element?.setAttribute("fill", options.cornersSquareOptions.color);
        } else if (options.dotsOptions?.gradient) {
          cornersSquare._element?.setAttribute("fill", "url('#dot-gradient')");
        } else {
          cornersSquare._element?.setAttribute("fill", options.dotsOptions.color);
        }
        if (cornersSquare._element) {
          this._element.appendChild(cornersSquare._element);
        }
      } else {
        const dot = new QRDot({ svg: this._element, type: options.dotsOptions.type });

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

            if (options.cornersSquareOptions?.gradient) {
              dot._element?.setAttribute("fill", `url('#corner-square-gradient-${column}-${row}')`);
            } else if (options.cornersSquareOptions?.color) {
              dot._element?.setAttribute("fill", options.cornersSquareOptions.color);
            } else if (options.dotsOptions?.gradient) {
              dot._element?.setAttribute("fill", "url('#dot-gradient')");
            } else {
              dot._element?.setAttribute("fill", options.dotsOptions.color);
            }

            if (dot._element) {
              this._element.appendChild(dot._element);
            }
          }
        }
      }

      if (options.cornersSquareOptions?.gradient) {
        const gradientOptions = options.cornersSquareOptions.gradient;
        const gradient = this._createGradient({
          options: gradientOptions,
          additionalRotation: rotation,
          x,
          y,
          size: cornersSquareSize,
          name: `corner-square-gradient-${column}-${row}`
        });

        this._defs.appendChild(gradient);

        gradientOptions.colorStops.forEach(({ offset, color }: { offset: number; color: string }) => {
          const stop = document.createElementNS("http://www.w3.org/2000/svg", "stop");
          stop.setAttribute("offset", `${100 * offset}%`);
          stop.setAttribute("stop-color", color);
          gradient.appendChild(stop);
        });
      }

      if (options.cornersDotOptions?.type) {
        const cornersDot = new QRCornerDot({ svg: this._element, type: options.cornersDotOptions.type });

        cornersDot.draw(x + dotSize * 2, y + dotSize * 2, cornersDotSize, rotation);

        if (options.cornersDotOptions?.gradient) {
          cornersDot._element?.setAttribute("fill", `url('#corner-dot-gradient-${column}-${row}')`);
        } else if (options.cornersDotOptions?.color) {
          cornersDot._element?.setAttribute("fill", options.cornersDotOptions.color);
        } else if (options.cornersSquareOptions?.gradient) {
          cornersDot._element?.setAttribute("fill", `url('#corner-square-gradient-${column}-${row}')`);
        } else if (options.cornersSquareOptions?.color) {
          cornersDot._element?.setAttribute("fill", options.cornersSquareOptions.color);
        } else if (options.dotsOptions?.gradient) {
          cornersDot._element?.setAttribute("fill", "url('#dot-gradient')");
        } else {
          cornersDot._element?.setAttribute("fill", options.dotsOptions.color);
        }
        if (cornersDot._element) {
          this._element.appendChild(cornersDot._element);
        }
      } else {
        const dot = new QRDot({ svg: this._element, type: options.dotsOptions.type });

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

            if (options.cornersDotOptions?.gradient) {
              dot._element?.setAttribute("fill", `url('#corner-dot-gradient-${column}-${row}')`);
            } else if (options.cornersDotOptions?.color) {
              dot._element?.setAttribute("fill", options.cornersDotOptions.color);
            } else if (options.cornersSquareOptions?.gradient) {
              dot._element?.setAttribute("fill", `url('#corner-square-gradient-${column}-${row}')`);
            } else if (options.cornersSquareOptions?.color) {
              dot._element?.setAttribute("fill", options.cornersSquareOptions.color);
            } else if (options.dotsOptions?.gradient) {
              dot._element?.setAttribute("fill", "url('#dot-gradient')");
            } else {
              dot._element?.setAttribute("fill", options.dotsOptions.color);
            }

            if (dot._element) {
              this._element.appendChild(dot._element);
            }
          }
        }
      }

      if (options.cornersDotOptions?.gradient) {
        const gradientOptions = options.cornersDotOptions.gradient;
        const gradient = this._createGradient({
          options: gradientOptions,
          additionalRotation: rotation,
          x: x + dotSize * 2,
          y: y + dotSize * 2,
          size: cornersDotSize,
          name: `corner-dot-gradient-${column}-${row}`
        });

        this._defs.appendChild(gradient);

        gradientOptions.colorStops.forEach(({ offset, color }: { offset: number; color: string }) => {
          const stop = document.createElementNS("http://www.w3.org/2000/svg", "stop");
          stop.setAttribute("offset", `${100 * offset}%`);
          stop.setAttribute("stop-color", color);
          gradient.appendChild(stop);
        });
      }
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

    const image = document.createElementNS("http://www.w3.org/2000/svg", "image");
    image.setAttribute("href", options.image || "");
    image.setAttribute("x", String(dx));
    image.setAttribute("y", String(dy));
    image.setAttribute("width", `${dw}px`);
    image.setAttribute("height", `${dh}px`);

    this._element.appendChild(image);
  }

  _createGradient({
    options,
    additionalRotation,
    x,
    y,
    size,
    name
  }: {
    options: Gradient;
    additionalRotation: number;
    x: number;
    y: number;
    size: number;
    name: string;
  }): SVGElement {
    let gradient;

    if (options.type === gradientTypes.radial) {
      gradient = document.createElementNS("http://www.w3.org/2000/svg", "radialGradient");
      gradient.setAttribute("id", name);
      gradient.setAttribute("gradientUnits", "userSpaceOnUse");
      gradient.setAttribute("fx", String(x + size / 2));
      gradient.setAttribute("fy", String(y + size / 2));
      gradient.setAttribute("cx", String(x + size / 2));
      gradient.setAttribute("cy", String(y + size / 2));
      gradient.setAttribute("r", String(size / 2));
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

      gradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
      gradient.setAttribute("id", name);
      gradient.setAttribute("gradientUnits", "userSpaceOnUse");
      gradient.setAttribute("x1", String(Math.round(x0)));
      gradient.setAttribute("y1", String(Math.round(y0)));
      gradient.setAttribute("x2", String(Math.round(x1)));
      gradient.setAttribute("y2", String(Math.round(y1)));
    }

    return gradient;
  }
}
