import React from "react";
import { IBuilder, RawJSON } from "./contracts";

import UnstyledBlockBuilder from "./builders/unstyled-builder";

class PDFBuilder {
  public componentBuilder: IBuilder | undefined;
  private blocks: Array<React.ReactElement>;

  constructor() {
    this.blocks = [];
  }

  public setBuilder(builder: IBuilder): void {
    this.componentBuilder = builder;
  }

  public buildPDFContent(
    blocks: Array<RawJSON>
  ): React.ReactElement | undefined {}
}

export default PDFBuilder;
