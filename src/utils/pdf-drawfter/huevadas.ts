const text = "dynamic styled text right";
const inlineStyleRanges = [
  {
    offset: 0,
    length: 8,
    style: "color-rgb(0,0,0)",
  },
  {
    offset: 14,
    length: 11,
    style: "color-rgb(0,0,0)",
  },
  {
    offset: 0,
    length: 25,
    style: "BOLD",
  },
  {
    offset: 0,
    length: 16,
    style: "ITALIC",
  },
  {
    offset: 18,
    length: 7,
    style: "ITALIC",
  },
  {
    offset: 0,
    length: 25,
    style: "fontsize-18",
  },
  {
    offset: 8,
    length: 6,
    style: "color-rgb(247,218,100)",
  },
];

export const styleMap = {
  color: (color: string) => ({
    color,
  }),
  fontsize: (fontSize: string) => ({
    fontSize: fontSize,
  })
};

interface DynamicStyle {
  offset: number;
  length: number;
  style: string;
}

const dynamicStyle: DynamicStyle = {
  offset: 14,
  length: 11,
  style: "fontsize-18",
};

const applyDynamicStyle = (dynamicStyle: DynamicStyle) => {
  const { style } = dynamicStyle;
  if (style.startsWith("color-rgb")) {
    const colorValues = style
      .match(/\(([^)]+)\)/)![1]
      .split(",")
      .map(Number);
    const color = `rgb(${colorValues.join(",")})`;
    return styleMap["color"](color);
  }
  if (style.startsWith("fontsize")) {
    const fontSize = style.substring(9);
    return styleMap["fontsize"](fontSize);
  }

  return {};
};

const dynamicStyleObject = applyDynamicStyle(dynamicStyle);

console.log(dynamicStyleObject);
