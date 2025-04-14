import {getTintByFactor} from "@/bll/RgbHexHelper.ts";
import {rgbToHex} from "@/bll/RgbHexHelper.ts";
import { useBusinessLogicStore } from "@/bll/WorkoutPlan.ts";

export function setCSSTintForMuscle(elementId: string, setsPerWeek: number) {
  const DEFAULT_COLOR = "#979797" // Default gray color for muscles with no volume
  const bllStore = useBusinessLogicStore();
  
  const svgGroup = document.getElementById(elementId)
  if (!svgGroup) {
    console.error(`[CSSHelper] Could not find SVG element with ID ${elementId}`);
    return;
  }
  
  if (svgGroup instanceof SVGElement) {
    let hexColor;
    
    // If volume is zero or negative, reset to default color
    if (setsPerWeek <= 0) {
      hexColor = DEFAULT_COLOR;
      console.log(`[CSSHelper] Resetting muscle ${elementId} to default color`);
    } else {
      // Otherwise calculate tint based on volume
      const factorizer = 1 / bllStore.setsPerWeekMax
      // Sets per week goes up to the max value. After this, no more glowing.
      const factor = Math.min(setsPerWeek, bllStore.setsPerWeekMax) * factorizer
      const tint = getTintByFactor(factor)
      hexColor = rgbToHex(tint.r, tint.g, tint.b)
    }
    
    // Get all path elements within the group
    const paths = svgGroup.getElementsByTagName('path')
    for (let i = 0; i < paths.length; i++) {
      const path = paths[i] as SVGPathElement
      path.style.fill = hexColor
    }
  } else {
    console.error(`[CSSHelper] Element with ID ${elementId} is not an SVG element`);
  }
}
