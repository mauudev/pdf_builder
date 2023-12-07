import React, { ReactElement } from 'react';
import { View } from '@react-pdf/renderer';
import { IHeaderBuilder, IHeaderBlock, RawJSON } from '../../contracts';
import { parseStyle } from '../../utils';
import HeaderBlock from '../../blocks/headers/headers';
import { HeaderBuilderException, HeaderBlockException } from '../../exceptions';
import HeaderBlockValidator from './validator';
import Logger from '../../logger';

/**
 * Builder de componentes de tipo 'header'
 */
class HeaderBlockBuilder implements IHeaderBuilder {
  private blockComponent: IHeaderBlock | undefined;
  private validator: HeaderBlockValidator;

  constructor() {
    this.blockComponent = new HeaderBlock();
    this.validator = new HeaderBlockValidator();
  }

  public validate(rawJson: RawJSON): void {
    this.validator.validate(rawJson);
  }

  public getBlockComponent(): IHeaderBlock | undefined {
    return this.blockComponent;
  }

  public getBuiltBlock(rawJson: RawJSON, resetBlock?: boolean): ReactElement | undefined {
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
        this.getBlockComponent()?.reset();
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
        {this.blockComponent?.getComponent(rawJson)}
      </View>
    );
  }
}

export default HeaderBlockBuilder;
