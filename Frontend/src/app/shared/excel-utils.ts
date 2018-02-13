import {ReflectionUtils} from './reflection-utils';
import {GetPortfolioRootResponse} from '@finbourne/lusidtypes/index';
import { StringUtils as StringUtils1 } from './string-utils';


export interface TableChange<T> {
  change: string;
  value: T;
}

export class ExcelUtils {


  static xlsColumnDef: string[] = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
    'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
    'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
  ];

  static EntitiesToGrid<T>(entities: T[], tableName: string, exclComplexTypes: boolean = true): void {
    Excel.run(context => {
        const cols = ReflectionUtils.getEntityProperties<T>(entities[0], exclComplexTypes);
        cols[0].sort(); // sort columns alphabeticallly

        const rows = ReflectionUtils.getEntitiesPropertyValues<T>(entities, cols);

        // Turn camel case into display case ie. myNameIsEarl becomes My Name Is Earl
        cols[0] = cols[0].map(item => { return StringUtils1.Displayify(item); });
        const currentWorksheet = context.workbook.worksheets.getActiveWorksheet();

        // Work out the range we need based on the number of columns we have
        const range = 'A1:' + StringUtils1.xlsColumnDef[cols[0].length - 1] + '1';
        const expensesTable = currentWorksheet.tables.add(range, true /*hasHeaders*/);
        expensesTable.name = tableName;
        expensesTable.getHeaderRowRange().values = cols;
        expensesTable.rows.add(null /*add at the end*/, rows);
        expensesTable.getRange().format.autofitColumns();
        expensesTable.getRange().format.autofitRows();
        return context.sync();
      })
      .catch(error => {
        console.log(`Error: ${error}`);
        if (error instanceof OfficeExtension.Error) {
          console.log(`Debug info: ${JSON.stringify(error.debugInfo)}`);
        }
      });
  }


  static SyncTable<T>(entities: T[], tableName: string, exclComplexTypes: boolean = true): OfficeExtension.IPromise<any> {
    // Get the named table.
    // Get the number of rows, if its diffirenct find difdirent rows from the bottom, create those entries
    let changes: TableChange<T>[] = [];
    //
    return Excel.run(context => {
      const currentWorksheet = context.workbook.worksheets.getActiveWorksheet();
      var table = currentWorksheet.tables.getItemOrNullObject(tableName);
      var bodyRange;
      return  context.sync().then(tableResult => {
        // now should or should not have table?
        if (table.isNullObject) {
          // empty table - normal entityToGrid
          console.log('Original row count is ' + entities.length);
          ExcelUtils.EntitiesToGrid(entities, tableName, exclComplexTypes);
        } else {
          // Existing table, get table and check the number of extra rows
          bodyRange = table.getDataBodyRange().load(['values', 'rowCount']); // cant use yet
          return context.sync().then(dataBodyResult => {
            console.log('RowCount is : ' + bodyRange.rowCount);
            if (bodyRange.rowCount > entities.length) {
              // get the added rows
              var diffCount = bodyRange.rowCount - entities.length;
              for (var i = 0; i < diffCount; i++) {
                var itemIndex = entities.length + i;
                var result = bodyRange.values[itemIndex];
                var obj: T = ReflectionUtils.toObject<T>(result, ReflectionUtils.getEntityProperties(entities[0], exclComplexTypes)[0].sort());
                var change: TableChange<T> = { change: 'a', value: <T>obj };
                changes.push(change);
                console.log('new row: ' + JSON.stringify(result));
              }
              //return new Promise<TableChange<T>[]>((resolve, reject) => { resolve(changes); });
              return context.sync();
            } else if (bodyRange.rowCount > entities.length) {
              // note which rows were removed and get them from the original entities
            }
            //return new Promise<TableChange<T>[]>((resolve, reject) => { resolve(changes); });
            return context.sync();
          });
        }
        
      })
    }).then(value => {
         return new OfficeExtension.Promise((resolve, reject) => resolve(changes));
      })
      .catch(error => {
      console.log(`Error: ${error}`);
      if (error instanceof OfficeExtension.Error) {
        console.log(`Debug info: ${JSON.stringify(error.debugInfo)}`);
      }
    });
    
    
  }
}

/*
Excel.run(context => {
    const currentWorksheet = context.workbook.worksheets.getActiveWorksheet();
    var table = currentWorksheet.tables.getItemOrNullObject(tableName);
    var bodyRange;
    context.sync().then(tableResult => {
      // now should or should not have table?
      if (table.isNullObject) {
        // empty table - normal entityToGrid
        console.log('Original row count is ' + entities.length);
        ExcelUtils.EntitiesToGrid(entities, tableName);
      } else {
        // Existing table, get table and check the number of extra rows
        bodyRange = table.getDataBodyRange().load(['values', 'rowCount']); // cant use yet
      }
      context.sync().then(dataBodyResult => {
        console.log('RowCount is : ' + bodyRange.rowCount);
        if (bodyRange.rowCount > entities.length) {
          // get the added rows
          var diffCount = bodyRange.rowCount - entities.length;
          for (var i = 0; i < diffCount; i++) {
            var itemIndex = entities.length + i;
            var result = bodyRange.values[itemIndex];
            var obj: T = ReflectionUtils.toObject<T>(result);
            var change: TableChange<T> = { change: 'a', value: obj };
            changes.push(change);
            console.log('new row: ' + JSON.stringify(result));
          }
          return new Promise<TableChange<T>[]>((resolve, reject) => { resolve(changes); });
          //return context.sync();
        } else if (bodyRange.rowCount > entities.length) {
          // note which rows were removed and get them from the original entities
        }
        return new Promise<TableChange<T>[]>((resolve, reject) => { resolve(changes); });
        //return context.sync();
      });
    });
  }).catch(error => {
    console.log(`Error: ${error}`);
    if (error instanceof OfficeExtension.Error) {
      console.log(`Debug info: ${JSON.stringify(error.debugInfo)}`);
    }
  });

  });
 */
