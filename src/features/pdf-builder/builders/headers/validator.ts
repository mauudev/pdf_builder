import { BlockValidator } from '../../validators';
import { RawJSON } from '../../contracts';
import { HeaderBlockException, BlockException } from '../../exceptions';

export default class HeaderBlockValidator extends BlockValidator {
  private headerTypes = [
    'header-one',
    'header-two',
    'header-three',
    'header-four',
    'header-five',
    'header-six',
  ];

  public validate(rawJson: RawJSON): void {
    try {
      const { key, type, text, inlineStyleRanges } = rawJson;
      this.validateKey(key);
      this.validateText(text);
      this.validateHeaderType(type);
      this.validateInlineStyleRanges(inlineStyleRanges);
    } catch (error) {
      if (error instanceof BlockException) {
        throw new HeaderBlockException(error.message);
      }
    }
  }

  public validateHeaderType(type: string): void {
    if (!this.headerTypes.includes(type)) {
      throw new HeaderBlockException(`Invalid header type: ${type}`);
    }
  }
}
