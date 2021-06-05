import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { first } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../components/dialog/dialog.component';

import { NgForm } from '@angular/forms';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { TranslationService } from '../../../core/_base/layout';
import { TranslateService } from '@ngx-translate/core';

import { UserManagementService } from './user-management.service';
import { DataTableDirective } from 'angular-datatables';

@Component({
	selector: 'kt-user-management',
	templateUrl: './user-management.component.html',
	styleUrls: ['./user-management.component.scss']
})

export class UserManagementComponent implements OnInit {
	@ViewChild(DataTableDirective, { static: true }) 	datatableElement: DataTableDirective;

	modalReference: any;
	editIndex: any = null;
	userList: any = [];
	userInfoFrm: FormGroup;
	dtOptions: any = {};
	response: any;
	filterVal: any;
	progress: any;
	isUpdating: boolean = false;
	//toggle view all or inactive records
	veiwInactive: boolean = false;
	totalAmount: number = 0;
	startRecord: number = 0;
	endRecord: number = 0;
	selectedRow: number = 0;
	istoggleViewChanged: boolean = true;
	constructor(
		private route: ActivatedRoute,
		public router: Router,
		private fb: FormBuilder,
		private modalService: NgbModal,
		private translate: TranslateService,
		private transServ: TranslationService,
		private userManagementService: UserManagementService,
		private cd: ChangeDetectorRef,
		public dialog: MatDialog
	) {
		let current_lng = this.transServ.getSelectedLanguage();
		this.translate.use(current_lng);
	}

	ngOnInit() {
		this.userInfoFrm = new FormGroup({
			user_id: new FormControl(''),
			user_name: new FormControl(''),
			email: new FormControl(''),
			password: new FormControl(''),
			profile_pic: new FormControl('')
		});

		this.dataTableCall();
	}

	newNumber() {
		this.userManagementService.getNewUserNo().subscribe(result => {
			this.userInfoFrm.controls[`user_id`].setValue(result.newUserId);
		});
	}

	addedNewUser() {
		if (this.userList.length > 0) {
			this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
				dtInstance.draw();
				this.modalClose();
			});
		}
	}

	modalClose() {
		this.editIndex = null;
		this.modalReference.close();
		this.userInfoFrm.controls[`user_id`].setValue("");
		this.userInfoFrm.controls[`user_name`].setValue("");
		this.userInfoFrm.controls[`email`].setValue("");
		this.userInfoFrm.controls[`password`].setValue("");
		this.userInfoFrm.controls[`profile_pic`].setValue("");
	}

	editUser(userId: any, content) {
		this.editIndex = userId;
		this.userDetails(userId);
		this.modalReference = this.modalService.open(content, { centered: true, size: 'lg', backdrop: 'static', windowClass: 'dark-theme' });
	}

	addUser(content) {
		this.newNumber();
		this.modalReference = this.modalService.open(content, { centered: true, size: 'lg', backdrop: 'static', windowClass: 'dark-theme' });
	}

	deleteUser(userId: any) {
		this.userManagementService.deleteUser({ 'userId': userId }).subscribe((result) => {
			this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
				dtInstance.draw();
			});
		},
			err => {

			});
	}

	userDetails(userId) {
		let userDetail: any;
		this.userManagementService.getUserDetails({ 'userId': userId }).subscribe(result => {
			userDetail = result;

			if (userDetail) {
				this.userInfoFrm.controls[`user_id`].setValue(userDetail.userId);
				this.userInfoFrm.controls[`user_name`].setValue(userDetail.user_name);
				this.userInfoFrm.controls[`email`].setValue(userDetail.email);
				this.userInfoFrm.controls[`password`].setValue(userDetail.password);
				this.userInfoFrm.controls[`profile_pic`].setValue(userDetail.profile_pic);
			}
		});
	}

	submit() {

		let frmData = this.userInfoFrm.value;

		if (this.userInfoFrm.valid) {
			this.isUpdating = true;
			this.userManagementService.addNewUser(toFormData(frmData)).subscribe(resp => {
				if (resp) {
					this.userList.push(resp);
					this.addedNewUser();
				}
			});

			this.modalClose();

		} else {
			$("#bankingFrm").addClass("validateFrm");
		}
	}

	update() {

		let frmData = this.userInfoFrm.value;

		if (this.userInfoFrm.valid) {
			this.isUpdating = true;
			this.userManagementService.updateUser(this.editIndex, toFormData(frmData)).subscribe(resp => {
				if (resp) {
					this.userList.push(resp);
					this.addedNewUser();
				}
			});

			this.modalClose();

		} else {
			$("#bankingFrm").addClass("validateFrm");
		}
	}

	filterData($event) {
		this.filterVal = "";
		let value = $event.target.value;
		if (value) {
			this.filterVal = value;
		}

		this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
			dtInstance.page(1);
			dtInstance.draw();
		});

	}

	onCheckViewAll(event) {
		this.istoggleViewChanged = true;
		this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
			dtInstance.draw();
		});
	}

	selectRow(index) {
		this.selectedRow = index;
	}

	public dataTableCall() {
		this.dtOptions = {
			serverSide: true,
			processing: true,
			scrollY: "50vh",
			scroller: {
				loadingIndicator: true,
				boundaryScale: 1
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
				if (dataTablesParameters.length <= 2){
					dataTablesParameters.length = 12;
				}

				//check if toggleView
				if (this.istoggleViewChanged){
					dataTablesParameters.draw = 1;
					this.istoggleViewChanged = false;
				}

				dataTablesParameters.status = this.veiwInactive ? 0 : 1;
				this.userManagementService.getAllUsers(dataTablesParameters).subscribe(resp => {
					this.response = resp;
					if (this.response && this.response.data) {
						this.userList = this.response.data;
						this.cd.markForCheck();
						callback({
							recordsTotal: this.response.recordsTotal,
							recordsFiltered: this.response.recordsFiltered,
							//data: this.response.data
							data: []
						});

						this.totalAmount = this.response.recordsTotal;
							this.startRecord = dataTablesParameters.start;
							if (this.totalAmount == 0){
								this.startRecord = 0;
								this.endRecord = 0;
							}
							else{
								if ( this.response.draw == 1){
									if ( dataTablesParameters.length > this.totalAmount)
										this.endRecord = this.totalAmount;
									else
										this.endRecord = dataTablesParameters.start + 20;
								}
								else{
									this.endRecord  = dataTablesParameters.start + dataTablesParameters.length;
								}
							}
						}
						if(this.endRecord < this.totalAmount || this.totalAmount == 0 || dataTablesParameters.draw == 1)
							$('.dataTables_scrollBody thead').css('visibility', 'collapse');
						else
							$('.dataTables_scrollBody thead').css('visibility', 'unset');
				});
			}
		};
	}

	refeshTable() {
		this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
			dtInstance.draw();
		});
	}

	canDeactivate(): Observable<boolean> | boolean {

		if (!this.isUpdating && this.userInfoFrm.dirty) {
			this.isUpdating = false;

			const dialogRef = this.dialog.open(DialogComponent, {
				panelClass: ['dark-theme', 'custom-modalbox']
			});

			return dialogRef.afterClosed().pipe(map(result => {
				if (result === 'save') {
					this.submit();
					return true;

				} else if (result === 'discard') {
					this.ngOnInit();
					return true;
				} else if (result === 'cancel') {
					return false;
				}
			}), first());
		}
		return true;
	}
}

export function toFormData<T>( formValue: T ) {
	const formData = new FormData();

	for ( const key of Object.keys(formValue) ) {
	  const value = formValue[key];
	  formData.append(key, value);
	}

	return formData;
}
