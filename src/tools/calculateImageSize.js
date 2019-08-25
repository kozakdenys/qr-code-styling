export function calculateImageSizeForXAxis   ({ originalImageXSize, originalImageYSize, maxHiddenDots, dotSize }) {
    let dotsXCount, dotsYCount, imageXSize, imageYSize;
    const k = originalImageYSize / originalImageXSize;

    dotsXCount = Math.floor(Math.sqrt(maxHiddenDots / k));
    if (dotsXCount % 2 === 0) dotsXCount--;
    imageXSize = dotsXCount * dotSize;
    dotsYCount = 1 + 2 * Math.ceil((dotsXCount * k * dotSize - dotSize) / (2 * dotSize));
    imageYSize = Math.ceil(imageXSize * k);

    return { dotsXCount, dotsYCount, imageXSize, imageYSize };
}

export default function calculateImageSize ({ originalWidth, originalHeight, maxHiddenDots, dotSize }) {
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