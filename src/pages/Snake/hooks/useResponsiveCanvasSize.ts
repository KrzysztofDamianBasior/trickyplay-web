import { useWindowSize } from "../../../shared/hooks";
import { useState } from "react";

/**
 * Returns the size of the image responsive to the window
 * @param ratio The ratio of the image dimensions to the window dimensions
 * @typedef {Object} Size
 * @property {number} x - width
 * @property {number} y - height
 * @returns {Size} The size of the canvas
 */
function useResponsiveCanvasSize(ratio: number): { x: number; y: number } {
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  let canvasSize: { x: number; y: number } = { x: 800, y: 800 };

  if (ratio < 100) {
    if (windowHeight > windowWidth) {
      canvasSize = {
        x: Math.floor((windowWidth * ratio) / 100),
        y: Math.floor((windowWidth * ratio) / 100),
      };
    } else {
      canvasSize = {
        x: Math.floor((windowHeight * ratio) / 100),
        y: Math.floor((windowHeight * ratio) / 100),
      };
    }
  }
  return canvasSize;
}
export { useResponsiveCanvasSize };
