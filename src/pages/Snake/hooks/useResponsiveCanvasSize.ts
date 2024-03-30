import { useWindowSize } from "usehooks-ts";
import { closestDivisibleInteger } from "../utils";

/**
 * Returns the size of the image responsive to the window
 * @param ratio The ratio of the image dimensions to the window dimensions
 * @param scale The scale of the game objects
 * @typedef {Object} Size
 * @property {number} x - width
 * @property {number} y - height
 * @returns {Size} The size of the canvas
 */
function useResponsiveCanvasSize(
  ratio: number,
  scale: number
): { x: number; y: number } {
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  let canvasSize: { x: number; y: number } = {
    x: closestDivisibleInteger(800, scale),
    y: closestDivisibleInteger(800, scale),
  };

  if (ratio < 100) {
    if (windowHeight > windowWidth) {
      canvasSize = {
        x: closestDivisibleInteger(
          Math.floor((windowWidth * ratio) / 100),
          scale
        ),
        y: closestDivisibleInteger(
          Math.floor((windowWidth * ratio) / 100),
          scale
        ),
      };
    } else {
      canvasSize = {
        x: closestDivisibleInteger(
          Math.floor((windowHeight * ratio) / 100),
          scale
        ),
        y: closestDivisibleInteger(
          Math.floor((windowHeight * ratio) / 100),
          scale
        ),
      };
    }
  }
  return canvasSize;
}
export { useResponsiveCanvasSize };
