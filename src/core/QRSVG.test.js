import qrcode from "qrcode-generator";
import QRSVG from "./QRSVG";
import defaultOptions from "./QROptions";

describe("Circular QR codes", () => {
  it.each([
    [300, 300, 0, false],
    [400, 400, 100, false],
    [320, 240, 10, false],
    [300, 300, 0, true]
  ])("renders at %i x %i with margin %i and roundSize %s", async (width, height, margin, roundSize) => {
    const qr = qrcode(0, "Q");
    qr.addData("https://example.com");
    qr.make();

    const svg = new QRSVG(
      {
        ...defaultOptions,
        width,
        height,
        margin,
        shape: "circle",
        dotsOptions: { ...defaultOptions.dotsOptions, roundSize }
      },
      window
    );

    await expect(svg.drawQR(qr)).resolves.toBeUndefined();
    expect(svg._dotsClipPath.children.length).toBeGreaterThan(0);
    expect(svg.getElement().outerHTML).not.toMatch(/NaN|Infinity/);
  });
});
