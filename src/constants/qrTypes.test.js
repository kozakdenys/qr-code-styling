import qrTypes from "./qrTypes";

describe("QR Types", () => {
  it("The export of the module should be an object", () => {
    expect(typeof qrTypes).toBe("object");
  });

  it.each(Object.values(qrTypes))("Values should be number", (value) => {
    expect(typeof value).toBe("number");
  });

  it.each(Object.keys(qrTypes))("A key of the object should be the same as a value", (key) => {
    expect(key).toBe(qrTypes[key].toString());
  });

  it("The object should contain 41 keys", () => {
    expect(Object.keys(qrTypes).length).toBe(41);
  });
});
