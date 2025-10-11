export const truncate = (text: string, maxlength: number): string => {
  return text.length > maxlength ? text.slice(0, maxlength - 1) + "…" : text;
};
