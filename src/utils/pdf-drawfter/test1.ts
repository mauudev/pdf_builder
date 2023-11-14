const data = {
  key: "ehoft",
  text: "intermediate styled text",
  type: "unstyled",
  depth: 0,
  inlineStyleRanges: [
    {
      offset: 0,
      length: 11,
      style: "color-rgb(0,0,0)",
    },
    {
      offset: 0,
      length: 11,
      style: "ITALIC",
    },
    {
      offset: 21,
      length: 3,
      style: "color-rgb(0,0,0)",
    },
    {
      offset: 11,
      length: 10,
      style: "BOLD",
    },
    {
      offset: 11,
      length: 10,
      style: "color-rgb(226,80,65)",
    },
  ],
  entityRanges: [],
  data: {},
};

type Style = {
  [key: string]: string;
};

type StyleMap = {
  [text: string]: Array<Style>;
};

const getStyledWords = (data: any) => {
  const styleMap: StyleMap = {};
  const orderedStyleRanges = data.inlineStyleRanges.sort(
    (a: any, b: any) => a.offset - b.offset
  );
  for (const range of orderedStyleRanges) {
    let text = data.text.substring(range.offset, range.offset + range.length);
    const style = range.style;

    if (!styleMap[text]) {
      styleMap[text] = [{ style }];
    } else {
      styleMap[text].push({ style });
    }
  }

  return styleMap;
};

let result = getStyledWords(data);

console.log(JSON.stringify(result), result.length);
