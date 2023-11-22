import React, { ReactNode, ReactElement } from "react";
import { Style } from "@react-pdf/types";
import { v4 as uuidv4 } from "uuid";
import { Text } from "@react-pdf/renderer";
import { IHeaderBlock, RawJSON } from "../../contracts";
import { headerStyles } from "./header.styles";
import { composeStyledTexts } from "../../utils";
import { HeaderBlockException } from "../../exceptions";
import Logger from "../../logger";

/**
 * Clase Block para los componentes de tipo Header (h1, h2, h3 ...).
 * Recibe un objeto de estilos y genera un componente Text,
 */
class HeaderBlock implements IHeaderBlock {
  private headerBlocks: Array<ReactNode>;
  private styleMap: { [key: string]: Style };
  private headerTypes: string[];

  constructor() {
    this.styleMap = headerStyles;
    this.headerBlocks = [];
    this.headerTypes = [
      "header-one",
      "header-two",
      "header-three",
      "header-four",
      "header-five",
      "header-six",
    ];
  }
  reset(): void {
    this.headerBlocks = [];
  }

  getBlocks(): Array<ReactNode> {
    return this.headerBlocks;
  }

  getHeaderTypes(): string[] {
    return this.headerTypes;
  }

  getComponent(rawJson: RawJSON): ReactElement {
    this.buildBlocks(rawJson);
    const mainBlock = (
      <Text key={uuidv4()} style={this.styleMap[rawJson.type]}>
        {this.getBlocks().map((block, index) => (
          <React.Fragment key={index}>{block}</React.Fragment>
        ))}
      </Text>
    );
    return mainBlock;
  }

  buildBlocks(rawJson: RawJSON): void {
    const { type, text, inlineStyleRanges } = rawJson;

    if (!type || text === undefined || !Array.isArray(inlineStyleRanges)) {
      throw new HeaderBlockException("Invalid rawJson format");
    }
    if (!this.headerTypes.includes(type)) {
      throw new HeaderBlockException(`Invalid header type: ${type}`);
    }
    const styledTexts = composeStyledTexts(text, inlineStyleRanges);
    Logger.log(`Building '${type}' blocks with styled texts: ${JSON.stringify(styledTexts)}`);

    for (const styledText of styledTexts) {
      if (!styledText || !styledText.text || !styledText.styles) {
        throw new HeaderBlockException("Invalid styledText format");
      }
      const block = (
        <Text key={uuidv4()} style={styledText.styles}>
          {styledText.text}
        </Text>
      );
      this.headerBlocks.push(block);
    }
  }
}

export default HeaderBlock;
