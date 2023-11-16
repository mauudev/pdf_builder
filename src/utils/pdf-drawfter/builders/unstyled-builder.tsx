import React, { ReactElement } from "react";
import { View } from "@react-pdf/renderer";
import { IUnstyledBuilder, IBlock, RawJSON, StyleMap } from "../contracts";
import { parseViewStyle } from "../utils";
import UnstyledBlock from "../blocks/unstyled";

/**
 * Builder de componentes de tipo 'unstyled', itera los inlineStyleRanges
 * del rawJson si existe y genera un Text para cada texto cortado segun los offsets.
 * Retorna un componente Text que wrappea otros componentes Text estilizados
 * para crear una sola linea de texto.
 */
class UnstyledBlockBuilder implements IUnstyledBuilder {
  private blockComponent: IBlock | undefined;
  public styleMap: StyleMap;

  constructor(styleMap: StyleMap) {
    this.styleMap = styleMap;
    this.blockComponent = new UnstyledBlock(styleMap);
  }

  public getBlockComponent(): IBlock | undefined {
    return this.blockComponent;
  }

  public getBuiltBlock(rawJson: RawJSON): ReactElement | undefined {
    if (rawJson.type !== "unstyled") {
      console.error(`type ${rawJson.type} not supported`);
      return;
    }
    const block = this.buildUnstyledBlock(rawJson);
    this.getBlockComponent()?.reset();
    return block;
  }

  public buildUnstyledBlock(rawJson: RawJSON): ReactElement | undefined {
    const blockStyle = parseViewStyle(rawJson.data, this.styleMap);
    return (
      <View key={rawJson.key} style={blockStyle}>
        {this.blockComponent?.getComponent(rawJson)}
      </View>
    );
  }
}

export default UnstyledBlockBuilder;
