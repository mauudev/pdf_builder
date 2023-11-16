import { StyleMap, InlineStyle, TextStyles, RawJSON } from "./contracts";

const parseColorRGB = (style: string): string => {
  const colorValues = style
    .match(/\(([^)]+)\)/)![1]
    .split(",")
    .map(Number);
  return `rgb(${colorValues.join(",")})`;
};

const applyStyle = (styles: object, key: string, value: any): object => {
  return value ? { ...styles, ...value } : styles;
};

export const getDynamicStyle = (
  styleMap: StyleMap,
  styleList: InlineStyle[]
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

export const parseViewStyle = (
  styleData: object,
  styleMap: StyleMap
): object => {
  let stylesAcc = {};
  for (const [style, value] of Object.entries(styleData)) {
    switch (style) {
      case "text-align":
        stylesAcc = applyStyle(
          stylesAcc,
          style,
          styleMap["text-align"]?.(value)
        );
        break;
      // agregar los demas aca
    }
  }
  return stylesAcc;
};

export const composeInlineStyles = (rawJson: RawJSON): TextStyles => {
  const textStyles: TextStyles = {};

  if (rawJson.inlineStyleRanges.length === 0) {
    textStyles[rawJson.text] = [];
    return textStyles;
  }

  const orderedStyleRanges = rawJson.inlineStyleRanges.sort(
    (a, b) => a.offset - b.offset
  );

  for (const range of orderedStyleRanges) {
    const text = rawJson.text.substring(
      range.offset,
      range.offset + range.length
    );
    const style = range.style;

    if (style !== undefined) {
      if (!textStyles[text]) {
        textStyles[text] = [{ style }];
      } else {
        textStyles[text].push({ style });
      }
    }
  }

  const lastStyledRange = orderedStyleRanges[orderedStyleRanges.length - 1];
  const textLength = rawJson.text.length;
  if (lastStyledRange.offset + lastStyledRange.length < textLength) {
    const restText = rawJson.text.substring(
      lastStyledRange.offset + lastStyledRange.length
    );
    textStyles[restText] = [];
  }

  return textStyles;
};
