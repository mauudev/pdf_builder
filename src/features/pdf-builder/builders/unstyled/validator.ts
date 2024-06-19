import { BlockValidator } from '../../validators';
import { RawJSON } from '../../contracts';
import { BlockException, UnstyledBlockException } from '../../exceptions';

export default class UnstyledBlockValidator extends BlockValidator {
  public validate(rawJson: RawJSON): void {
    try {
      const { key, type, inlineStyleRanges } = rawJson;
      this.validateType(type, 'unstyled');
      this.validateKey(key);
      this.validateInlineStyleRanges(inlineStyleRanges);
    } catch (error) {
      if (error instanceof BlockException) {
        throw new UnstyledBlockException(error.message);
      }
    }
  }
}
