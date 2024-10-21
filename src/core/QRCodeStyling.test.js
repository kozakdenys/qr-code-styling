import QRCodeStyling from "./QRCodeStyling";
import fs from "fs";
import path from "path";
import nodeCanvas from "canvas";
import { JSDOM } from "jsdom";

describe("Test QRCodeStyling class", () => {
  beforeAll(() => {
    document.body.innerHTML = "<div id='container'></div>";
  });

  it("The README example should work correctly", () => {
    const expectedQRCodeFile = fs.readFileSync(
      path.resolve(__dirname, "../assets/test/image_from_readme.png"),
      "base64"
    );
    const qrCode = new QRCodeStyling({
      width: 300,
      height: 300,
      data: "TEST",
      image:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAQAAAAnOwc2AAAAEUlEQVR42mNk+M+AARiHsiAAcCIKAYwFoQ8AAAAASUVORK5CYII=",
      dotsOptions: {
        color: "#4267b2",
        type: "rounded"
      },
      backgroundOptions: {
        color: "#e9ebee"
      }
    });
    document.body.innerHTML = "<div id='container'></div>";

    const container = document.getElementById("container");

    qrCode.append(container);

    return qrCode._getElement().then((element) => {
      expect(element.toDataURL()).toEqual(expect.stringContaining(expectedQRCodeFile));
    });
  });

  it("Compatible with node-canvas", () =>
    new Promise((done) => {
      const expectedQRCodeFile = fs.readFileSync(
        path.resolve(__dirname, "../assets/test/image_from_readme.png"),
        "base64"
      );
      const qrCode = new QRCodeStyling({
        nodeCanvas,
        width: 300,
        height: 300,
        data: "TEST",
        image:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAQAAAAnOwc2AAAAEUlEQVR42mNk+M+AARiHsiAAcCIKAYwFoQ8AAAAASUVORK5CYII=",
        dotsOptions: {
          color: "#4267b2",
          type: "rounded"
        },
        backgroundOptions: {
          color: "#e9ebee"
        }
      });
      qrCode.getRawData("png").then((buffer) => {
        const uri = `data:image/png;base64,${buffer.toString("base64")}`;
        expect(uri).toEqual(expect.stringContaining(expectedQRCodeFile));
        done();
      });
    }));

  it("Compatible with jsdom", () =>
    new Promise((done) => {
      const expectedQRCodeFile = fs.readFileSync(
        path.resolve(__dirname, "../assets/test/image_from_readme.svg"),
        "base64"
      );
      const qrCode = new QRCodeStyling({
        jsdom: JSDOM,
        type: "svg",
        width: 300,
        height: 300,
        data: "TEST",
        image:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAQAAAAnOwc2AAAAEUlEQVR42mNk+M+AARiHsiAAcCIKAYwFoQ8AAAAASUVORK5CYII=",
        dotsOptions: {
          color: "#4267b2",
          type: "rounded"
        },
        backgroundOptions: {
          color: "#e9ebee"
        },
        imageOptions: {
          saveAsBlob: false
        }
      });
      qrCode.getRawData("svg").then((buffer) => {
        const svgString = buffer.toString("base64");
        expect(svgString).toEqual(expect.stringContaining(expectedQRCodeFile));
        done();
      });
    }));
});
