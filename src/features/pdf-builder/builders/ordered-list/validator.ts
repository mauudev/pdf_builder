import { BlockValidator } from '../../validators';
import { RawJSON } from '../../contracts';
import { BlockException, OrderedListBuilderException } from '../../exceptions';

export default class OrderedListValidator extends BlockValidator {
  public validate(rawJson: RawJSON): void {
    try {
      const { key, type, text, inlineStyleRanges } = rawJson;
      this.validateType(type, 'ordered-list-item');
      this.validateKey(key);
      this.validateText(text);
      this.validateInlineStyleRanges(inlineStyleRanges);
    } catch (error) {
      if (error instanceof BlockException) {
        throw new OrderedListBuilderException(error.message);
      }
    }
  }
}
