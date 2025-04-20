import { getTintByFactor, rgbToHex } from "@/bll/RgbHexHelper";
import { useBusinessLogicStore } from "@/bll/WorkoutPlan";

// Constants
const DEFAULT_COLOR = "#979797"; // Default gray color for muscles with no volume
const LOG_PREFIX = "[MuscleVisualization]";

/**
 * Sets the appropriate color tint for a muscle in the SVG based on weekly volume
 * @param elementId The SVG element ID representing the muscle
 * @param setsPerWeek The number of sets per week for this muscle
 * @returns Whether the operation was successful
 */
export function setCSSTintForMuscle(elementId: string, setsPerWeek: number): boolean {
  // Get the SVG element and validate it
  const svgGroup = getSvgElement(elementId);
  if (!svgGroup) {
    return false;
  }

  // Calculate the appropriate color based on volume
  const hexColor = calculateMuscleColor(setsPerWeek);

  // Apply the color to all paths in the SVG group
  applyColorToSvgPaths(svgGroup, hexColor);

  return true;
}

/**
 * Gets and validates the SVG element with the given ID
 */
function getSvgElement(elementId: string): SVGElement | null {
  const element = document.getElementById(elementId);

  if (!element) {
    console.error(`${LOG_PREFIX} Could not find SVG element with ID ${elementId}`);
    return null;
  }

  if (!(element instanceof SVGElement)) {
    console.error(`${LOG_PREFIX} Element with ID ${elementId} is not an SVG element`);
    return null;
  }

  return element;
}

/**
 * Calculates the appropriate color for a muscle based on its weekly volume
 */
function calculateMuscleColor(setsPerWeek: number): string {
  const bllStore = useBusinessLogicStore();

  // If volume is zero or negative, return default color
  if (setsPerWeek <= 0) {
    console.log(`${LOG_PREFIX} Using default color for muscle (no volume)`);
    return DEFAULT_COLOR;
  }

  // Calculate color based on volume relative to maximum
  const maxSets = bllStore.setsPerWeekMax || 1; // Protect against division by zero
  const volumeRatio = Math.min(setsPerWeek / maxSets, 1.0); // Cap at 1.0 (100%)
  const tint = getTintByFactor(volumeRatio);

  return rgbToHex(tint.r, tint.g, tint.b);
}

/**
 * Applies the given color to all path elements within an SVG group
 */
function applyColorToSvgPaths(svgGroup: SVGElement, hexColor: string): void {
  const paths = svgGroup.getElementsByTagName('path');

  for (let i = 0; i < paths.length; i++) {
    const path = paths[i] as SVGPathElement;
    path.style.fill = hexColor;
  }
}
