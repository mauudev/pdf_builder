import React, { ReactElement } from "react";
import { View } from "@react-pdf/renderer";
import { IBuilder, IBlock, RawJSON } from "../contracts";
import { parseViewStyle } from "../utils";
import HeaderBlock from "../blocks/headers/headers";

/**
 * Builder de componentes de tipo 'header'
 */
class HeaderBlockBuilder implements IBuilder {
  private blockComponent: IBlock | undefined;

  constructor() {
    this.blockComponent = new HeaderBlock();
  }

  public getBlockComponent(): IBlock | undefined {
    return this.blockComponent;
  }

  public getBuiltBlock(rawJson: RawJSON): ReactElement | undefined {
    const headerTypes = [
      "header-one",
      "header-two",
      "header-three",
      "header-four",
      "header-five",
      "header-six",
    ];
    if (rawJson.type && !headerTypes.includes(rawJson.type)) {
      console.error(`type ${rawJson.type} not supported`);
      return;
    }
    const block = this.buildHeaderBlock(rawJson);
    this.getBlockComponent()?.reset();
    return block;
  }

  public buildHeaderBlock(rawJson: RawJSON): ReactElement | undefined {
    const blockStyle = parseViewStyle(rawJson.data);
    return (
      <View key={rawJson.key} style={blockStyle}>
        {this.blockComponent?.getComponent(rawJson)}
      </View>
    );
  }
}

export default HeaderBlockBuilder;
