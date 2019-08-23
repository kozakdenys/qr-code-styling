import QrCodeStyling from "qr-code-styling";
import logo from "./assets/fb_logo_resized.png";

const qrCode = new QrCodeStyling({
    width: 300,
    height: 300,
    data: "Hello!",
    image: logo
});

qrCode.append("#canvas");