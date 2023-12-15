import React, { ReactNode, ReactElement } from 'react';
import { Text, View } from '@react-pdf/renderer';
import { v4 as uuidv4 } from 'uuid';
import { ITableEntity, EntityMapItem } from '../../contracts';
import { styles } from './table.styles';
import Logger from '../../logger';

/**
 * Clase Block para los componentes de tipo Table.
 * Recibe un objeto de estilos y genera los componentes Texts para crear una tabla.
 */
class TableEntity implements ITableEntity {
  private tableEntity: Array<ReactNode>;

  constructor() {
    this.tableEntity = [];
  }

  public reset(): void {
    this.tableEntity = [];
  }

  public getEntity(): Array<ReactNode> {
    return this.tableEntity;
  }

  public getComponent(entity: EntityMapItem): ReactElement {
    this.buildEntity(entity);
    console.log(`Building table entity with data: ${JSON.stringify(this.tableEntity)}`);
    const mainBlock = (
      <View key={uuidv4()} style={styles.table}>
        {this.getEntity().map((block, _) => (
          <React.Fragment key={uuidv4()}>{block}</React.Fragment>
        ))}
      </View>
    );
    return mainBlock;
  }

  public buildEntity(entity: EntityMapItem): void {
    const { tableCells } = entity.data;
    Logger.debug(`Building table entity with data: ${JSON.stringify(tableCells)}`);
    this.tableEntity = tableCells.map((row) => {
      return (
        <View key={uuidv4()} style={styles.tableRow}>
          {row.map((cell) => {
            return (
              <View key={uuidv4()} style={styles.tableCol}>
                <Text key={uuidv4()} style={styles.tableCell}>
                  {cell}
                </Text>
              </View>
            );
          })}
        </View>
      );
    });
  }
}

export default TableEntity;
