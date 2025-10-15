export function darkenHexColor(hex: string, fraction: number) {
  let percent = fraction * 100;
  // Ensure percent is between 0 and 100
  percent = Math.max(0, Math.min(100, percent));

  // Remove the '#' if present
  hex = hex.startsWith("#") ? hex.slice(1) : hex;

  // Convert hex to RGB
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  // Darken the RGB values
  r = Math.floor(r * (1 - percent / 100));
  g = Math.floor(g * (1 - percent / 100));
  b = Math.floor(b * (1 - percent / 100));

  // Ensure values are not less than 0
  r = Math.max(0, r);
  g = Math.max(0, g);
  b = Math.max(0, b);

  // Convert RGB back to hex
  const toHex = (c: number) => `0${c.toString(16)}`.slice(-2);
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
