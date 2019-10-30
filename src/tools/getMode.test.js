import getMode from "./getMode";
import modes from "../constants/modes";

describe("Test getMode function", () => {
  it("Return numeric mode if numbers is passed", () => {
    expect(getMode(123)).toBe(modes.numeric);
  });
  it("Return numeric mode if a string with numbers is passed", () => {
    expect(getMode("123")).toBe(modes.numeric);
  });
  it("Return alphanumeric mode if a string with particular symbols is passed", () => {
    expect(getMode("01ABCZ$%*+-./:01ABCZ$%*+-./:")).toBe(modes.alphanumeric);
  });
  it("Return byte mode if a string with all keyboard symbols is passed", () => {
    expect(getMode("01ABCZ./:!@#$%^&*()_+01ABCZ./:!@#$%^&*()_'+|\\")).toBe(modes.byte);
  });
  it("Return byte mode if a string with Cyrillic symbols is passed", () => {
    expect(getMode("абвАБВ")).toBe(modes.byte);
  });
});
