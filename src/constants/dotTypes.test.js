import dotTypes from "./dotTypes";

describe("Dot Types", () => {
  it("The export of the module should be an object", () => {
    expect(typeof dotTypes).toBe("object");
  });

  it.each(Object.values(dotTypes))("Values should be strings", value => {
    expect(typeof value).toBe("string");
  });

  it.each(Object.keys(dotTypes))("A key of the object should be the same as a value", key => {
    expect(key).toBe(dotTypes[key]);
  });
});
