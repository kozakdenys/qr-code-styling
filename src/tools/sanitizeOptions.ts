import { RequiredOptions } from "../core/QROptions";
import { Gradient } from "../types";

function sanitizeGradient(gradient: Gradient): Gradient {
  const newGradient = { ...gradient };

  if (!newGradient.colorStops || !newGradient.colorStops.length) {
    throw "Field 'colorStops' is required in gradient";
  }

  if (newGradient.rotation) {
    newGradient.rotation = Number(newGradient.rotation);
  } else {
    newGradient.rotation = 0;
  }

  newGradient.colorStops = newGradient.colorStops.map((colorStop: { offset: number; color: string }) => ({
    ...colorStop,
    offset: Number(colorStop.offset)
  }));

  return newGradient;
}

export default function sanitizeOptions(options: RequiredOptions): RequiredOptions {
  const newOptions = { ...options };

  newOptions.width = Number(newOptions.width);
  newOptions.height = Number(newOptions.height);
  newOptions.margin = Number(newOptions.margin);
  newOptions.imageOptions = {
    ...newOptions.imageOptions,
    hideBackgroundDots: Boolean(newOptions.imageOptions.hideBackgroundDots),
    imageSize: Number(newOptions.imageOptions.imageSize),
    margin: Number(newOptions.imageOptions.margin)
  };

  if (newOptions.margin > Math.min(newOptions.width, newOptions.height)) {
    newOptions.margin = Math.min(newOptions.width, newOptions.height);
  }

  newOptions.dotsOptions = {
    ...newOptions.dotsOptions
  };
  if (newOptions.dotsOptions.gradient) {
    newOptions.dotsOptions.gradient = sanitizeGradient(newOptions.dotsOptions.gradient);
  }

  if (newOptions.cornersSquareOptions) {
    newOptions.cornersSquareOptions = {
      ...newOptions.cornersSquareOptions
    };
    if (newOptions.cornersSquareOptions.gradient) {
      newOptions.cornersSquareOptions.gradient = sanitizeGradient(newOptions.cornersSquareOptions.gradient);
    }
  }

  if (newOptions.cornersDotOptions) {
    newOptions.cornersDotOptions = {
      ...newOptions.cornersDotOptions
    };
    if (newOptions.cornersDotOptions.gradient) {
      newOptions.cornersDotOptions.gradient = sanitizeGradient(newOptions.cornersDotOptions.gradient);
    }
  }

  if (newOptions.backgroundOptions) {
    newOptions.backgroundOptions = {
      ...newOptions.backgroundOptions
    };
    if (newOptions.backgroundOptions.gradient) {
      newOptions.backgroundOptions.gradient = sanitizeGradient(newOptions.backgroundOptions.gradient);
    }
  }

  return newOptions;
}
