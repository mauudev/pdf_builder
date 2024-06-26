import React, { ReactNode, ReactElement } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Text } from '@react-pdf/renderer';
import { IOrderedListBlock, RawJSON } from '../contracts';
import { composeStyledTexts } from '../utils';
import { OrderedListBlockException } from '../exceptions';
import Logger from '../logger';

/**
 * Clase Block para los componentes de tipo 'unordered-list-item'.
 * Recibe un objeto de estilos y genera los componentes Text,
 */
class OrderedListBlock implements IOrderedListBlock {
  private listBlocks: Array<ReactNode>;
  public index: number;

  constructor() {
    this.listBlocks = [];
    this.index = 0;
  }

  public resetIndex(): void {
    this.index = 0;
  }
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
    Logger.debug(`Ordered list content and styles: ${JSON.stringify(styledTexts)}`);

    this.index += 1;
    for (const styledText of styledTexts) {
      if (!styledText || !styledText.styles) {
        throw new OrderedListBlockException('Invalid styledText format');
      }
      const block = (
        <Text key={uuidv4()} style={styledText.styles}>
          <Text>
            {this.index}. &nbsp;{styledText.text}
          </Text>
        </Text>
      );
      this.listBlocks.push(block);
    }
  }
}

export default OrderedListBlock;
