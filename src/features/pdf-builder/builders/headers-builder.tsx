import React, { ReactElement } from "react";
import { View } from "@react-pdf/renderer";
import { IHeaderBuilder, IBlock, RawJSON } from "../contracts";
import { parseStyle } from "../utils";
import HeaderBlock from "../blocks/headers/headers";

/**
 * Builder de componentes de tipo 'header'
 */
class HeaderBlockBuilder implements IHeaderBuilder {
  private blockComponent: IBlock | undefined;

  constructor() {
    this.blockComponent = new HeaderBlock();
  }

  public getBlockComponent(): IBlock | undefined {
    return this.blockComponent;
  }

  public getBuiltBlock(
    rawJson: RawJSON,
    resetBlock?: boolean
  ): ReactElement | undefined {
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
    if (resetBlock) {
      this.getBlockComponent()?.reset();
    }
    return block;
  }

  public buildHeaderBlock(rawJson: RawJSON): ReactElement | undefined {
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

export default HeaderBlockBuilder;
