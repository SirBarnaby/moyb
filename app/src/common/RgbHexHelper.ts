// Pure, reusable colour utility helpers.

export function getTintByFactor (factor: number) {
  // Base grey is #979797 (RGB 151,151,151)
  return {
    r: Math.round(151 + (104 * factor)),
    g: Math.round(151 - (151 * factor)),
    b: Math.round(151 - (77  * factor))
  };
}

export function rgbToHex (r: number, g: number, b: number) {
  const clamp = (val: number) => Math.round(Math.max(0, Math.min(255, val)));
  return '#' + [clamp(r), clamp(g), clamp(b)]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('');
}

export function hexToRgb (hex: string) {
  const shorthand = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthand, (_m, r, g, b) => r + r + g + g + b + b);

  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return match ? {
    r: parseInt(match[1], 16),
    g: parseInt(match[2], 16),
    b: parseInt(match[3], 16)
  } : null;
}

