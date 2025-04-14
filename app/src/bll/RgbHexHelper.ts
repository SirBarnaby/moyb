export function getTintByFactor(factor: number) {
  // We assume the base block is coloured #979797, which means 151*3.
  return {
    r: Math.round(151 + (104 * factor)),
    g: Math.round(151 - (151 * factor)),
    b: Math.round(151 - (77 * factor))
  }
}

export function rgbToHex(r: number, g: number, b: number) {
  const clamp = (val) => Math.round(Math.max(0, Math.min(255, val)));
  return '#' + [clamp(r), clamp(g), clamp(b)]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('');
}

export function hexToRgb(hex: string) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}
