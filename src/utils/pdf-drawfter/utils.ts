import { StyleMap } from "./contracts";

type StyleList = { style: string }[];

const parseColorRGB = (style: string): string => {
  const colorValues = style
    .match(/\(([^)]+)\)/)![1]
    .split(",")
    .map(Number);
  return `rgb(${colorValues.join(",")})`;
};

const applyStyle = (styles: object, key: string, value: any): object => {
  return value ? { ...styles, [key]: value } : styles;
};

export const getDynamicStyle = (
  styleMap: StyleMap,
  styleList: StyleList
): object => {
  let styles: object = {};

  for (const item of styleList) {
    const style: string = item.style.toLowerCase();

    if (style.startsWith("color-rgb")) {
      const rgbValue: string = parseColorRGB(style);
      styles = applyStyle(
        styles,
        "color-rgb",
        styleMap["color-rgb"]?.(rgbValue)
      );
    }

    if (style.startsWith("fontsize")) {
      const fontSizeValue: number = parseInt(style.substring(9));
      styles = applyStyle(
        styles,
        "fontsize",
        styleMap["fontsize"]?.(fontSizeValue)
      );
    }

    styles = applyStyle(styles, style, styleMap[style as keyof StyleMap]);
  }

  return styles;
};
