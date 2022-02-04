import fs from "fs";
import path from "path";
import qrcode from "qrcode-generator";
import QRCanvas from "./QRCanvas";
import modes from "../constants/modes";
import mergeDeep from "../tools/merge";
import defaultQRCodeStylingOptions from "./QROptions";

describe("Test QRCanvas class", () => {
  let qr;
  const defaultOptions = mergeDeep(defaultQRCodeStylingOptions, {
    width: 100,
    height: 100,
    data: "TEST",
    qrOptions: {
      mode: modes.alphanumeric
    }
  });
  const defaultImage =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAQAAAAnOwc2AAAAEUlEQVR42mNk+M+AARiHsiAAcCIKAYwFoQ8AAAAASUVORK5CYII=";

  beforeAll(() => {
    qr = qrcode(defaultOptions.qrOptions.typeNumber, defaultOptions.qrOptions.errorCorrectionLevel);
    qr.addData(defaultOptions.data, defaultOptions.qrOptions.mode);
    qr.make();
  });

  it("Should draw simple qr code", () => {
    const expectedQRCodeFile = fs.readFileSync(path.resolve(__dirname, "../assets/test/simple_qr.png"), "base64");
    const canvas = new QRCanvas(defaultOptions);

    canvas.drawQR(qr);
    expect(canvas.getCanvas().toDataURL()).toEqual(expect.stringContaining(expectedQRCodeFile));
  });
  it("Should draw a qr code with image", (done) => {
    const expectedQRCodeFile = fs.readFileSync(
      path.resolve(__dirname, "../assets/test/simple_qr_with_image.png"),
      "base64"
    );
    const canvas = new QRCanvas({
      ...defaultOptions,
      image: defaultImage
    });
    canvas.drawQR(qr);
    //TODO remove setTimout
    setTimeout(() => {
      canvas._image.onload();
      expect(canvas.getCanvas().toDataURL()).toEqual(expect.stringContaining(expectedQRCodeFile));
      done();
    });
  });
  it("Should draw a qr code with image margin", (done) => {
    const expectedQRCodeFile = fs.readFileSync(
      path.resolve(__dirname, "../assets/test/simple_qr_with_image_margin.png"),
      "base64"
    );
    const canvas = new QRCanvas({
      ...defaultOptions,
      image: defaultImage,
      imageOptions: {
        ...defaultOptions.imageOptions,
        margin: 2
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
  it("Should draw a qr code with image without dots hiding", (done) => {
    const expectedQRCodeFile = fs.readFileSync(
      path.resolve(__dirname, "../assets/test/simple_qr_with_image.png"),
      "base64"
    );
    const canvas = new QRCanvas({
      ...defaultOptions,
      image: defaultImage,
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
  it("Should draw a qr code with margin around canvas", () => {
    const expectedQRCodeFile = fs.readFileSync(
      path.resolve(__dirname, "../assets/test/simple_qr_with_margin_canvas.png"),
      "base64"
    );
    const canvas = new QRCanvas({
      ...defaultOptions,
      margin: 20
    });
    canvas.drawQR(qr);
    expect(canvas.getCanvas().toDataURL()).toEqual(expect.stringContaining(expectedQRCodeFile));
  });
});
