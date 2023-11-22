import React, { ReactElement } from "react";
import { View } from "@react-pdf/renderer";
import {
  IUnorderedListBuilder,
  IUnorderedListBlock,
  RawJSON,
} from "../contracts";
import { parseStyle } from "../utils";
import UnorderedListBlock from "../blocks/unordered-list";
import { UnorderedListBuilderException } from "../exceptions";

/**
 * Builder de componentes de tipo 'unordered-list-item', itera los inlineStyleRanges
 * del rawJson si existe y genera un Text para cada texto cortado segun los offsets.
 * Retorna un componente Text que wrappea otros componentes Text estilizados
 * para crear una sola linea de texto.
 */
class UnorderedListBuilder implements IUnorderedListBuilder {
  private blockComponent: IUnorderedListBlock;

  constructor() {
    this.blockComponent = new UnorderedListBlock();
  }

  public getBlockComponent(): IUnorderedListBlock {
    return this.blockComponent;
  }

  public getBuiltBlock(rawJson: RawJSON, resetBlock?: boolean): ReactElement {
    if (!rawJson || !rawJson.key) {
      throw new UnorderedListBuilderException(
        "Invalid rawJson format or missing key"
      );
    }
    const block = this.buildUnorderedListBlock(rawJson);
    if (resetBlock) {
      this.getBlockComponent()?.reset();
    }
    return block;
  }

  public buildUnorderedListBlock(rawJson: RawJSON): ReactElement {
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

export default UnorderedListBuilder;
