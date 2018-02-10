import { Component, OnInit } from '@angular/core';
/// <reference path='../node_modules/@types/office-js/index.d.ts' />
/// <reference path='../typings.d.ts' />

import { ListPortfolioRootsResponse, ErrorResponse, GetPortfolioRootResponse, ErrorMessage, ResponseMeta, InternalId } from '@finbourne/lusidtypes';

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

  convertEntityToTable() {
    let portfoliosResponse: ListPortfolioRootsResponse;
    const mockPortfolios: GetPortfolioRootResponse[] = [];
    mockPortfolios.push(<GetPortfolioRootResponse>{
      name: 'portfolio1',
      id: <InternalId>{id: 'InternalId'},
      created: new Date(),
      error: <ErrorMessage>{},
      meta: <ResponseMeta>{},
      status: {},
      version: <any>{},
      properties: <any>{},
      details: <any>{},
      self: '',
      schema: '',
      referencePortfolioId: <InternalId>{ id:'referencePortfolioId'},
      referenceScope: 'referenceScope'
    });
    mockPortfolios.push(<GetPortfolioRootResponse>{
      name: 'portfolio2',
      id: <InternalId>{ id: 'InternalId2' },
      created: new Date(),
      error: <ErrorMessage>{},
      meta: <ResponseMeta>{},
      status: {},
      version: <any>{},
      properties: <any>{},
      details: <any>{},
      self: '',
      schema: '',
      referencePortfolioId: <InternalId>{ id: 'referencePortfolioId2' },
      referenceScope: 'referenceScope2'
    });


    const dummy = mockPortfolios[0];
    var columns: string[][] = [];
    var columnRows: string[] = [];
    for (let key in dummy) {
      if (dummy.hasOwnProperty(key) && typeof dummy[key] !== 'function') {
        columnRows.push(key);
      }
    }
    columns.push(columnRows);

    let rows: string[][] = [];
    
    // make rows
    mockPortfolios.forEach((portfolio: GetPortfolioRootResponse) => {
      let row: string[] = [];
      columns.forEach((column: string[]) => {
        column.forEach((c: string) => {
          row.push(portfolio[c]);
        });
      });
      rows.push(row);
    });

    // excel interation

    Excel.run(context => {
        const currentWorksheet = context.workbook.worksheets.getActiveWorksheet();
        //const expensesTable = currentWorksheet.tables.add('A1:D1', true /*hasHeaders*/);
        const expensesTable = currentWorksheet.tables.add('A1:M1', true /*hasHeaders*/);
        
        expensesTable.name = 'PortfolioTable';
        //expensesTable.getHeaderRowRange().values = columns;
        expensesTable.getHeaderRowRange().values = [['name', 'id', 'created', 'error', 'meta', 'status', 'version', 'properties', 'details', 'self', 'schema', 'referencePortfolioId', 'referenceScope']];

        expensesTable.rows.add(null /*add at the end*/, rows);
        //expensesTable.columns.getItemAt(3).getRange().numberFormat = [['€#,##0.00']];
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

    // end excel interaction
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
