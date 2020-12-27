import mergeDeep from "./merge";

describe("Test getMode function", () => {
  const simpleObject = {
    str: "foo"
  };

  const objectWithArray = {
    arr: [1, 2]
  };

  const nestedObject = {
    obj: {
      foo: "foo"
    }
  };

  const nestedObjectWithArray = {
    obj: {
      arr: [1, 2]
    }
  };

  it("Merge two objects", () => {
    expect(mergeDeep(simpleObject, { str: "bar" })).toEqual({ str: "bar" });
  });
  it("Merge two objects with arrays", () => {
    expect(mergeDeep(objectWithArray, { arr: [3, 4] })).toEqual({ arr: [3, 4] });
  });
  it("Merge two objects with nested objects", () => {
    expect(mergeDeep(nestedObject, { obj: { bar: "bar" } })).toEqual({ obj: { foo: "foo", bar: "bar" } });
  });
  it("Merge three objects with nested objects", () => {
    expect(mergeDeep(nestedObjectWithArray, nestedObject, { obj: { arr: [3, 4] } })).toEqual({
      obj: {
        foo: "foo",
        arr: [3, 4]
      }
    });
  });
  it("Don't mutate target", () => {
    const target = {
      str: "foo"
    };

    expect(mergeDeep(target, { str: "bar" })).not.toBe(target);
  });
  it("Skip undefined sources", () => {
    expect(mergeDeep(simpleObject, undefined)).toBe(simpleObject);
  });
  it("Skip undefined sources dfs", () => {
    const simpleArray = [1, 2];

    expect(mergeDeep(simpleArray, [3, 4])).toEqual(simpleArray);
  });
});
