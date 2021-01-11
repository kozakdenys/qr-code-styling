import QROptions from "./QROptions";

describe("Test default QROptions", () => {
  it("The export of the module should be an object", () => {
    expect(typeof QROptions).toBe("object");
  });

  describe("Test the content of options", () => {
    const optionsKeys = [
      "width",
      "height",
      "data",
      "margin",
      "qrOptions",
      "imageOptions",
      "dotsOptions",
      "backgroundOptions"
    ];
    it.each(optionsKeys)("The options should contain particular keys", (key) => {
      expect(Object.keys(QROptions)).toContain(key);
    });
  });
});
