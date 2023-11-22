export class BaseException extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'BaseException'
    Object.setPrototypeOf(this, BaseException.prototype)
  }
}

export class BlockException extends BaseException {
  constructor(message: string) {
    super(message)
    this.name = 'BlockException'
    Object.setPrototypeOf(this, BlockException.prototype)
  }
}

export class BuilderException extends BaseException {
  constructor(message: string) {
    super(message)
    this.name = 'BuilderException'
    Object.setPrototypeOf(this, BuilderException.prototype)
  }
}

export class UnstyledBlockException extends BlockException {
  constructor(message: string) {
    super(message)
    this.name = 'UnstyledBlockException'
    Object.setPrototypeOf(this, UnstyledBlockException.prototype)
  }
}

export class UnstyledBuilderException extends BuilderException {
  constructor(message: string) {
    super(message)
    this.name = 'UnstyledBuilderException'
    Object.setPrototypeOf(this, UnstyledBuilderException.prototype)
  }
}

export class HeaderBlockException extends BlockException {
  constructor(message: string) {
    super(message)
    this.name = 'HeaderBlockException'
    Object.setPrototypeOf(this, HeaderBlockException.prototype)
  }
}

export class HeaderBuilderException extends BuilderException {
  constructor(message: string) {
    super(message)
    this.name = 'HeaderBuilderException'
    Object.setPrototypeOf(this, HeaderBuilderException.prototype)
  }
}

export class OrderedListBlockException extends BlockException {
  constructor(message: string) {
    super(message)
    this.name = 'OrderedListBlockException'
    Object.setPrototypeOf(this, OrderedListBlockException.prototype)
  }
}

export class OrderedListBuilderException extends BuilderException {
  constructor(message: string) {
    super(message)
    this.name = 'OrderedListBuilderException'
    Object.setPrototypeOf(this, OrderedListBuilderException.prototype)
  }
}

export class UnorderedListBlockException extends BlockException {
  constructor(message: string) {
    super(message)
    this.name = 'UnorderedListBlockException'
    Object.setPrototypeOf(this, UnorderedListBlockException.prototype)
  }
}

export class UnorderedListBuilderException extends BuilderException {
  constructor(message: string) {
    super(message)
    this.name = 'UnorderedListBuilderException'
    Object.setPrototypeOf(this, UnorderedListBuilderException.prototype)
  }
}

export class PDFBuilderException extends BuilderException {
  constructor(message: string) {
    super(message)
    this.name = 'PDFBuilderException'
    Object.setPrototypeOf(this, PDFBuilderException.prototype)
  }
}
