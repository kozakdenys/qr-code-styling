import qrcode from "qrcode-generator";
import calculateImageSize from "./tools/calculateImageSize";
import { getDOMElement } from "./tools/domTools";
import getMode from "./tools/getMode";
import mergeDeep from "./tools/merge";
import errorCorrectLevels from "./constants/errorCorrectLevels";
import types from "./constants/types";
import errorCorrectionPercents from "./constants/errorCorrectionPercents";

const defaultProps = {
    width: 300,
    height: 300,
    qrOptions: {
        typeNumber: types[0],
        errorCorrectionLevel: errorCorrectLevels.L,
    },
    dotsOptions: {
        colour: "#000",
    },
    backgroundOptions: {
        colour: "#fff",
    }
};

const defaultImageProps = {
    qrOptions: {
        errorCorrectionLevel: errorCorrectLevels.Q,
    },
    imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.4
    }
};

export default class QrCodeStyling {
    constructor(options) {
        let mergedOptions;

        if (options.image) {
            mergedOptions = mergeDeep(defaultProps, defaultImageProps, options);
        } else {
            mergedOptions = mergeDeep(defaultProps, options);
        }
        this.initialOptions = mergedOptions;
        this.qr = qrcode(mergedOptions.qrOptions.typeNumber, mergedOptions.qrOptions.errorCorrectionLevel);
        this.canvas = document.createElement("canvas");
        this.canvas.width = mergedOptions.width;
        this.canvas.height = mergedOptions.height;

        if (mergedOptions.data) {
            this.addData(mergedOptions.data, mergedOptions.qrOptions.mode);
        }
    }

    addData(data, mode) {
        this.qr.addData(data, mode || getMode(data));
        this.qr.make();
        this.drawQR();
    }

    drawQR() {
        const options = this.initialOptions;

        this.drawBackground();

        if (options.image) {
            this.drawImageAndDots();
        } else {
            this.drawDots();
        }
    }

    drawBackground() {
        const canvasContext = this.canvas.getContext("2d");
        const options = this.initialOptions;

        canvasContext.fillStyle = options.backgroundOptions.colour;
        canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }


    drawDots(filter) {
        const canvasContext = this.canvas.getContext("2d");
        const options = this.initialOptions;
        const count = this.qr.getModuleCount();
        const minSize = Math.min(options.width, options.height);
        const dotSize = Math.floor(minSize / count);
        const xBeginning = Math.floor((options.width - count * dotSize) / 2);
        const yBeginning = Math.floor((options.height - count * dotSize) / 2);

        if (count > options.width || count > options.height) {
            throw "The canvas is too small.";
        }

        for(let i = 0; i < count;  i++) {
            for(let j = 0; j < count;  j++) {
                if (filter && !filter(i, j)) {
                    continue;
                }

                if (this.qr.isDark(i, j)) {
                    canvasContext.fillStyle = options.dotsOptions.colour;
                    this.drawDot(xBeginning + i * dotSize, yBeginning + j * dotSize, dotSize);
                }
            }
        }
    }

    drawDot(x, y, size) {
        const canvasContext = this.canvas.getContext("2d");
        const options = this.initialOptions;

        if (options.dotsOptions.style === "dots") {
            canvasContext.beginPath();
            canvasContext.arc(x + size / 2, y + size / 2,size / 2,0,Math.PI*2,true);
            canvasContext.fill();
        } else {
            canvasContext.fillRect(x, y, size, size);
        }
    }

    drawImageAndDots() {
        const canvasContext = this.canvas.getContext("2d");
        const options = this.initialOptions;
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

    append(selector) {
        getDOMElement(selector).appendChild(this.canvas);
    }
};