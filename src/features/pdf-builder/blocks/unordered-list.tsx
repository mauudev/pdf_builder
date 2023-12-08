import React, { ReactNode, ReactElement } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Text } from '@react-pdf/renderer';
import { IUnorderedListBlock, RawJSON } from '../contracts';
import { composeStyledTexts } from '../utils';
import { UnorderedListBlockException } from '../exceptions';
import Logger from '../logger';

/**
 * Clase Block para los componentes de tipo 'unordered-list-item'.
 * Recibe un objeto de estilos y genera los componentes Text,
 */
class UnorderedListBlock implements IUnorderedListBlock {
  private listBlocks: Array<ReactNode>;

  constructor() {
    this.listBlocks = [];
  }

  public validate(rawJson: RawJSON): void {}

  public reset(): void {
    this.listBlocks = [];
  }

  public getBlocks(): Array<ReactNode> {
    return this.listBlocks;
  }

  public getComponent(rawJson: RawJSON): ReactElement {
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

  public buildBlocks(rawJson: RawJSON): void {
    const { text, inlineStyleRanges } = rawJson;
    const styledTexts = composeStyledTexts(text, inlineStyleRanges);
    Logger.debug(`Unordered list content and styles: ${JSON.stringify(styledTexts)}`);

    for (const styledText of styledTexts) {
      if (!styledText || !styledText.styles) {
        throw new UnorderedListBlockException('Invalid styledText format');
      }
      const block = (
        <Text key={uuidv4()} style={styledText.styles}>
          • &nbsp;<Text>{styledText.text}</Text>
        </Text>
      );
      this.listBlocks.push(block);
    }
  }
}

export default UnorderedListBlock;
