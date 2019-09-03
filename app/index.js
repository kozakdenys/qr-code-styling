import QrCodeStyling from "qr-code-styling";
import logo from "./assets/fb_logo.png";

const qrCode = new QrCodeStyling({
    width: 300,
    height: 300,
    data: "https://www.facebook.com/",
    image: logo,
    qrOptions: {
        // typeNumber: 10,
        // errorCorrectionLevel: "H",
    },
    imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.4
    },
    dotsOptions: {
        colour: "#4267b2",
        style: "dots"
    },
    backgroundOptions: {
        colour: "#e9ebee",
    }
});

qrCode.append(document.getElementById("canvas"));