import qrTypes from "../constants/qrTypes";
import errorCorrectLevels from "../constants/errorCorrectLevels";

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
  };
  dotsOptions: {
    type: DotType;
    color: string;
  };
  backgroundOptions: {
    color: string;
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
    errorCorrectionLevel: errorCorrectLevels.Q
  },
  imageOptions: {
    hideBackgroundDots: true,
    imageSize: 0.4
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
