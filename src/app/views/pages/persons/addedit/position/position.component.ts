import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { TranslationService, DatatableColumnModel } from '../../../../../core/_base/layout';
import { DataTableDirective } from 'angular-datatables';
import { PersonsService } from '../../persons.service';

@Component({
	selector: 'kt-position',
	templateUrl: './position.component.html',
	styleUrls: ['./position.component.scss']
})
export class PositionComponent implements OnInit {

	dtOptions: {};

	dataSourcee: any = [];
	veiwInactive: boolean = false;
	totalAmount: number = 0;
	startRecord: number = 0;
	endRecord: number = 0;
	istoggleViewChanged: boolean = true;

	@ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
	responsibleUsers = [];
	filterVal: any;
	columns: DatatableColumnModel[];

	@ViewChild(DataTableDirective, { static: true })
	datatableElement: DataTableDirective;

	constructor(
		public dialog: MatDialog,
		public snackBar: MatSnackBar,
		public router: Router,
		private personService: PersonsService,
		private translate: TranslateService,
		private cd: ChangeDetectorRef,
		private transServ: TranslationService
	) {
		let current_lng = this.transServ.getSelectedLanguage();
		this.translate.use(current_lng);
	}

	ngOnInit() {
		this.dataTableCall();
		this.columns = [
			{
				name: 'position',
				search: {
					value: ''
				}
			},
			{
				name: 'city',
				search: {
					value: ''
				}
			},
			{
				name: 'zipcode',
				search: {
					value: ''
				}
			},
			{
				name: 'country',
				search: {
					value: ''
				}
			},
			{
				name: 'street',
				search: {
					value: ''
				}
			}
		];
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

	editComapny(id) {
		this.router.navigate([`/companies/addedit/${id}`]);
	}

	public getClientsList() {

		
	}
	addCompany() {
		this.router.navigate(['companies/addedit']);
		// this.dialog.open(DialogDataExampleDialog);
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
				dataTablesParameters.columns = this.columns;
				if (dataTablesParameters.length <= 2) {
					dataTablesParameters.length = 12;
				}
				// dataTablesParameters.search.closed_files=this.dateRange;
				// dataTablesParameters.search.date_fin=this.dateRange_fin;
				// dataTablesParameters.search.date_cls = this.dateRange_cls;

				//check if toggleView
				if (this.istoggleViewChanged){
					dataTablesParameters.draw = 1;
					this.istoggleViewChanged = false;
				}

				dataTablesParameters.status = this.veiwInactive ? 0 : 1;
				this.personService.getPositionList(dataTablesParameters).subscribe(resp => {
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
							else
								this.endRecord  = dataTablesParameters.start + dataTablesParameters.length;
						}
						$('.dataTables_scrollBody thead').css('visibility', 'collapse');
						// if(this.endRecord < this.totalAmount || this.totalAmount == 0 || dataTablesParameters.draw == 1)
						// 	$('.dataTables_scrollBody thead').css('visibility', 'collapse');
						// else
						// 	$('.dataTables_scrollBody thead').css('visibility', 'unset');
					} async: true

				});
			},
		};

	}
}
