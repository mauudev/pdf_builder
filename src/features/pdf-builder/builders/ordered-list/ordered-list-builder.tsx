import React, { ReactElement } from 'react';
import { View } from '@react-pdf/renderer';
import { IOrderedListBuilder, IOrderedListBlock, RawJSON, EntityMap } from '../../contracts';
import { parseStyle } from '../../utils';
import OrderedListBlock from '../../blocks/ordered-list';
import { OrderedListBuilderException } from '../../exceptions';
import { OrderedListBlockException } from '../../exceptions';
import OrderedListValidator from './validator';

/**
 * Builder de componentes de tipo 'ordered-list-item', itera los inlineStyleRanges
 * del rawJson si existe y genera un Text para cada texto cortado segun los offsets.
 * Retorna un componente Text que wrappea otros componentes Text estilizados
 * para crear una sola linea de texto.
 */
class OrderedListBuilder implements IOrderedListBuilder {
  private worker: IOrderedListBlock;
  private validator: OrderedListValidator;

  constructor() {
    this.worker = new OrderedListBlock();
    this.validator = new OrderedListValidator();
  }

  public validate(rawJson: RawJSON): void {
    this.validator.validate(rawJson);
  }

  public resetIndex(): void {
    this.worker?.resetIndex();
  }

  public getWorker(): IOrderedListBlock {
    return this.worker;
  }

  public buildComponent(rawJson: RawJSON, resetBlock?: boolean): ReactElement | undefined;
  public buildComponent(
    rawJson: RawJSON,
    entityMap: EntityMap,
    resetBlock?: boolean
  ): ReactElement | undefined;
  public buildComponent(rawJson: RawJSON, resetBlock?: boolean | EntityMap): ReactElement | undefined {
    try {
      this.validate(rawJson);
      return this.buildOrderedListBlock(rawJson);
    } catch (error) {
      if (error instanceof OrderedListBlockException) {
        throw error;
      }
      if (error instanceof Error) throw new OrderedListBuilderException(error.message);
    } finally {
      if (resetBlock) {
        this.getWorker()?.reset();
      }
    }
  }

  public buildOrderedListBlock(rawJson: RawJSON): ReactElement {
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

export default OrderedListBuilder;
