export class ReflectionUtils {

  static toObject<T>(arr: any, properties: string[]): T {
      var rv = {};
      for (var i = 0; i < arr.length; ++i)
        if (arr[i] !== undefined) rv[properties[i]] = arr[i];
      return <T>rv;
  }

  static getPropertyType<T, K extends keyof T>(obj: T, key: K) {
    return obj[key];
  }

  static getEntityProperties<T>(entity: T, exclComplexTypes?: boolean): string[][] {
    console.log('Entry: getEntityProperties.');
    console.log('scanning entity properties: ' + JSON.stringify(entity));
    const dummy = entity;
    const columns: string[][] = [];
    const r: string[] = [];
    for (let key in dummy) {
      if (dummy.hasOwnProperty(key) && typeof dummy[key] !== 'function') {
        if (exclComplexTypes && (ReflectionUtils.isComplexType(dummy[key]))) {
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

  static isComplexType(property): boolean {
    return (typeof property === 'object' || Array.isArray(property || Object.prototype.toString.call(property) === '[object Date]'))
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
          if (ReflectionUtils.isComplexType(entity[c])) {
            row.push(JSON.stringify(entity[c]));
          } else {
            row.push(entity[c]);
          }
        });
      });
      rows.push(row);
    });
    console.log('returning ' + JSON.stringify(rows));
    return rows;
  }
}
