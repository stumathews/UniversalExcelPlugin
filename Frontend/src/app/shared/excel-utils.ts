import {ReflectionUtils} from './reflection-utils';
import {GetPortfolioRootResponse} from '@finbourne/lusidtypes/index';
import {StringUtils as StringUtils1} from './string-utils';

export class ExcelUtils {

  static xlsColumnDef: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
    'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
    'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']; 

  static EntitiesToGrid<T>(entities: T[], tableName: string, exclComplexTypes?: boolean): void {
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
}
