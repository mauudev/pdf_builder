import React, { ReactElement } from "react";
import ReactPDF, { View } from "@react-pdf/renderer";
import { IBuilder, IBlock, RawJSON, StyleMap } from "./contracts";
import { parseViewStyle } from "./utils";
import UnstyledBlock from "./builders/unstyled";

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

class ComponentBuilder implements IBuilder {
  public blockComponent: IBlock | undefined = undefined;
  public blocks: Array<ReactElement> = [];
  public styleMap: StyleMap;

  constructor(styleMap: StyleMap) {
    this.styleMap = styleMap;
  }

  public reset(): void {
    this.blockComponent = undefined;
  }

  public buildBlocks(rawJson: RawJSON): void {
    switch (rawJson.type) {
      case "unstyled":
        this.buildUnstyledBlocks(rawJson);
        break;
      // agregar aca los demas types
      default:
        break;
    }
  }

  public buildUnstyledBlocks(rawJson: RawJSON): void {
    this.blockComponent = new UnstyledBlock(rawJson, this.styleMap);
    const blockStyle = parseViewStyle(rawJson.data, this.styleMap);
    const block = (
      <View key={rawJson.key} style={blockStyle}>
        {this.blockComponent.getComponent()}
      </View>
    );
    console.log(`block eeee: ${JSON.stringify(block)}`);
    this.blocks.push(block);
  }

  public buildHeaderBlocks(rawJson: RawJSON): void {}

  public buildListBlocks(rawJson: RawJSON): void {}
}

export default ComponentBuilder;
