import { Component, OnInit, ViewChild, ChangeDetectorRef, ViewEncapsulation, EventEmitter } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { first } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../../components/dialog/dialog.component';

import { NgForm } from '@angular/forms';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { TranslationService } from '../../../../core/_base/layout';
import { TranslateService } from '@ngx-translate/core';

import { BankingService } from './banking.service';
import { CommonService } from './../../../../services/common.service';
import { DataTableDirective } from 'angular-datatables';
import { CompaniesService } from '../../companies/companies.service';

@Component({
	selector: 'kt-banking',
	templateUrl: './banking.component.html',
	styleUrls: ['./banking.component.scss']
})
export class BankingComponent implements OnInit {

	modalReference: any;
	editIndex: any = null;

	bankList: any = [];
	bankingFrm: FormGroup;
	@ViewChild(DataTableDirective, { static: true })
	datatableElement: DataTableDirective;

	dtOptions: any = {};
	response: any;
	filterVal: any;

	isValidIBAN: boolean;
	bankName: string;
	bankCode: string;
	bic: string;

	isUpdating: boolean = false;
	//toggle view all or inactive records
	veiwInactive: boolean = false;
	totalAmount: number = 0;
	startRecord: number = 0;
	endRecord: number = 0;
	selectedRow: number = 0;
	istoggleViewChanged: boolean = true;

	companyList = [];
	companyId: any;
	constructor(
		private route: ActivatedRoute,
		public router: Router,
		private fb: FormBuilder,
		private modalService: NgbModal,
		private translate: TranslateService,
		private transServ: TranslationService,
		private bankingService: BankingService,
		private commonService: CommonService,
		private companyservice: CompaniesService,
		private cd: ChangeDetectorRef,
		public dialog: MatDialog
	) {

		let current_lng = this.transServ.getSelectedLanguage();
		this.translate.use(current_lng);

	}

	ngOnInit() {
		this.bankingFrm = new FormGroup({
			bank_number: new FormControl(''),
			companyId: new FormControl(''),
			name: new FormControl(''),
			account_number: new FormControl(''),
			bank_code: new FormControl(''),
			iban: new FormControl(''),
			bic: new FormControl('')
		});
		this.companyservice.getAllCodes().subscribe(resp => {
			if (resp) {
				this.companyList = resp.data;
			}
		});
		this.dataTableCall();
	}

	newNumber() {
		this.bankingService.getNewBankNo().subscribe(result => {
			this.bankingFrm.controls[`bank_number`].setValue(result.newBankId);
		});
	}

	submit() {

		let frmdata = this.bankingFrm.value;

		if (this.bankingFrm.valid) {
			this.isUpdating = true;
			this.bankingService.addNewBank(frmdata).subscribe(resp => {
				if (resp) {
					this.bankList.push(resp);
					this.addedNewBank();
				}
			});

			this.modalClose();

		} else {
			$("#bankingFrm").addClass("validateFrm");
		}
	}

	update() {

		let frmdata = this.bankingFrm.value;
		if (this.bankingFrm.valid) {
			this.isUpdating = true;
			this.bankingService.editBank(this.editIndex, frmdata).subscribe(resp => {
				if (resp) {
					this.bankList.push(resp);
					this.addedNewBank();
				}
			});

			this.modalClose();

		} else {
			$("#bankingFrm").addClass("validateFrm");
		}
	}

	addedNewBank() {
		if (this.bankList.length > 0) {
			this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
				dtInstance.draw();
				this.modalClose();
			});
		}
	}

	modalClose() {
		this.editIndex = null;
		this.modalReference.close();
		this.bankingFrm.controls[`bank_number`].setValue("");
		this.bankingFrm.controls[`companyId`].setValue("");
		this.bankingFrm.controls[`name`].setValue("");
		this.bankingFrm.controls[`account_number`].setValue("");
		this.bankingFrm.controls[`bank_code`].setValue("");
		this.bankingFrm.controls[`iban`].setValue("");
		this.bankingFrm.controls[`bic`].setValue("");
		this.companyId = null;
		this.bankName = null;
		this.bic = null;
		this.bankCode = null;
	}


	addBank(content) {
		this.newNumber();
		this.modalReference = this.modalService.open(content, { centered: true, size: 'lg', backdrop: 'static', windowClass: 'dark-theme' });
	}

	editBank(bankId: any, content) {
		this.editIndex = bankId;
		this.bankDetails(bankId);
		this.modalReference = this.modalService.open(content, { centered: true, size: 'lg', backdrop: 'static', windowClass: 'dark-theme' });
	}

	bankDetails(bankId) {
		let bankDetail: any;
		this.bankingService.getBankById(bankId).subscribe(result => {
			bankDetail = result;

			if (bankDetail) {
				this.bankingFrm.controls[`bank_number`].setValue(bankDetail.bankId);
				this.bankingFrm.controls[`companyId`].setValue(bankDetail.companyId);
				this.bankingFrm.controls[`name`].setValue(bankDetail.name);
				this.bankingFrm.controls[`account_number`].setValue(bankDetail.account_number);
				this.bankingFrm.controls[`bank_code`].setValue(bankDetail.bank_code);
				this.bankingFrm.controls[`iban`].setValue(bankDetail.iban);
				this.bankingFrm.controls[`bic`].setValue(bankDetail.bic);
			}
		});
	}

	deleteBank(bankId: any) {

		this.bankingService.deleteBank(bankId).subscribe((result) => {
			this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
				dtInstance.draw();
			});
		},
			err => {

			});
	}

	filterData($event) {
		this.filterVal = "";
		let value = $event.target.value;
		if (value) {
			this.filterVal = value;
		}

		this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
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
				this.bankingService.getAllBanks(dataTablesParameters).subscribe(resp => {
					this.response = resp;
					if (this.response) {
						this.bankList = this.response.data;
						this.cd.markForCheck();
						callback({
							recordsTotal: this.response.recordsTotal,
							recordsFiltered: this.response.recordsFiltered,
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
			}
		};
	}

	refeshTable() {
		this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
			dtInstance.draw();
		});
	}

	validateIBAN(event) {
		let iban = event.target.value;
		if (iban.length > 15) {
			this.commonService.validateIBAN(iban)
				.subscribe(result => {
					this.bankName = result.bankData.name;
					this.bic = result.bankData.bic;
					this.bankCode = result.bankData.bankCode;
					this.isValidIBAN = result.valid;
				},
					error => {
						console.log("iban is invalid");
						this.bankName = null;
						this.bic = null;
						this.bankCode = null;
					}
				);
		} else {
			console.log("The length of IBAN should be bigger than 15.");
			this.bankName = null;
			this.bic = null;
			this.bankCode = null;
		}
	}

	canDeactivate(): Observable<boolean> | boolean {

		if (!this.isUpdating && this.bankingFrm.dirty) {
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

	selectCompany(companyId) {
		this.bankingFrm.controls[`companyId`].setValue(companyId);
	}

}
