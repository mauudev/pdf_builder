import React, { ReactElement } from 'react';
import { View } from '@react-pdf/renderer';
import { ITableEntity, ITableBuilder, RawJSON, EntityMap } from '../../contracts';
import TableBlock from '../../blocks/tables/simple-table';
import { TableBlockException, TableBuilderException } from '../../exceptions';
import TableBlockValidator from './validator';

/**
 * Builder de componentes de tipo 'table', itera el rawJson y los entities
 * para generar los Text correspondientes y crear la tabla con los estilos.
 */
class TableEntityBuilder implements ITableBuilder {
  private worker: ITableEntity;
  private validator: TableBlockValidator;

  constructor() {
    this.worker = new TableBlock();
    this.validator = new TableBlockValidator();
  }

  public validate(rawJson: RawJSON, entityMap: EntityMap): void {
    this.validator.validate(rawJson, entityMap);
  }

  public getWorker(): ITableEntity {
    return this.worker;
  }

  public buildComponent(
    rawJson: RawJSON,
    _entityMapOrResetBlock?: EntityMap | boolean,
    resetBlock?: boolean
  ): ReactElement | undefined;
  public buildComponent(
    rawJson: RawJSON,
    entityMap: EntityMap,
    resetBlock?: boolean
  ): ReactElement | undefined;
  public buildComponent(
    rawJson: RawJSON,
    entityMap: EntityMap,
    resetBlock?: boolean
  ): ReactElement | undefined {
    try {
      this.validate(rawJson, entityMap);
      return this.buildTableEntity(rawJson, entityMap);
    } catch (error) {
      if (error instanceof TableBlockException) throw error;
      if (error instanceof Error) throw new TableBuilderException(error.message);
    } finally {
      if (resetBlock) {
        this.getWorker()?.reset();
      }
    }
  }

  public buildTableEntity(rawJson: RawJSON, entityMap: EntityMap): ReactElement {
    const { entityRanges } = rawJson;
    const entityMapItem = entityMap[entityRanges[0].key];
    this.worker.buildEntity(entityMapItem);
    return (
      <View key={rawJson.key} style={entityMapItem.data.styles}>
        {this.worker?.getComponent(entityMapItem)}
      </View>
    );
  }
}

export default TableEntityBuilder;
