import { Component, OnDestroy, OnInit, ChangeDetectorRef, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { first } from 'rxjs/operators';
import { DialogComponent } from '../../../components/dialog/dialog.component';

import { CustomerModel } from '../../../core/e-commerce';
import { PaymentRunService } from './payment-run.service';

import { TranslationService } from '../../../core/_base/layout';

import { DataTableDirective } from 'angular-datatables';
import { FormBuilder, FormGroup, FormControl , Validators } from '@angular/forms';

import { CompaniesService } from '../companies/companies.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'kt-payment-run',
  templateUrl: './payment-run.component.html',
  styleUrls: ['./payment-run.component.scss']
})
export class PaymentRunComponent implements OnInit {

	public paymentFrm: FormGroup;

	contractorList: any = [];
	invoiceList: any = [];
	companyList: any = [];
	contractorId: any;

	@ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
	selection = new SelectionModel<CustomerModel>(true, []);
	responsibleUsers = [];

	contractorDTOptions: DataTables.Settings = {};
	invoiceDTOptions: DataTables.Settings = {};

	@ViewChildren(DataTableDirective)
	datatableElement: QueryList<any>;

	filterVal: any;
	companyServiceResponse: any;
	isUpdating: boolean = false;
	selectedRow: number = 0;
	selectedInvoiceRow: number = 0;

	constructor(
		public dialog: MatDialog,
		public snackBar: MatSnackBar,
		public router: Router,
		private translate: TranslateService,
		private fb: FormBuilder,
		private cd: ChangeDetectorRef,
		private transServ: TranslationService,
		private paymentRunService: PaymentRunService,
		private companiesService: CompaniesService,
		private commonService: CommonService,
	) {

		let current_lng = this.transServ.getSelectedLanguage();
		this.translate.use(current_lng);

	}

	ngOnInit() {
		this.paymentFrm = new FormGroup({
			paid_amount: new FormControl(''),
			reference1: new FormControl(''),
			reference2: new FormControl(''),
			reference3: new FormControl(''),
			company: new FormControl(''),
			reference_value: new FormControl(''),
			total_amount: new FormControl(''),
		});

		this.contractorsDataTable();
		this.invoicesDataTable();
		this.getCompanyList();
	}

	ngOnDestroy() {
	}

	getAllContractors(){
		let response: any;
		this.paymentRunService.getAllContractors({}).subscribe(resp => {
			response = resp;
			if (response && response.data) {
				this.contractorList = response.data;
				this.cd.markForCheck();
			} async: true

		});
	}

	getCompanyList() {
		this.companiesService.getCompaniessList({}).subscribe((result) => {
			this.companyList = result.data;
			this.cd.markForCheck();
		},
		err => {

		});
	}

	public contractorsDataTable() {
		let response: any;
		this.contractorDTOptions = {
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
				this.paymentRunService.getAllContractors(dataTablesParameters).subscribe(resp => {
					response = resp;
					if (response && response.data) {
						this.contractorList = response.data;
						this.cd.markForCheck();
						callback({
							recordsTotal: response.recordsTotal,
							recordsFiltered: response.recordsTotal,
							data: []
						});
					} async: true

				});
			}
		};
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
				dataTablesParameters.search.value = this.filterVal;
				this.paymentRunService.getContractorInvoices(this.contractorId, dataTablesParameters).subscribe(resp => {
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
							recordsTotal: response.recordsTotal,
							recordsFiltered: response.recordsTotal,
							data: []
						});
					} async: true
				});
			}
		};
	}

	filterData($event) {
		this.filterVal = "";
		let value = $event.target.value;
		if (value) {
			this.filterVal = value;
		}

		this.datatableElement.forEach((dtElement: DataTableDirective, index: number) => {
			dtElement.dtInstance.then((dtInstance: any) => {
				dtInstance.draw();
			});
		});
	}

	selectContractor(contractor, $index){
		this.contractorId = contractor.contractorId;
		this.selectedRow = $index;
		this.datatableElement.forEach((dtElement: DataTableDirective, index: number) => {
			dtElement.dtInstance.then((dtInstance: any) => {
				if(index == 1){
					dtInstance.draw();
				}
			});
		});
	}

	selectInvoiceRow(index) {
		this.selectedInvoiceRow = index;
	}

	startPayment(){

	}

	canDeactivate(): Observable<boolean> | boolean{

		if (!this.isUpdating && this.paymentFrm.dirty) {
			this.isUpdating = false;

			const dialogRef = this.dialog.open(DialogComponent, {
				panelClass: ['dark-theme', 'custom-modalbox']
			});

			return dialogRef.afterClosed().pipe(map(result => {
				if (result === 'save') {
					this.startPayment();
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
