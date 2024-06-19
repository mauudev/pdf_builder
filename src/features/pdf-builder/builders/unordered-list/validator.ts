import { BlockValidator } from '../../validators';
import { RawJSON } from '../../contracts';
import { BlockException, UnorderedListBlockException } from '../../exceptions';

export default class UnorderedListValidator extends BlockValidator {
  public validate(rawJson: RawJSON): void {
    try {
      const { key, type, text, inlineStyleRanges } = rawJson;
      this.validateType(type, 'unordered-list-item');
      this.validateKey(key);
      this.validateText(text);
      this.validateInlineStyleRanges(inlineStyleRanges);
    } catch (error) {
      if (error instanceof BlockException) {
        throw new UnorderedListBlockException(error.message);
      }
    }
  }
}
