import { BlockException } from './exceptions';

export class BlockValidator {
  public validateType(value: string, expectedType: string): void {
    if (value !== expectedType) {
      throw new BlockException(`Invalid type: ${value}`);
    }
  }

  public validateText(text: string): void {
    if (!text) {
      throw new BlockException(`Invalid text: ${text}`);
    }
  }

  public validateKey(key: string): void {
    if (!key) {
      throw new BlockException('Invalid rawJson format or missing key');
    }
  }

  public validateStyledText(styledText: any): void {
    if (!styledText || !styledText.styles) {
      throw new BlockException(`Invalid styledText format: ${styledText}`);
    }
  }

  public validateInlineStyleRanges(inlineStyleRanges: any): void {
    for (const styleRange of inlineStyleRanges) {
      if (!styleRange || typeof styleRange !== 'object') {
        throw new Error('Each element of "inlineStyleRanges" must be an object');
      }

      const { offset, length, style } = styleRange;

      if (typeof offset !== 'number' || typeof length !== 'number' || typeof style !== 'string') {
        throw new Error(
          'Each element of "inlineStyleRanges" must have "offset" and "length" of numeric type, and "style" of string type.'
        );
      }
    }
  }

  public validateLength(length: number, expectedLength: number, propertyName: string): void {
    if (length !== expectedLength) {
      throw new BlockException(`Invalid ${propertyName} length: ${length}`);
    }
  }
}
