import getMode from "../tools/getMode";
import mergeDeep from "../tools/merge";
import errorCorrectLevels from "../constants/errorCorrectLevels";
import types from "../constants/types";
import QRCode from "./QRCode";
import QRCanvas from "./QRCanvas";

const defaultOptions = {
    width: 300,
    height: 300,
    data: undefined,
    image: undefined,
    qrOptions: {
        typeNumber: types[0],
        mode: undefined,
        errorCorrectionLevel: errorCorrectLevels.Q,
    },
    imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.4
    },
    dotsOptions: {
        type: "square",
        colour: "#000",
    },
    backgroundOptions: {
        colour: "#fff",
    }
};

export default class QRCodeStyling {
    constructor(options) {
        this.options = mergeDeep(defaultOptions, options);
        this.update();
    }

    update(options) {
        this.clearContainer(this.container);
        this.options = mergeDeep(this.options, options);

        if (!this.options.data) {
            return;
        }

        this.qr = new QRCode(this.options);
        this.qr.addData(this.options.data, this.options.qrOptions.mode || getMode(this.options.data));
        this.qr.make();
        this.canvas = new QRCanvas(this.options);
        this.canvas.drawQR(this.qr);
        this.append(this.container);
    }

    clearContainer(container) {
        if (container) {
            container.innerHTML = "";
        }
    }

    append(container) {
        if (!container) {
            return;
        }

        if (typeof container.appendChild !== "function") {
            throw "Container should be a single DOM node";
        }

        this.container = container;

        container.appendChild(this.canvas.getCanvas());
    }
};