interface UnknownObject {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

type DotType = "dots" | "small-dots" | "rounded" | "square";
type EyeFrameType = 0 | 1 | 2;
type EyeBallType = 0;
type Extension = "png" | "jpeg" | "webp";

interface DotTypes {
  [key: string]: DotType;
}
