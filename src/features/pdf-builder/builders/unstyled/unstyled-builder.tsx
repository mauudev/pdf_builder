import React, { ReactElement } from 'react';
import { View } from '@react-pdf/renderer';
import { IUnstyledBuilder, IUnstyledBlock, RawJSON } from '../../contracts';
import { parseStyle } from '../../utils';
import UnstyledBlock from '../../blocks/unstyled';
import { UnstyledBlockException, UnstyledBuilderException } from '../../exceptions';
import UnstyledBlockValidator from './validator';

/**
 * Builder de componentes de tipo 'unstyled', itera los inlineStyleRanges
 * del rawJson si existe y genera un Text para cada texto cortado segun los offsets.
 * Retorna un componente Text que wrappea otros componentes Text estilizados
 * para crear una sola linea de texto.
 */
class UnstyledBlockBuilder implements IUnstyledBuilder {
  private blockComponent: IUnstyledBlock;
  private validator: UnstyledBlockValidator;

  constructor() {
    this.blockComponent = new UnstyledBlock();
    this.validator = new UnstyledBlockValidator();
  }

  public validate(rawJson: RawJSON): void {
    this.validator.validate(rawJson);
  }

  public getBlockComponent(): IUnstyledBlock {
    return this.blockComponent;
  }

  public getBuiltBlock(rawJson: RawJSON, resetBlock?: boolean): ReactElement | undefined {
    try {
      this.validate(rawJson);
      return this.buildUnstyledBlock(rawJson);
    } catch (error) {
      if (error instanceof UnstyledBlockException) throw error;
      if (error instanceof Error) throw new UnstyledBuilderException(error.message);
    } finally {
      if (resetBlock) {
        this.getBlockComponent()?.reset();
      }
    }
  }

  public buildUnstyledBlock(rawJson: RawJSON): ReactElement {
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

export default UnstyledBlockBuilder;
