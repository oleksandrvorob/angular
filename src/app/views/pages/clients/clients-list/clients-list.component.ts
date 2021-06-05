import { Component, OnDestroy, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { LayoutUtilsService } from '../../../../core/_base/crud';
import { Router } from '@angular/router';
import { CustomerModel } from '../../../../core/e-commerce';
import { ClientsService } from './../clients.service';

import { TranslationService, DatatableColumnModel } from '../../../../core/_base/layout';

import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
	selector: 'kt-clients-list',
	templateUrl: './clients-list.component.html',
	styleUrls: ['./clients-list.component.scss']
})
export class ClientsListComponent implements OnInit {

	dataSourcee: any = [];
	@ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
	selection = new SelectionModel<CustomerModel>(true, []);
	responsibleUsers = [];

	// dtOptions: DataTables.Settings = {};
	dtOptions: any = {};
	@ViewChild(DataTableDirective, { static: true })
	datatableElement: DataTableDirective;

	filterVal: any;
	columns: DatatableColumnModel[];

	canEdit: any = true;
	canDelete: any = true;
	currentUserRoleID: any;
	//toggle view all or inactive records
	veiwInactive: boolean = false;
	totalAmount: number = 0;
	startRecord: number = 0;
	endRecord: number = 0;
	istoggleViewChanged: boolean = true;
	selectedRow: number = 0;
	constructor(
		public dialog: MatDialog,
		public snackBar: MatSnackBar,
		public router: Router,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		private clientsServices: ClientsService,
		private cd: ChangeDetectorRef,
		private transServ: TranslationService
	) {

		let current_lng = this.transServ.getSelectedLanguage();
		this.translate.use(current_lng);

	}

	ngOnInit() {
		this.dataTableCall();
		this.currentUserRoleID = localStorage.getItem("logistic_login_user_type");

		this.columns = [
			{
				name: 'clientId',
				search: {
					value: ''
				}
			},
			{
				name: 'name1',
				search: {
					value: ''
				}
			},
			{
				name: 'name2',
				search: {
					value: ''
				}
			},
			{
				name: 'city',
				search: {
					value: ''
				}
			}
		];
	}

	goToUser(id) {
		this.router.navigate([`/clients/addedit/${id}`]);
	}

	ngOnDestroy() {

	}

	openDialog() {
		this.router.navigate(['clients/addedit']);
	}

	openInvoice() {
		this.router.navigate(['invoice']);
	}

	deleteClient(clientId: any) {
		this.clientsServices.deleteClient({ 'clientId': clientId }).subscribe((result) => {
			this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
				dtInstance.draw();
			});
		},
			err => {

			});
	}

	selectRow(index) {
		this.selectedRow = index;
	}

	response: any;
	onCheckViewAll(event) {
		this.istoggleViewChanged = true;
		this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
			dtInstance.draw();
		});
	}
	public dataTableCall() {
		this.dtOptions = {
			serverSide: true,
			processing: true,
			scrollY: "50vh",
			scroller: {
				loadingIndicator: true,
				boundaryScale: 0.75
			},
			ordering: true,
			searching: false,
			order: [],
			columnDefs: [
				{
					"targets": 'nosort',
					"orderable": false,
				}
			],
			dom: 'Bfrti',
			language: this.transServ.dataTableLang(),
			ajax: (dataTablesParameters: any, callback) => {
				dataTablesParameters.search.value = this.filterVal;
				dataTablesParameters.columns = this.columns;

				// for deleting api
				if (dataTablesParameters.length <= 2) {
					dataTablesParameters.length = 12;
				}

				//check if toggleView
				if (this.istoggleViewChanged) {
					dataTablesParameters.draw = 1;
					this.istoggleViewChanged = false;
				}

				dataTablesParameters.status = this.veiwInactive ? 0 : 1;

				this.clientsServices.getClientsList(dataTablesParameters).subscribe(resp => {
					this.response = resp;
					if (this.response && this.response.data) {
						this.dataSourcee = this.response.data;

						this.cd.markForCheck();
						callback({
							recordsTotal: this.response.recordsTotal,
							recordsFiltered: this.response.recordsFiltered,
							//data: this.response.data
							data: []
						});
						this.totalAmount = this.response.recordsTotal;
						this.startRecord = dataTablesParameters.start;
						if (this.totalAmount == 0) {
							this.startRecord = 0;
							this.endRecord = 0;
						}
						else {
							if (this.response.draw == 1) {
								if (dataTablesParameters.length > this.totalAmount)
									this.endRecord = this.totalAmount;
								else
									this.endRecord = dataTablesParameters.start + 20;
							}
							else {
								this.endRecord = dataTablesParameters.start + dataTablesParameters.length;
							}

						}

					}
					if (this.endRecord < this.totalAmount || this.totalAmount == 0 || dataTablesParameters.draw == 1)
						$('.dataTables_scrollBody thead').css('visibility', 'collapse');
					else
						$('.dataTables_scrollBody thead').css('visibility', 'unset');
				});
			},

			buttons: [
				'csv',
				'excel',
				'pdf',
				'print'
			],
			// columns: [
			// 	{
			// 		data: 'client_number',
			// 		// visible: false
			// 	},
			// 	{
			// 		data: 'name1',
			// 		// visible: false
			// 	},
			// 	{
			// 		data: 'name2',
			// 		// visible: false
			// 	},
			// 	{
			// 		data: 'zipcode',
			// 		// visible: false
			// 	},
			// 	{
			// 		data: 'city',
			// 		// visible: false
			// 	},
			// ]
		};
	}

	filterData($event) {
		this.filterVal = '';

		// global search

		if ($event.target.name === 'global_search') {
			this.filterVal = $event.target.value;
		} else {

			// individual column search

			this.columns.forEach( column => {
				if (column.name === $event.target.name) {
					column.search.value = $event.target.value;
				}
			});
		}

		this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
			dtInstance.page(1);
			dtInstance.draw();
		});
	}

}
