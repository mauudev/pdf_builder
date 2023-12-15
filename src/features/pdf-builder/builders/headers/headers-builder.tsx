import React, { ReactElement } from 'react';
import { View } from '@react-pdf/renderer';
import { IHeaderBuilder, IHeaderBlock, RawJSON, EntityMap } from '../../contracts';
import { parseStyle } from '../../utils';
import HeaderBlock from '../../blocks/headers/headers';
import { HeaderBuilderException, HeaderBlockException } from '../../exceptions';
import HeaderBlockValidator from './validator';
import Logger from '../../logger';

/**
 * Builder de componentes de tipo 'header'
 */
class HeaderBlockBuilder implements IHeaderBuilder {
  private worker: IHeaderBlock;
  private validator: HeaderBlockValidator;

  constructor() {
    this.worker = new HeaderBlock();
    this.validator = new HeaderBlockValidator();
  }

  public validate(rawJson: RawJSON): void {
    this.validator.validate(rawJson);
  }

  public getWorker(): IHeaderBlock {
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
      return this.buildHeaderBlock(rawJson);
    } catch (error) {
      if (error instanceof HeaderBlockException) {
        Logger.error(`${error.name}: ${error.message}`);
        throw error;
      }
      if (error instanceof Error) throw new HeaderBuilderException(error.message);
    } finally {
      if (resetBlock) {
        this.getWorker()?.reset();
      }
    }
  }

  public buildHeaderBlock(rawJson: RawJSON): ReactElement {
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

export default HeaderBlockBuilder;
