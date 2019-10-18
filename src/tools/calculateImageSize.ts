interface ImageSizeForOneAxisOptions {
  originalImageXSize: number;
  originalImageYSize: number;
  maxHiddenDots: number;
  dotSize: number;
}

interface ImageSizeForOneAxisResult {
  dotsXCount: number;
  dotsYCount: number;
  imageXSize: number;
  imageYSize: number;
}

export function calculateImageSizeForXAxis({
  originalImageXSize,
  originalImageYSize,
  maxHiddenDots,
  dotSize
}: ImageSizeForOneAxisOptions): ImageSizeForOneAxisResult {
  let dotsXCount;
  const k = originalImageYSize / originalImageXSize;

  dotsXCount = Math.floor(Math.sqrt(maxHiddenDots / k));
  if (dotsXCount % 2 === 0) dotsXCount--;
  const imageXSize = dotsXCount * dotSize;
  const dotsYCount = 1 + 2 * Math.ceil((dotsXCount * k * dotSize - dotSize) / (2 * dotSize));
  const imageYSize = Math.ceil(imageXSize * k);

  return { dotsXCount, dotsYCount, imageXSize, imageYSize };
}

interface ImageSizeOptions {
  originalWidth: number;
  originalHeight: number;
  maxHiddenDots: number;
  dotSize: number;
}

interface ImageSizeResult {
  resizedImageWidth: number;
  resizedImageHeight: number;
  hiddenDotsWidth: number;
  hiddenDotsHeight: number;
}

export default function calculateImageSize({
  originalWidth,
  originalHeight,
  maxHiddenDots,
  dotSize
}: ImageSizeOptions): ImageSizeResult {
  const maxHorizontalImage = calculateImageSizeForXAxis({
    originalImageXSize: originalWidth,
    originalImageYSize: originalHeight,
    maxHiddenDots,
    dotSize
  });

  const maxVerticalImage = calculateImageSizeForXAxis({
    originalImageXSize: originalHeight,
    originalImageYSize: originalWidth,
    maxHiddenDots,
    dotSize
  });

  if (maxHorizontalImage.imageXSize >= maxVerticalImage.imageYSize) {
    return {
      resizedImageWidth: maxHorizontalImage.imageXSize,
      resizedImageHeight: maxHorizontalImage.imageYSize,
      hiddenDotsWidth: maxHorizontalImage.dotsXCount,
      hiddenDotsHeight: maxHorizontalImage.dotsYCount
    };
  } else {
    return {
      resizedImageWidth: maxVerticalImage.imageYSize,
      resizedImageHeight: maxVerticalImage.imageXSize,
      hiddenDotsWidth: maxVerticalImage.dotsYCount,
      hiddenDotsHeight: maxVerticalImage.dotsXCount
    };
  }
}
