export const styleMap = {
  italic: {
    fontSize: 10,
    fontWeight: 400,
    fontStyle: "italic",
  },
  bold: {
    fontSize: 10,
    fontWeight: 700,
  },
  "color-rgb": (color: string) => ({
    color,
  }),
  fontsize: (fontSize: string) => ({
    fontSize,
  }),
  "text-align": (textAlign: string) => ({
    textAlign,
  }),
};
