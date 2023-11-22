import React, { ReactElement } from "react";
import { View } from "@react-pdf/renderer";
import { IUnstyledBuilder, IUnstyledBlock, RawJSON } from "../contracts";
import { parseStyle } from "../utils";
import UnstyledBlock from "../blocks/unstyled";
import { UnstyledBuilderException } from "../exceptions";

/**
 * Builder de componentes de tipo 'unstyled', itera los inlineStyleRanges
 * del rawJson si existe y genera un Text para cada texto cortado segun los offsets.
 * Retorna un componente Text que wrappea otros componentes Text estilizados
 * para crear una sola linea de texto.
 */
class UnstyledBlockBuilder implements IUnstyledBuilder {
  private blockComponent: IUnstyledBlock;

  constructor() {
    this.blockComponent = new UnstyledBlock();
  }

  getBlockComponent(): IUnstyledBlock {
    return this.blockComponent;
  }

  getBuiltBlock(rawJson: RawJSON, resetBlock?: boolean): ReactElement {
    if (!rawJson || !rawJson.key) {
      throw new UnstyledBuilderException(
        "Invalid rawJson format or missing key"
      );
    }
    const block = this.buildUnstyledBlock(rawJson);
    if (resetBlock) {
      this.getBlockComponent()?.reset();
    }
    return block;
  }

  buildUnstyledBlock(rawJson: RawJSON): ReactElement {
    let blockStyle = {};
    if (rawJson && rawJson.data ? Object.keys(rawJson.data).length : 0) {
      const [style, value] = Object.entries(rawJson.data)[0];
      blockStyle = parseStyle(style, value);
    }
    return (
      <View key={rawJson.key} style={blockStyle}>
        {this.blockComponent?.getComponent(rawJson)}
      </View>
    );
  }
}

export default UnstyledBlockBuilder;
