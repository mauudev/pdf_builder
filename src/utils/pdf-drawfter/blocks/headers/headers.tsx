import React, { ReactNode, ReactElement } from "react";
import { v4 as uuidv4 } from "uuid";
import { Text } from "@react-pdf/renderer";
import { IBlock, RawJSON, StyleMap } from "../../contracts";
import { headerStyles } from "./header.styles";

/**
 * Clase Block para los componentes de tipo Header (h1, h2, h3 ...).
 * Recibe un objeto de estilos y genera un componente Text,
 */
class HeaderBlock implements IBlock {
  private headerBlocks: Array<ReactNode>;

  constructor(public styleMap: StyleMap) {
    this.styleMap = { ...headerStyles, ...styleMap };
    this.headerBlocks = [];
  }
  reset(): void {
    this.headerBlocks = [];
  }

  getBlocks(): Array<ReactNode> {
    return this.headerBlocks;
  }

  getComponent(rawJson: RawJSON): ReactElement {
    this.buildBlocks(rawJson);
    const mainBlock = (
      <Text key={uuidv4()}>
        {this.getBlocks().map((block, index) => (
          <React.Fragment key={index}>{block}</React.Fragment>
        ))}
      </Text>
    );
    return mainBlock;
  }

  buildBlocks(rawJson: RawJSON): void {
    const headerType = rawJson.type as keyof StyleMap;
    const style = this.styleMap[headerType];

    if (style) {
      const block = (
        <Text key={uuidv4()} style={{ ...style }}>
          {rawJson.text}
        </Text>
      );
      this.headerBlocks.push(block);
    }
  }
}

export default HeaderBlock;
