export const transparentColor = (hex: string, opacity: number) => {
  const hexadecimalOpacity = Math.round(opacity * 255);

  const opacityHex = hexadecimalOpacity.toString(16);
  return `${hex}${opacityHex}`;
};
