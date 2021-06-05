import { Component, OnDestroy, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { LayoutUtilsService } from '../../../../core/_base/crud';
import { Router } from '@angular/router';

import { UserManagementService } from '../user-management.service';

import { DataTableDirective } from 'angular-datatables';
import { TranslationService } from '../../../../core/_base/layout';

@Component({
	selector: 'kt-list',
	templateUrl: './list.component.html',
	styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

	userList: any = [];
	filterVal: any;
	response: any;
	selectedRow: number = 0;

	dtOptions: any = {};
	@ViewChild(DataTableDirective, { static: true })
	datatableElement: DataTableDirective;

	constructor(public dialog: MatDialog,
		public snackBar: MatSnackBar,
		public router: Router,
		private cd: ChangeDetectorRef,
		private userService: UserManagementService,
		private transServ: TranslationService,
		private translate: TranslateService
	) {
		let current_lng = this.transServ.getSelectedLanguage();
		this.translate.use(current_lng);
	}

	ngOnInit() {
		this.cd.markForCheck();
		this.dataTableCall();
	}

	public getUserList() {
		// this.userService.getUserList({}).subscribe((result) => {
		// 		this.getUserList = result.data;
		// 		this.cd.markForCheck();
		// 	},
		// 	err => {

		// 	});
	}

	addNewUser() {
		this.router.navigate(['user-manage/addedit']);
		// this.dialog.open(DialogDataExampleDialog);
	}

	editUser(userId: any) {
		this.router.navigate(['user-manage/addedit/' + userId]);
	}

	deleteUser(userId: any) {

		// this.userService.deleteUser({ userId : userId }).subscribe((result) => {
		//   this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
		//     dtInstance.draw();
		//   });

		// },
		// err => {

		// });
	}

	get_filterData($event) {
		this.filterVal = "";
		let value = $event.target.value;
		if (value) {
			this.filterVal = value;
		}
		//    console.log("filter val:", value);
		this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
			dtInstance.draw();
		});
		// console.log($event);

	}

	selectRow(index) {
		this.selectedRow = index;
	}

	public dataTableCall() {
		this.dtOptions = {
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

				dataTablesParameters.search.value = this.filterVal;
				// dataTablesParameters.search.closed_files=this.dateRange;
				// dataTablesParameters.search.date_fin=this.dateRange_fin;
				// dataTablesParameters.search.date_cls = this.dateRange_cls;

				// this.userService.getUserList(dataTablesParameters).subscribe(resp => {
				// 	this.response = resp;
				// 	if (this.response && this.response.data) {
				// 		this.userList = this.response.data;
				// 		//console.log(this.response.data)
				// 		this.cd.markForCheck();
				// 		callback({
				// 			recordsTotal: this.response.recordsTotal,
				// 			recordsFiltered: this.response.recordsFiltered,
				// 			data: []
				// 		});

				// 		// this.spinner.hide();
				// 	} async: true

				// });
			}
		};
	}


}
