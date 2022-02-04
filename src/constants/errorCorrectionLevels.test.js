import errorCorrectionLevels from "./errorCorrectionLevels";

describe("Error Correction Levels", () => {
  it("The export of the module should be an object", () => {
    expect(typeof errorCorrectionLevels).toBe("object");
  });

  it.each(Object.values(errorCorrectionLevels))("Values should be strings", (value) => {
    expect(typeof value).toBe("string");
  });

  it.each(Object.keys(errorCorrectionLevels))("A key of the object should be the same as a value", (key) => {
    expect(key).toBe(errorCorrectionLevels[key]);
  });

  it.each(Object.keys(errorCorrectionLevels))("Allowed only particular keys", (key) => {
    expect(["L", "M", "Q", "H"]).toContain(key);
  });
});
