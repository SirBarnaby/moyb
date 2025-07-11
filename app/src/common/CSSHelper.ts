import { getTintByFactor, rgbToHex } from '@/common/RgbHexHelper';

/**
 * @fileoverview Pure color calculation helpers for muscle visualization.
 * These functions are decoupled from the DOM and can be used in any context.
 */

/**
 * Default grey when muscle has no volume.
 */
const DEFAULT_COLOR = '#979797';

/**
 * Calculates a muscle's hex color based on its workout volume.
 * This is a pure function that returns a hex color string for Vue template binding.
 *
 * @param setsPerWeek - The total number of sets for the muscle in a week.
 * @param maxSetsInPlan - The maximum sets for any muscle in the current plan, used for scaling.
 * @returns A hex color string (e.g., '#ff0000').
 */
export function getMuscleColorByVolume(setsPerWeek: number, maxSetsInPlan: number): string {
  if (setsPerWeek <= 0) {
    return DEFAULT_COLOR;
  }
  // Prevent division by zero if max sets is 0
  const maxSets = maxSetsInPlan > 0 ? maxSetsInPlan : 1;
  const ratio = Math.min(setsPerWeek / maxSets, 1);
  const tint = getTintByFactor(ratio);
  return rgbToHex(tint.r, tint.g, tint.b);
}

