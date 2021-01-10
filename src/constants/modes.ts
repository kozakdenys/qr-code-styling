import { Mode } from "../types";

interface Modes {
  [key: string]: Mode;
}

export default {
  numeric: "Numeric",
  alphanumeric: "Alphanumeric",
  byte: "Byte",
  kanji: "Kanji"
} as Modes;
