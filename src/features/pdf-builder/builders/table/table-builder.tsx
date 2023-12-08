import React, { ReactElement } from 'react';
import { View } from '@react-pdf/renderer';
import { ITableBlock, ITableBuilder, RawJSON, EntityMap } from '../../contracts';
import { parseStyle } from '../../utils';
import TableBlock from '../../blocks/tables/table';
import { UnstyledBuilderException } from '../../exceptions';

/**
 * Builder de componentes de tipo 'table', itera el rawJson y los entities
 * para generar los Text correspondientes y crear la tabla con los estilos.
 */
class TableEntityBuilder implements ITableBuilder {
  private blockComponent: ITableBlock;

  constructor(private readonly entityMap: EntityMap) {
    this.blockComponent = new TableBlock(entityMap);
  }

  public getBlockComponent(): ITableBlock {
    return this.blockComponent;
  }

  public getBuiltBlock(rawJson: RawJSON, resetBlock?: boolean): ReactElement {
    return <></>;
  }

  public buildTableBlock(rawJson: RawJSON): ReactElement {
    return <></>;
  }
}

export default TableEntityBuilder;
