interface ImageSizeOptions {
    originalHeight: number;
    originalWidth: number;
    maxHiddenDots: number;
    maxHiddenAxisDots?: number;
    dotSize: number;
}
interface ImageSizeResult {
    height: number;
    width: number;
    hideYDots: number;
    hideXDots: number;
}
export default function calculateImageSize({ originalHeight, originalWidth, maxHiddenDots, maxHiddenAxisDots, dotSize }: ImageSizeOptions): ImageSizeResult;
export {};
