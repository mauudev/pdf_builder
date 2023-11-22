import React, { ReactElement } from "react";
import { View } from "@react-pdf/renderer";
import { IOrderedListBuilder, IOrderedListBlock, RawJSON } from "../contracts";
import { parseStyle } from "../utils";
import OrderedListBlock from "../blocks/ordered-list";

/**
 * Builder de componentes de tipo 'ordered-list-item', itera los inlineStyleRanges
 * del rawJson si existe y genera un Text para cada texto cortado segun los offsets.
 * Retorna un componente Text que wrappea otros componentes Text estilizados
 * para crear una sola linea de texto.
 */
class OrderedListBuilder implements IOrderedListBuilder {
  private blockComponent: IOrderedListBlock;

  constructor() {
    this.blockComponent = new OrderedListBlock();
  }

  resetIndex(): void {
    this.blockComponent?.resetIndex();
  }

  getBlockComponent(): IOrderedListBlock {
    return this.blockComponent;
  }

  getBuiltBlock(rawJson: RawJSON, resetBlock?: boolean): ReactElement {
    const block = this.buildOrderedListBlock(rawJson);
    if (resetBlock) {
      this.getBlockComponent()?.reset();
    }
    return block;
  }

  buildOrderedListBlock(rawJson: RawJSON): ReactElement {
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

export default OrderedListBuilder;