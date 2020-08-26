import { ErrorCorrectLevel } from "qrcode-generator-ts";
import { Mode } from "qrcode-generator-ts/js/qrcode/Mode";
import { QRData } from "qrcode-generator-ts/js/qrcode/QRData";

export type Options = {
  width: number;
  height: number;
  data?: QRData | string;
  image?: string;
  qrOptions: {
    typeNumber: number;
    mode?: Mode;
    errorCorrectionLevel: ErrorCorrectLevel;
  };
  imageOptions: {
    hideBackgroundDots: boolean;
    imageSize: number;
    crossOrigin?: string;
  };
  dotsOptions: {
    type: DotType;
    color: string;
  };
  eyeFramesOptions: {
    type: EyeFrameType;
    color: string;
  };
  eyeBallsOptions: {
    type: EyeBallType;
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
    typeNumber: 0,
    mode: undefined,
    errorCorrectionLevel: ErrorCorrectLevel.Q
  },
  imageOptions: {
    hideBackgroundDots: true,
    imageSize: 0.4,
    crossOrigin: undefined
  },
  dotsOptions: {
    type: "square",
    color: "#000"
  },
  eyeFramesOptions: {
    type: 0,
    color: "#000"
  },
  eyeBallsOptions: {
    type: 0,
    color: "#000"
  },
  backgroundOptions: {
    color: "#fff"
  }
};

export default defaultOptions;
