import fs from "fs";
import path from "path";
import qrcode from "qrcode-generator";
import QRCanvas from "./QRCanvas";
import qrTypes from "../constants/qrTypes";
import errorCorrectionLevels from "../constants/errorCorrectionLevels";
import modes from "../constants/modes";

describe("Test QRCanvas class", () => {
  let qr;
  const defaultOptions = {
    width: 100,
    height: 100,
    qrOptions: {
      typeNumber: qrTypes[0],
      errorCorrectionLevel: errorCorrectionLevels.Q
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.4
    },
    dotsOptions: {
      type: "square",
      color: "#000"
    },
    backgroundOptions: {
      color: "#fff"
    }
  };

  beforeAll(() => {
    qr = qrcode(defaultOptions.qrOptions.typeNumber, defaultOptions.qrOptions.errorCorrectionLevel);
    qr.addData("TEST", modes.alphanumeric);
    qr.make();
  });

  it("Should draw simple qr code", () => {
    const expectedQRCodeFile = fs.readFileSync(path.resolve(__dirname, "../assets/test/simple_qr.png"), "base64");
    const canvas = new QRCanvas(defaultOptions);

    canvas.drawQR(qr);
    expect(canvas.getCanvas().toDataURL()).toEqual(expect.stringContaining(expectedQRCodeFile));
  });
  it("Should draw a qr code with image", done => {
    const expectedQRCodeFile = fs.readFileSync(
      path.resolve(__dirname, "../assets/test/simple_qr_with_image.png"),
      "base64"
    );
    const canvas = new QRCanvas({
      ...defaultOptions,
      image:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAQAAAAnOwc2AAAAEUlEQVR42mNk+M+AARiHsiAAcCIKAYwFoQ8AAAAASUVORK5CYII="
    });
    canvas.drawQR(qr);
    //TODO remove setTimout
    setTimeout(() => {
      canvas._image.onload();
      expect(canvas.getCanvas().toDataURL()).toEqual(expect.stringContaining(expectedQRCodeFile));
      done();
    });
  });
  it("Should draw a qr code with image without dots hiding", done => {
    const expectedQRCodeFile = fs.readFileSync(
      path.resolve(__dirname, "../assets/test/simple_qr_with_image.png"),
      "base64"
    );
    const canvas = new QRCanvas({
      ...defaultOptions,
      image:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAQAAAAnOwc2AAAAEUlEQVR42mNk+M+AARiHsiAAcCIKAYwFoQ8AAAAASUVORK5CYII=",
      imageOptions: {
        ...defaultOptions.imageOptions,
        hideBackgroundDots: false
      }
    });
    canvas.drawQR(qr);
    //TODO remove setTimout
    setTimeout(() => {
      canvas._image.onload();
      expect(canvas.getCanvas().toDataURL()).toEqual(expect.stringContaining(expectedQRCodeFile));
      done();
    });
  });
});
