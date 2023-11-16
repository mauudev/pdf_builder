import React, { ReactElement } from "react";
import ReactPDF, { View } from "@react-pdf/renderer";
import { IUnstyledBuilder, IBlock, RawJSON, StyleMap } from "../contracts";
import { parseViewStyle } from "../utils";
import UnstyledBlock from "../blocks/unstyled";

/**
 * Responsabilidades:
 *
 * UnstyledBlock:
 * - recibir chunks del array blocks y crear componentes estilizados
 * - wrappear en un componente Text de reactpdf
 * - retornar el componente
 *
 * ComponentBuilder:
 * - recibir chunks del array blocks e invocar a su blockComponent
 * - wrappear en un componente View de reactpdf
 * - retornar el componente
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
