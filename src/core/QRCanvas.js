import calculateImageSize from "../tools/calculateImageSize";
import errorCorrectionPercents from "../constants/errorCorrectionPercents";
import QRDot from "./QRDot";

export default class QRCanvas {
    constructor(options) {
        this.canvas = document.createElement("canvas");
        this.canvas.width = options.width;
        this.canvas.height = options.height;
        this.options = options;
    }

    get context () {
        return this.canvas.getContext("2d");
    }

    get width () {
        return this.canvas.width;
    }

    get height () {
        return this.canvas.height;
    }

    getCanvas () {
        return this.canvas;
    }

    clear () {
        const canvasContext = this.context;

        canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawQR(qr) {
        this.clear();
        this.drawBackground();
        this.qr = qr;

        if (this.options.image) {
            this.drawImageAndDots();
        } else {
            this.drawDots();
        }
    }

    drawBackground() {
        const canvasContext = this.context;
        const options = this.options;

        canvasContext.fillStyle = options.backgroundOptions.colour;
        canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }


    drawDots(filter) {
        const canvasContext = this.context;
        const options = this.options;
        const count = this.qr.getModuleCount();
        const minSize = Math.min(options.width, options.height);
        const dotSize = Math.floor(minSize / count);
        const xBeginning = Math.floor((options.width - count * dotSize) / 2);
        const yBeginning = Math.floor((options.height - count * dotSize) / 2);

        if (count > options.width || count > options.height) {
            throw "The canvas is too small.";
        }

        const dot = new QRDot({ context: canvasContext, type: options.dotsOptions.type });

        for(let i = 0; i < count;  i++) {
            for(let j = 0; j < count;  j++) {
                if (filter && !filter(i, j)) {
                    continue;
                }

                if (this.qr.isDark(i, j)) {
                    canvasContext.fillStyle = options.dotsOptions.colour;
                    dot.draw(xBeginning + i * dotSize, yBeginning + j * dotSize, dotSize, (xOffset, yOffset) => {
                        if (i + xOffset >= 0 && j + yOffset >= 0 && i + xOffset < count && j + yOffset < count) {
                            if (filter && !filter(i + xOffset, j + yOffset)) return false;
                            return this.qr.isDark(i + xOffset, j + yOffset);
                        }
                    });
                }
            }
        }
    }

    drawImageAndDots() {
        const canvasContext = this.context;
        const options = this.options;
        const count = this.qr.getModuleCount();
        const minSize = Math.min(options.width, options.height);
        const dotSize = Math.floor(minSize / count);
        const xBeginning = Math.floor((options.width - count * dotSize) / 2);
        const yBeginning = Math.floor((options.height - count * dotSize) / 2);

        const image = new Image();
        const coverLevel = options.imageOptions.imageSize * errorCorrectionPercents[options.qrOptions.errorCorrectionLevel];

        image.src = options.image;
        image.onload = () => {
            const maxHiddenDots = Math.floor(coverLevel * count * count);
            const {
                resizedImageWidth,
                resizedImageHeight,
                hiddenDotsWidth,
                hiddenDotsHeight
            } = calculateImageSize({
                originalWidth: image.width,
                originalHeight: image.height,
                maxHiddenDots,
                dotSize
            });

            this.drawDots((i, j) => {
                if (!options.imageOptions.hideBackgroundDots) {
                    return true;
                }
                return (
                    i < (count - hiddenDotsWidth) / 2
                    || i >= (count + hiddenDotsWidth) / 2
                    || j < (count - hiddenDotsHeight) / 2
                    || j >= (count + hiddenDotsHeight) / 2
                )
            });

            canvasContext.drawImage(
                image,
                xBeginning + (count * dotSize - resizedImageWidth) / 2,
                yBeginning + (count * dotSize - resizedImageHeight) / 2,
                resizedImageWidth,
                resizedImageHeight);
        };
    }
};