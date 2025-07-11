/**
 * @fileoverview AI-Primer: Provides a utility for mapping business-logic muscle names
 * to their corresponding SVG element IDs. This decouples the view from the data layer,
 * simplifying maintenance.
 */

/**
 * A mapping of common muscle name variations to a single, standardized SVG element ID.
 * This ensures that different naming conventions in the data layer all point to the correct
 * visual element.
 * @type {Record<string, string>}
 */
const muscleIdMap: Record<string, string> = {
    'front delts': 'frontdelts',
    'anterior delts': 'frontdelts',
    'side delts': 'sidedelts',
    'lateral delts': 'sidedelts',
    'rear delts': 'reardelts',
    'posterior delts': 'reardelts',
    'forearm extensors': 'forearmextendors',
    'forearm flexors': 'forearmflexors',
    'lower back': 'lowerback',
    'rotator cuff': 'rotatorcuff',
    'trapezius': 'traps',
  };
  
  /**
   * Retrieves the corresponding SVG element ID for a given muscle name.
   * It first checks the explicit map and falls back to a standardized lowercase,
   * space-removed version of the name.
   * @param {string} muscleName - The name of the muscle.
   * @returns {string} The SVG element ID.
   */
  export const getMuscleElementId = (muscleName: string): string => {
    const lowerCaseName = muscleName.toLowerCase();
    return muscleIdMap[lowerCaseName] || lowerCaseName.replace(/\s+/g, '');
  };