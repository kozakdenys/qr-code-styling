import QRCodeStyling from "./QRCodeStyling";
import fs from "fs";
import path from "path";

describe("Test QRCodeStyling class", () => {
  beforeAll(() => {
    global.document.body.innerHTML = "<div id='container'></div>";
  });

  it("The README example should work correctly", (done) => {
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
    global.document.body.innerHTML = "<div id='container'></div>";

    const container = global.document.getElementById("container");

    qrCode.append(container);
    //TODO remove setTimout
    setTimeout(() => {
      expect(qrCode._canvas.getCanvas().toDataURL()).toEqual(expect.stringContaining(expectedQRCodeFile));
      done();
    });
  });
});
