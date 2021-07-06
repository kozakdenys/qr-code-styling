import qrTypes from "../constants/qrTypes";
import drawTypes from "../constants/drawTypes";
import shapeTypes from "../constants/shapeTypes";
import errorCorrectionLevels from "../constants/errorCorrectionLevels";
import { ShapeType, DotType, Options, TypeNumber, ErrorCorrectionLevel, Mode, DrawType, Gradient } from "../types";

export interface RequiredOptions extends Options {
  type: DrawType;
  shape: ShapeType;
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
    round: number;
    color: string;
    gradient?: Gradient;
  };
}

const defaultOptions: RequiredOptions = {
  type: drawTypes.canvas,
  shape: shapeTypes.square,
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
    round: 0,
    color: "#fff"
  }
};

export default defaultOptions;
