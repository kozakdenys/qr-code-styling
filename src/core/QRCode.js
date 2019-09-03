import qrcode from "qrcode-generator";

export default class QRCode extends qrcode {
    constructor(options) {
        super(options.qrOptions.typeNumber, options.qrOptions.errorCorrectionLevel);
    }
};