import {Component, OnDestroy, OnInit, ChangeDetectionStrategy, ChangeDetectorRef , ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { CommonService } from './../../../../../services/common.service';

import { TranslationService } from '../../../../../core/_base/layout';

import { DataTableDirective } from 'angular-datatables';

@Component({
	selector: 'kt-history',
	templateUrl: './history.component.html',
	styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

	historyData: any = [];
	menuItem: string = "company";
	filterVal: any ;

	dtOptions: DataTables.Settings = {};
	@ViewChild(DataTableDirective, { static: true })
	datatableElement: DataTableDirective;

	constructor(
		public dialog: MatDialog,
		public snackBar: MatSnackBar,
		public router: Router,
		private translate: TranslateService,
		private cd: ChangeDetectorRef,
		private transServ: TranslationService,
		private commonService: CommonService
		) {
			let current_lng = this.transServ.getSelectedLanguage();
			this.translate.use(current_lng);
		}

		ngOnInit() {
			this.cd.markForCheck();
			this.dataTableCall();
		}

		public getHistory() {
			this.commonService.getHistory({}).subscribe((result) => {
					this.historyData = result.data;
					this.cd.markForCheck();
				},
				err => {

				});
		}
		get_filterData($event){
			this.filterVal = "";
			let value = $event.target.value;
			if(value){
				this.filterVal = value;
			}
			this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
				dtInstance.draw();
			});
		}


		response : any;

		public dataTableCall(){
			this.dtOptions = {
				pagingType: 'full_numbers',
				pageLength: 10,
				responsive: true,
				searching: false,
				lengthChange: false,
				serverSide: true,
				processing: true,
				order:[],
				columnDefs: [
					{
						"targets": 'nosort',
						"orderable": false
					}
				],
				language: this.transServ.dataTableLang(),
				ajax: (dataTablesParameters: any, callback) => {

					dataTablesParameters.search.value = this.filterVal;
					dataTablesParameters.menuItem = this.menuItem;
					// dataTablesParameters.search.closed_files=this.dateRange;
					// dataTablesParameters.search.date_fin=this.dateRange_fin;
					// dataTablesParameters.search.date_cls = this.dateRange_cls;

					this.commonService.getHistory(dataTablesParameters).subscribe(resp => {
						this.response = resp;
						if(this.response && this.response.data){
							this.historyData = this.response.data;
							this.cd.markForCheck();
							callback({
								recordsTotal: this.response.recordsTotal,
								recordsFiltered: this.response.recordsFiltered,
								data: []
							});

							// this.spinner.hide();
						}async: true

					});
				}
			};
		}

	}
