import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ContractorsService } from './../contractors.service';
import { TranslationService, DatatableColumnModel } from '../../../../core/_base/layout';

import { DataTableDirective } from 'angular-datatables';

@Component({
	selector: 'kt-list',
	templateUrl: './list.component.html',
	styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

	dataSourcee: any = [];
	displayedColumns = ['name1', 'name2', 'street', 'email', 'actions'];
	@ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

	responsibleUsers = [];

	dtOptions: {};
	@ViewChild(DataTableDirective, { static: true })
	datatableElement: DataTableDirective;

	filterVal: any ;
	columns: DatatableColumnModel[];
	veiwInactive: boolean = false;
	totalAmount: number = 0;
	startRecord: number = 0;
	endRecord: number = 0;
	selectedRow: number = 0;
	istoggleViewChanged: boolean = true;

	constructor(
		public dialog: MatDialog,
		public snackBar: MatSnackBar,
		public router: Router,
		private contractorsService: ContractorsService,
		private translate: TranslateService,
		private cd: ChangeDetectorRef,
		private transServ: TranslationService
	) {

		let current_lng = this.transServ.getSelectedLanguage();
		this.translate.use(current_lng);
	}

	ngOnInit() {
		// this.getContractorsList();
		this.dataTableCall();
		this.columns = [
			{
				name: 'contractor_number',
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
		this.router.navigate([`/contractors/addedit/${id}`]);
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
				boundaryScale: 0.5
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
				// for deleting api
				if (dataTablesParameters.length <= 2) {
					dataTablesParameters.length = 12;
				}

				//check if toggleView
				if (this.istoggleViewChanged) {
					dataTablesParameters.draw = 1;
					this.istoggleViewChanged = false;
				}
				dataTablesParameters.columns = this.columns;
				dataTablesParameters.status = this.veiwInactive ? 0 : 1;

				if(Number.isNaN(dataTablesParameters.start))
					dataTablesParameters.start = 0;

				this.contractorsService.getContractorsList(dataTablesParameters).subscribe(resp => {
					this.response = resp;
					if (this.response && this.response.data) {
						this.dataSourcee = this.response.data;
						this.cd.markForCheck();
						callback({
							recordsTotal: this.response.recordsTotal,
							recordsFiltered: this.response.recordsFiltered,
							data: []
						});
						// this.spinner.hide();
						this.totalAmount = this.response.recordsTotal;
						this.startRecord = dataTablesParameters.start;
						if(this.startRecord == null)
							this.startRecord = 0;
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
					// $('.dataTables_scrollBody thead').css('visibility', 'collapse');
					if (this.endRecord < this.totalAmount || this.totalAmount == 0 || dataTablesParameters.draw == 1)
						$('.dataTables_scrollBody thead').css('visibility', 'collapse');
					else
						$('.dataTables_scrollBody thead').css('visibility', 'unset');
				});
			},
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

	addNewContractor() {
		this.router.navigate(['contractors/addedit']);
		// this.dialog.open(DialogDataExampleDialog);
	}

	deleteContractor(contractorId: any) {
		this.contractorsService.deleteContractor({ 'contractorId': contractorId }).subscribe((result) => {
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
}
