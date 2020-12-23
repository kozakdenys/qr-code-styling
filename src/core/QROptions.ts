import qrTypes from "../constants/qrTypes";
import errorCorrectionLevels from "../constants/errorCorrectionLevels";

export type Gradient = {
  start: {
    x: number;
    y: number;
  };
  end: {
    x: number;
    y: number;
  };
  colorStops: {
    offset: number;
    color: string;
  }[];
};

export type Options = {
  width: number;
  height: number;
  data?: string;
  image?: string;
  qrOptions: {
    typeNumber: TypeNumber;
    mode?: Mode;
    errorCorrectionLevel: ErrorCorrectionLevel;
  };
  imageOptions: {
    hideBackgroundDots: boolean;
    imageSize: number;
    margin: number;
    crossOrigin?: string;
  };
  dotsOptions: {
    type: DotType;
    color?: string;
    gradient?: Gradient;
  };
  cornersSquareOptions?: {
    type?: CornerSquareType;
    color?: string;
    gradient?: Gradient;
  };
  cornersDotOptions?: {
    type?: CornerDotType;
    color?: string;
    gradient?: Gradient;
  };
  backgroundOptions: {
    color?: string;
    gradient?: Gradient;
  };
};

const defaultOptions: Options = {
  width: 300,
  height: 300,
  data: undefined,
  image: undefined,
  qrOptions: {
    typeNumber: qrTypes[0],
    mode: undefined,
    errorCorrectionLevel: errorCorrectionLevels.Q
  },
  imageOptions: {
    hideBackgroundDots: true,
    imageSize: 0.4,
    crossOrigin: undefined,
    margin: 0
  },
  dotsOptions: {
    type: "square",
    color: "#000"
  },
  backgroundOptions: {
    color: "#fff"
  }
};

export default defaultOptions;
