import React, { ReactElement } from 'react';
import { View } from '@react-pdf/renderer';
import { IUnorderedListBuilder, IUnorderedListBlock, RawJSON } from '../../contracts';
import { parseStyle } from '../../utils';
import UnorderedListBlock from '../../blocks/unordered-list';
import { UnorderedListBuilderException, UnorderedListBlockException } from '../../exceptions';
import UnorderedListValidator from './validator';

/**
 * Builder de componentes de tipo 'unordered-list-item', itera los inlineStyleRanges
 * del rawJson si existe y genera un Text para cada texto cortado segun los offsets.
 * Retorna un componente Text que wrappea otros componentes Text estilizados
 * para crear una sola linea de texto.
 */
class UnorderedListBuilder implements IUnorderedListBuilder {
  private blockComponent: IUnorderedListBlock;
  private validator: UnorderedListValidator;

  constructor() {
    this.blockComponent = new UnorderedListBlock();
    this.validator = new UnorderedListValidator();
  }

  public validate(rawJson: RawJSON): void {
    this.validator.validate(rawJson);
  }

  public getBlockComponent(): IUnorderedListBlock {
    return this.blockComponent;
  }

  public getBuiltBlock(rawJson: RawJSON, resetBlock?: boolean): ReactElement | undefined {
    try {
      this.validate(rawJson);
      return this.buildUnorderedListBlock(rawJson);
    } catch (error) {
      if (error instanceof UnorderedListBuilderException) {
        throw error;
      }
      if (error instanceof Error) throw new UnorderedListBuilderException(error.message);
    } finally {
      if (resetBlock) {
        this.getBlockComponent()?.reset();
      }
    }
  }

  public buildUnorderedListBlock(rawJson: RawJSON): ReactElement {
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

export default UnorderedListBuilder;
