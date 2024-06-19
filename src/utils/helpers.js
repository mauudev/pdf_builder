export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const parsePointValue = (value) => {
  const numericChars = [...value].filter((char) => !isNaN(char) || char === '.');
  return parseFloat(numericChars.join(''));
};

export const toCamelCase = (string) => {
  return string.replace(/-./g, (x) => x[1].toUpperCase());
};

export const toTitleCase = (string) => {
  if (typeof string !== 'string') {
    throw new Error(`Input must be of type string, got ${typeof string}`);
  }
  const regex = /[A-Z]/g;
  const matches = string.match(regex);
  if (!matches) {
    return string;
  }
  matches.forEach((match) => {
    let targetIndex = string.indexOf(match);
    string = string.charAt(0).toUpperCase() + string.slice(1, targetIndex) + ' ' + string.slice(targetIndex);
  });
  return string;
};
