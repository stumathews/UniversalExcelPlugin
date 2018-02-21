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


  static SyncTable<T>(entities: T[], tableName: string, sheetName: string, exclComplexTypes: boolean = true): OfficeExtension.
    IPromise<any> {
    return Excel.run(context => {
      // Get the named table.
      // Get the number of rows, if its diffirenct find difdirent rows from the bottom, create those entries
      let changes: TableChange<T>[] = [];
      const desiredSheetName = sheetName;
      var sheet = context.workbook.worksheets.getItem(desiredSheetName);
      sheet.activate();

        return context.sync()
          .then((ok) => {   /* Should have switch to correct sheet. */ },
                (fail) => { /* could not switch to correct sheet, ok create it and then switch to it */
                var sheets = context.workbook.worksheets;
                sheet = sheets.add(desiredSheetName);
                sheet.activate();
                sheet.load('name, position');
                return context.sync().then((created) => { }, (failed) => {
                  // could not create a new sheet, try create a tmp one and then rename it
                  var sheets = context.workbook.worksheets;
                  sheet = sheets.add('temp');
                  sheet.activate();
                  sheet.load('name, position');
                  return context.sync().then((worked) => {
                    sheet.name = desiredSheetName;
                    return context.sync();
                  }, (failed) => {});
                });
                })
          .then(ok => {
            // ok we should be on the right sheet now
            var table = sheet.tables.getItemOrNullObject(tableName);
            var bodyRange: Excel.Range;
            return context.sync().then(got_table_ok => {
              if (table.isNullObject) {
                // empty table - normal entityToGrid
                console.log('Original row count is ' + entities.length);
                ExcelUtils.EntitiesToGrid(entities, tableName, exclComplexTypes);
              } else {
                // Existing table, get table and check the number of extra rows
                bodyRange = table.getDataBodyRange().load(['values', 'rowCount']); // cant use yet
                return context.sync().then(got_bodyRange_ok => {
                  console.log('RowCount is : ' + bodyRange.rowCount);
                  if (bodyRange.rowCount > entities.length) {
                    // get the added rows
                    const diffCount = bodyRange.rowCount - entities.length;
                    for (var i = 0; i < diffCount; i++) {
                      const itemIndex = entities.length + i;
                      const result = bodyRange.values[itemIndex];
                      const obj: T = ReflectionUtils.toObject<T>(result, ReflectionUtils.getEntityProperties(entities[0], exclComplexTypes)[0].sort());
                      const change: TableChange<T> = { change: 'a', value: <T>obj };
                      changes.push(change);
                      console.log('new row: ' + JSON.stringify(result));
                    }
                    return context.sync();
                  } else if (bodyRange.rowCount > entities.length) {
                    // note which rows were removed and get them from the original entities
                  }
                  return context.sync();
                });
              }
          }).then(value => {
              // the last thing we want to do after everything is complete is return the changes we've detected
            return new OfficeExtension.Promise((resolve, reject) => resolve(changes));
          });
      }, fail=>{})
      .catch(error => {
        console.log(`Error: ${error}`);
        if (error instanceof OfficeExtension.Error) {
          console.log(`Debug info: ${JSON.stringify(error.debugInfo)}`);
        }
      });
    });
  }
}

