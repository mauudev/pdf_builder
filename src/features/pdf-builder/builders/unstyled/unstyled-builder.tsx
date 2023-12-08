import React, { ReactElement } from 'react';
import { View } from '@react-pdf/renderer';
import { IUnstyledBuilder, IUnstyledBlock, RawJSON, EntityMap } from '../../contracts';
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
  private worker: IUnstyledBlock;
  private validator: UnstyledBlockValidator;

  constructor() {
    this.worker = new UnstyledBlock();
    this.validator = new UnstyledBlockValidator();
  }

  public validate(rawJson: RawJSON): void {
    this.validator.validate(rawJson);
  }

  public getWorker(): IUnstyledBlock {
    return this.worker;
  }

  public buildComponent(rawJson: RawJSON, resetBlock?: boolean): ReactElement | undefined;
  public buildComponent(rawJson: RawJSON, entityMap: EntityMap, resetBlock?: boolean): ReactElement | undefined;
  public buildComponent(
    rawJson: RawJSON,
    _entityMapOrResetBlock?: EntityMap | boolean,
    resetBlock?: boolean
  ): ReactElement | undefined {
    try {
      this.validate(rawJson);
      return this.buildUnstyledBlock(rawJson);
    } catch (error) {
      if (error instanceof UnstyledBlockException) throw error;
      if (error instanceof Error) throw new UnstyledBuilderException(error.message);
    } finally {
      if (resetBlock) {
        this.getWorker()?.reset();
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
        {this.worker?.getComponent(rawJson)}
      </View>
    );
  }
}

export default UnstyledBlockBuilder;
