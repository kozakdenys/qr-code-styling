import qrTypes from "../constants/qrTypes";
import errorCorrectionLevels from "../constants/errorCorrectionLevels";
import {
  DotType,
  GradientType,
  CornerSquareType,
  CornerDotType,
  TypeNumber,
  ErrorCorrectionLevel,
  Mode
} from "../types";

export type Gradient = {
  type: GradientType;
  rotation?: number;
  colorStops: {
    offset: number;
    color: string;
  }[];
};

export type Options = {
  width?: number;
  height?: number;
  data?: string;
  image?: string;
  qrOptions?: {
    typeNumber?: TypeNumber;
    mode?: Mode;
    errorCorrectionLevel?: ErrorCorrectionLevel;
  };
  imageOptions?: {
    hideBackgroundDots?: boolean;
    imageSize?: number;
    crossOrigin?: string;
    margin?: number;
  };
  dotsOptions?: {
    type?: DotType;
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
  backgroundOptions?: {
    color?: string;
    gradient?: Gradient;
  };
};

export interface RequiredOptions extends Options {
  width: number;
  height: number;
  margin: number;
  data: string;
  qrOptions: {
    typeNumber: TypeNumber;
    mode?: Mode;
    errorCorrectionLevel: ErrorCorrectionLevel;
  };
  imageOptions: {
    hideBackgroundDots: boolean;
    imageSize: number;
    crossOrigin?: string;
    margin: number;
  };
  dotsOptions: {
    type: DotType;
    color: string;
    gradient?: Gradient;
  };
  backgroundOptions: {
    color: string;
    gradient?: Gradient;
  };
}

const defaultOptions: RequiredOptions = {
  width: 300,
  height: 300,
  data: "",
  margin: 0,
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
