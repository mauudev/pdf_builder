import { Style } from '@react-pdf/types';
import { InlineStyleRange } from './contracts';

/** ##########################################################################
 *  ## UTILITIES FUNCTIONS
 * ##########################################################################
 */
/**
 * Sobre-escribe los estilos acumulados para un texto.
 * Ejemplo: Si hay un estilo 'color-rgb(0, 0, 0)' y se agrega otro 'color-rgb(55, 130, 121)'
 * se toma en cuenta el ultimo agregado ('color-rgb(55, 130, 121)') y se elimina el primero.
 * @param style Estilo a agregar
 * @param stylesArray Array de estilos
 * @returns string[]  El array de estilos
 */
const overrideStyle = (style: string, stylesArray: string[]): string[] => {
  const styles = new Set<string>(stylesArray);

  if (Array.from(styles).some((existingStyle) => existingStyle.startsWith(style.split('-')[0]))) {
    styles.delete([...styles].find((existingStyle) => existingStyle.startsWith(style.split('-')[0]))!);
  }

  styles.add(style);
  return Array.from(styles);
};

/**
 * Recibe un array de objetos que contiene los estilos
 * para cada caracter del texto original, luego va concatenando todos
 * los caracteres que comparten los mismos estilos, de esta forma
 * se va reconstruyendo los textos con sus estilos.
 * Esto evita crear componentes `<Text/>` para cada caracter.
 * @param styledTexts La lista de caracteres y sus estilos
 * @returns string[]  El array de objetos con el texto y sus estilos
 */
const buildStyledTextBlocks = (
  styledTexts: { char: string; styles: string[] }[]
): { text: string; styles: string[] }[] => {
  let styleMap: { text: string; styles: string[] }[] = [];
  for (const currentItem of styledTexts) {
    if (styleMap.length === 0) {
      styleMap.push({
        text: currentItem.char,
        styles: currentItem.styles,
      });
    } else {
      const lastItem = styleMap[styleMap.length - 1];
      if (equalArrays(lastItem.styles, currentItem.styles)) {
        lastItem.text += currentItem.char;
      } else {
        styleMap.push({
          text: currentItem.char,
          styles: currentItem.styles,
        });
      }
    }
  }
  return styleMap;
};

/**
 * Aplica los estilos del mapa de estilos globales.
 * Casos especiales como 'fontsize' y 'color-rgb' deben parsearse primero
 * para aplicarlos correctamente.
 * @param styledTexts La lista de objetos con el texto y sus estilos
 * @returns { text: string; styles: Style }[] El array de objetos con el texto y sus estilos
 */
const applyStyle = (styledTexts: { text: string; styles: string[] }[]): { text: string; styles: Style }[] => {
  const result: { text: string; styles: Style }[] = [];
  for (const currentItem of styledTexts) {
    let styles = {};
    for (let style of currentItem.styles) {
      styles = {
        ...styles,
        ...parseStyle(style),
      };
    }
    result.push({
      text: currentItem.text,
      styles: styles,
    });
  }
  return result;
};

// ##########################################################################
// ## EXPORTED FUNCTIONS
// ##########################################################################
export const parseStyle = (style: string, value?: string | number | boolean | undefined): Style => {
  let styles = {};
  style = style.toLowerCase();
  if (style.startsWith('fontsize')) {
    const fontSizeVal = parseInt(style.split('-')[1]);
    styles = { fontSize: fontSizeVal };
  }
  if (style.startsWith('color-rgb')) {
    const colorVal = style.split('-')[1];
    styles = { color: colorVal };
  }
  if (style === 'bold') {
    styles = { fontWeight: 'bold' };
  }
  if (style === 'italic') {
    styles = { fontStyle: 'italic' };
  }
  if (style === 'underline') {
    styles = { textDecoration: 'underline' };
  }
  if (style === 'text-align') {
    styles = { textAlign: value };
  }
  return styles;
};

export const equalArrays = (arrayA: any[], arrayB: any[]): boolean =>
  arrayA.length === arrayB.length && arrayA.every((x) => arrayB.includes(x));

/**
 * Dado el texto original del RawJSON, segmenta los sub-textos por estilos.
 * @param text El texto original
 * @param inlineStyleRanges Los rangos de estilos para cada segmento de texto
 * @returns { text: string; styles: Style; }[]
 */
export const composeStyledTexts = (text: string, inlineStyleRanges: InlineStyleRange[]) => {
  const styledTexts: { char: string; styles: string[]; index: number }[] = [];

  for (let i = 0; i < text.length; i++) {
    const char = text.charAt(i);
    styledTexts.push({ char, styles: [], index: -1 });
  }

  const orderedStyleRanges = inlineStyleRanges.sort((a, b) => a.offset - b.offset);

  for (const range of orderedStyleRanges) {
    const { offset, length, style } = range;
    for (let i = offset; i < offset + length; i++) {
      let currentItem = styledTexts[i];
      currentItem.styles = overrideStyle(style, currentItem.styles);
      currentItem.index = i;
      currentItem.char = text.charAt(i);
    }
  }
  const composedStyledTexts = buildStyledTextBlocks(styledTexts);
  return applyStyle(composedStyledTexts);
};
