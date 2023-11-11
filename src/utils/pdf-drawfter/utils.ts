export const getDynamicStyle = (styleMap: object, dynamicStyle: string) => {
  if (dynamicStyle.startsWith("color-rgb")) {
    const colorValues = dynamicStyle
      .match(/\(([^)]+)\)/)![1]
      .split(",")
      .map(Number);
    const color = `rgb(${colorValues.join(",")})`;
    return styleMap["color"](color);
  }
  if (dynamicStyle.startsWith("fontsize")) {
    const fontSize = dynamicStyle.substring(9);
    return styleMap["fontsize"](fontSize);
  }

  return ;
};
