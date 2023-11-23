import React, { ReactNode, ReactElement } from 'react';
import { Text } from '@react-pdf/renderer';
import { IUnstyledBlock, RawJSON } from '../contracts';
import { composeStyledTexts } from '../utils';
import { v4 as uuidv4 } from 'uuid';
import { UnstyledBlockException } from '../exceptions';
import Logger from '../logger';

/**
 * Clase Block para los componentes de tipo Unstyled.
 * Recibe un objeto de estilos y genera un componente Text,
 */
class UnstyledBlock implements IUnstyledBlock {
  private unstyledBlocks: Array<ReactNode>;

  constructor() {
    this.unstyledBlocks = [];
  }

  public reset(): void {
    this.unstyledBlocks = [];
  }

  public getBlocks(): Array<ReactNode> {
    return this.unstyledBlocks;
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
    const { type, text, inlineStyleRanges } = rawJson;
    if (!type || !Array.isArray(inlineStyleRanges)) {
      throw new UnstyledBlockException(
        `Invalid rawJson format: type: ${type}, text: ${text}, inlineStyleRanges: ${inlineStyleRanges}`
      );
    }
    if (type !== 'unstyled') {
      throw new UnstyledBlockException(`Invalid type: ${type}`);
    }

    let styledTexts = [];
    if (text === '') {
      styledTexts = [
        {
          text: ' ',
          styles: {},
        },
      ];
    } else {
      styledTexts = composeStyledTexts(text, inlineStyleRanges);
    }

    for (const styledText of styledTexts) {
      if (!styledText || !styledText.styles) {
        throw new UnstyledBlockException('Invalid styledText format');
      }
      const block = (
        <Text key={uuidv4()} style={styledText.styles}>
          {styledText.text}
        </Text>
      );
      this.unstyledBlocks.push(block);
    }
  }
}

export default UnstyledBlock;
