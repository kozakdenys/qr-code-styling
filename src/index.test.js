import * as index from "./index";

describe("Index", () => {
  it.each(["dotTypes", "errorCorrectionLevels", "errorCorrectionPercents", "modes", "qrTypes", "default"])(
    "The module should export certain submodules",
    (moduleName) => {
      expect(Object.keys(index)).toContain(moduleName);
    }
  );
});
