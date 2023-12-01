export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const parsePointValue = (value) => {
  const numericChars = [...value].filter((char) => !isNaN(char) || char === '.');
  return parseFloat(numericChars.join(''));
};
