import qrcode from "qrcode-generator";

function guessImageSizeForSide ({ imageWidth, imageHeight, maxPixelsHide, pixelSize, side }) {
    let m, n, y, h;
    const k = imageHeight / imageWidth;
    const S = maxPixelsHide;
    const l = pixelSize;

    if (side === "x") {
        m = Math.floor(Math.sqrt(S / k));
        if (m % 2 === 0) {
            m--;
        }
        y = m * l;
        n = 1 + 2 * Math.ceil((m * k * l - l) / (2 * l));
        h = Math.ceil(y * k);
    } else {
        n = Math.floor(Math.sqrt(S * k));
        if (n % 2 === 0) {
            n--;
        }
        h = n * l;
        m = 1 + 2 * Math.ceil((n * l / k - l) / (2 * l));
        y = Math.ceil(h / k);
    }

    return { hiddenPixelsWidth: m, hiddenPixelsHeight: n, imageResizedWidth: y, imageResizedHeight: h };
}

function calculateImageSize (props) {
    const v1 = guessImageSizeForSide({ ...props, side: "x"});
    const v2 = guessImageSizeForSide({ ...props, side: "y"});

    if (v1.imageResizedWidth >= v2.imageResizedWidth) {
        return v1;
    } else {
        return v2;
    }
}

export default class QrCodeStyling {
    constructor(options) {
        const typeNumber = 4;
        const errorCorrectionLevel = "H";

        this.qr = qrcode(typeNumber, errorCorrectionLevel);
        this.qr.addData(options.data);
        this.qr.make();

        const count = this.qr.getModuleCount();
        const arr = [];

        for(let i = 0; i < count;  i++) {
            if (!arr[i]) {
                arr[i] = [];
            }
            for(let j = 0; j < count;  j++) {
                arr[i][j] = this.qr.isDark(i, j) ? 1: 0;
            }
        }

        const baseImage = new Image();

        this.canvas = document.createElement("canvas");

        this.canvas.width = options.width;
        this.canvas.height = options.height;

        const generatedCanvas = this.canvas.getContext("2d");
        const minSize = Math.min(options.width, options.height);
        const pixelSize = Math.floor(minSize / count);
        const xBeginning = Math.floor((options.width - count * pixelSize) / 2);
        const yBeginning = Math.floor((options.height - count * pixelSize) / 2);
        const coverLevel = 0.2;

        baseImage.src = options.image;
        baseImage.onload = () => {
            const maxPixelsHide = Math.floor(coverLevel * count * count);
            const result = calculateImageSize({
                imageWidth: baseImage.width,
                imageHeight: baseImage.height,
                maxPixelsHide,
                pixelSize
            });

            generatedCanvas.drawImage(
                baseImage,
                xBeginning + (count * pixelSize - result.imageResizedWidth) / 2,
                yBeginning + (count * pixelSize - result.imageResizedHeight) / 2,
                result.imageResizedWidth,
                result.imageResizedHeight);

            for(let i = 0; i < count;  i++) {
                for(let j = 0; j < count;  j++) {
                    if (
                        i >= (count - result.hiddenPixelsWidth) / 2
                        && i < (count + result.hiddenPixelsWidth) / 2
                        && j >= (count - result.hiddenPixelsHeight) / 2
                        && j < (count + result.hiddenPixelsHeight) / 2
                    ) {
                        continue;
                    }

                    if (this.qr.isDark(i, j)) {
                        generatedCanvas.fillRect (xBeginning + i * pixelSize, yBeginning + j * pixelSize, pixelSize, pixelSize);
                    }
                }
            }
        };
    }

    append(selector) {
        if (!selector) {
            throw "'selector' is required";
        }

        if (selector[0] === ".") {
            const elements = document.getElementsByClassName(selector.substr(1));

            if (elements && elements.length) {
                elements[0].appendChild(this.canvas);
            } else {
                throw "element is not found";
            }
        } else if (selector[0] === "#") {
            const element = document.getElementById(selector.substr(1));

            if (element) {
                element.appendChild(this.canvas);
            } else {
                throw "element is not found";
            }
        } else {
            throw "unknown selector";
        }
    }
};