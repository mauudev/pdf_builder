import React, { ReactElement } from "react";
import { View } from "@react-pdf/renderer";
import { IBuilder, IBlock, RawJSON } from "../contracts";
import { parseStyle } from "../utils";
import UnorderedListBlock from "../blocks/unordered-list";

/**
 * Builder de componentes de tipo 'unordered-list-item', itera los inlineStyleRanges
 * del rawJson si existe y genera un Text para cada texto cortado segun los offsets.
 * Retorna un componente Text que wrappea otros componentes Text estilizados
 * para crear una sola linea de texto.
 */
class UnorderedListBuilder implements IBuilder {
  private blockComponent: IBlock | undefined;

  constructor() {
    this.blockComponent = new UnorderedListBlock();
  }

  public getBlockComponent(): IBlock | undefined {
    return this.blockComponent;
  }

  public getBuiltBlock(rawJson: RawJSON): ReactElement | undefined {
    if (rawJson.type !== "unordered-list-item") {
      console.error(`type ${rawJson.type} not supported`);
      return;
    }
    const block = this.buildUnorderedListBlock(rawJson);
    this.getBlockComponent()?.reset();
    return block;
  }

  public buildUnorderedListBlock(rawJson: RawJSON): ReactElement | undefined {
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