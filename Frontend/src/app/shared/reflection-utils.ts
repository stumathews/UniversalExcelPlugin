export class ReflectionUtils {

  static getEntityProperties<T>(entity: T, exclComplexTypes?: boolean): string[][] {
    console.log('Entry: getEntityProperties.');
    console.log('scanning entity properties: ' + JSON.stringify(entity));
    const dummy = entity;
    const columns: string[][] = [];
    const r: string[] = [];
    for (let key in dummy) {
      if (dummy.hasOwnProperty(key) && typeof dummy[key] !== 'function') {
        if (exclComplexTypes && (typeof dummy[key] === 'object' || Array.isArray(dummy[key]))) {
          continue;
        }
        console.log('found: ' + key);
        r.push(key);
      }
    }
    columns.push(r);
    console.log('returning: ' + JSON.stringify(columns));
    return columns;
  }

  /**
   * Returns [ 
   * ['value', 'value'],   // row 1 values
   * ['value', 'value'],   // row 2 values
   * ['value', 'value']]   // row 3 values
   * @param entities The list of entities that we need to convert to a grid
   * @param entityType The type of the entity
   */
  static getEntitiesPropertyValues<T>(entities: T[], columns: string[][]): string[][] {
    const rows: string[][] = [];
    
    entities.forEach((entity: T) => {
      const row: string[] = [];
      columns.forEach((column: string[]) => {
        column.forEach((c: string) => {
          row.push(entity[c]);
        });
      });
      rows.push(row);
    });
    console.log('returning ' + JSON.stringify(rows));
    return rows;
  }
}
