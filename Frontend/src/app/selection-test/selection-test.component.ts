import { Component, OnInit } from '@angular/core';
/// <reference path='../node_modules/@types/office-js/index.d.ts' />
/// <reference path='../typings.d.ts' />

@Component({
  selector: 'app-selection-test',
  templateUrl: './selection-test.component.html',
  styleUrls: ['./selection-test.component.css']
})
export class SelectionTestComponent implements OnInit {

  selectionInfo: string = '';
  constructor() { }

  ngOnInit() {
  }
  
  getSelectionInfo() {
    Excel.run(context => {
        const currentWorksheet = context.workbook.worksheets.getActiveWorksheet();
        const expensesTable = currentWorksheet.tables.add('A1:D1', true /*hasHeaders*/);
        expensesTable.name = 'ExpensesTable';
        expensesTable.getHeaderRowRange().values =
          [['Date', 'Merchant', 'Category', 'Amount']];

        expensesTable.rows.add(null /*add at the end*/, [
          ['1/1/2017', 'The Phone Company', 'Communications', '120'],
          ['1/2/2017', 'Northwind Electric Cars', 'Transportation', '142.33'],
          ['1/5/2017', 'Best For You Organics Company', 'Groceries', '27.9'],
          ['1/10/2017', 'Coho Vineyard', 'Restaurant', '33'],
          ['1/11/2017', 'Bellows College', 'Education', '350.1'],
          ['1/15/2017', 'Trey Research', 'Other', '135'],
          ['1/15/2017', 'Best For You Organics Company', 'Groceries', '97.88']
        ]);
        expensesTable.columns.getItemAt(3).getRange().numberFormat = [['€#,##0.00']];
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
