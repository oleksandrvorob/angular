import { Component, OnInit, OnDestroy, ChangeDetectorRef, QueryList, ViewChildren } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { TranslationService } from '../../../../../core/_base/layout';
import { ClientsService } from '../../../clients/clients.service';
import { CommonService } from './../../../../../services/common.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

import * as $ from 'jquery';

@Component({
  selector: 'kt-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent implements OnInit {

	invoiceList: any = [];
	invoiceItems: any = [];
	invoiceId: number;
	clientId: number;
	invoiceDTOptions: DataTables.Settings = {};
	invoiceItemsDTOptions: DataTables.Settings = {};
	dtTrigger: Subject<any> = new Subject();
	selectedRow: number = 0;
	selectedItemRow: number = 0;
	@ViewChildren(DataTableDirective)
	datatableElement: QueryList<any>;

	constructor(
		private translate: TranslateService,
		private cd: ChangeDetectorRef,
		private transServ: TranslationService,
		private clientsService: ClientsService,
		private commonService: CommonService,
	) {

		let current_lng = this.transServ.getSelectedLanguage();
		this.translate.use(current_lng);

	}

  ngOnInit() {
	this.invoicesDataTable();
	this.invoiceItemsDataTable();
  }

  selectInvoice(invoice, $index){
	this.selectedRow = $index;
	this.invoiceId = invoice.id;
	this.datatableElement.forEach((dtElement: DataTableDirective, index: number) => {
		dtElement.dtInstance.then((dtInstance: any) => {
			if(index == 1){
				dtInstance.draw();
			}
		});
	});
  }

  selectInvoiceItem(index) {
	  this.selectedItemRow = index;
  }

  public invoicesDataTable() {
	let response: any;
	this.invoiceDTOptions = {
		pagingType: 'full_numbers',
		pageLength: 10,
		responsive: true,
		searching: false,
		lengthChange: false,
		serverSide: true,
		processing: true,
		order: [],
		columnDefs: [
			{
				"targets": 'nosort',
				"orderable": false
			}
		],
		language: this.transServ.dataTableLang(),
		ajax: (dataTablesParameters: any, callback) => {
			this.clientsService.getInvoicesList(dataTablesParameters).subscribe(resp => {
				response = resp;
				if (response && response.data) {
					this.invoiceList = response.data;
					this.invoiceList = this.invoiceList.map(item => (
						{
						...item,
						invoice_date: this.commonService.transformDate(item.invoice_date, 'dd.MM.yyyy'),
						})
					);
					this.cd.markForCheck();
					callback({
						recordsTotal: response.data.length,
						recordsFiltered: response.data.length,
						data: []
					});
				} async: true
			});
		}
	};
  }

  public invoiceItemsDataTable() {

	let response: any;
	this.invoiceItemsDTOptions = {
		pagingType: 'full_numbers',
		pageLength: 10,
		responsive: true,
		searching: false,
		lengthChange: false,
		serverSide: true,
		// processing: true,
		order: [],
		columnDefs: [
			{
				"targets": 'nosort',
				"orderable": false
			}
		],
		language: this.transServ.dataTableLang(),
		ajax: (dataTablesParameters: any, callback) => {
			this.clientsService.getInvoiceItemsList(this.invoiceId, dataTablesParameters).subscribe(resp => {
				response = resp;
				if (response && response.data) {
					this.invoiceItems = response.data;
					this.invoiceItems = this.invoiceItems.filter(item => item.invoiceId == this.invoiceId);
					this.cd.markForCheck();
					callback({
						recordsTotal: response.data.length,
						recordsFiltered: response.data.length,
						data: []
					});
				} async: true
			});
		}
	};
  }
}
