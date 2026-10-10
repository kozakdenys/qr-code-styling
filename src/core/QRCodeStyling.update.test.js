import QRCodeStyling from "./QRCodeStyling";
import nodeCanvas from "canvas";
import { JSDOM } from "jsdom";

async function pngData(qrCode) {
  const data = await qrCode.getRawData("png");
  if (Buffer.isBuffer(data)) return data.toString("base64");
  return Buffer.from(await data.arrayBuffer()).toString("base64");
}

describe("Raster exports after update", () => {
  it.each([
    ["browser", "svg"],
    ["browser", "canvas"],
    ["node", "svg"],
    ["node", "canvas"]
  ])("exports current data in %s after updating from %s to svg", async (environment, type) => {
    const options = {
      ...(environment === "node" ? { nodeCanvas, jsdom: JSDOM } : {}),
      type,
      data: "https://example.com/old"
    };
    const qrCode = new QRCodeStyling(options);
    const before = await pngData(qrCode);

    const update = { type: "svg", data: "https://example.com/new", width: 240, height: 240 };
    qrCode.update(update);

    const after = await pngData(qrCode);
    const fresh = await pngData(new QRCodeStyling({ ...options, ...update }));
    expect(after === before).toBe(false);
    expect(after === fresh).toBe(true);
  });
});
