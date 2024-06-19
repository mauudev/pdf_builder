import { BlockValidator } from '../../validators';
import { EntityMap, RawJSON } from '../../contracts';
import { BlockException, TableBlockException } from '../../exceptions';

export default class TableBlockValidator extends BlockValidator {
  public validate(rawJson: RawJSON, entityMap: EntityMap): void {
    try {
      const { type, entityRanges } = rawJson;

      this.validateType(type, 'atomic');
      this.validateEntityRangesLength(entityRanges);

      const entityKey = entityRanges[0].key;
      this.validateEntityKey(entityKey, entityMap);

      const entityType = entityMap[entityKey].type;
      this.validateEntityType(entityType, 'TABLE');

      const tableCells = entityMap[entityKey].data.tableCells;
      const rows = entityMap[entityKey].data.rows;
      const columns = entityMap[entityKey].data.columns;
      this.validateTableCells(tableCells, rows, columns);
    } catch (error) {
      if (error instanceof BlockException) {
        throw new TableBlockException(error.message);
      }
    }
  }

  public validateEntityRangesLength(entityRanges: any[]): void {
    this.validateLength(entityRanges.length, 1, 'entityRanges');
  }

  public validateEntityType(entityType: string, expectedType: string): void {
    this.validateType(entityType, expectedType);
  }

  public validateEntityKey(entityKey: number, entityMap: EntityMap): void {
    if (!entityMap[entityKey]) {
      throw new BlockException(`Invalid entityKey: ${entityKey} or missing entity`);
    }
  }

  public validateTableCells(tableCells: string[][], rows: number, columns: number): void {
    if (
      (tableCells.length === 0 && (rows !== 0 || columns !== 0)) ||
      tableCells.length !== rows ||
      (tableCells.length > 0 && tableCells[0].length !== columns)
    ) {
      throw new BlockException(
        `Invalid table: rows=${rows}, columns=${columns}, actualRows=${tableCells.length}, actualColumns=${
          tableCells.length > 0 ? tableCells[0].length : 0
        }`
      );
    }
  }
}
