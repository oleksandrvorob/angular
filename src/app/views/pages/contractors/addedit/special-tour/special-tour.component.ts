import { Component, OnInit, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { NgForm } from '@angular/forms';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { TranslationService } from '../../../../../core/_base/layout';
import { TranslateService } from '@ngx-translate/core';

import { CommonService } from './../../../../../services/common.service';
import { DaterangePickerComponent } from 'ng2-daterangepicker';
import { DataTableDirective } from 'angular-datatables';

import { ContractorsService } from './../../contractors.service';
import { PersonsService } from '../../../persons/persons.service';
import { OrderService } from '../../../orders/order.service';
import { CompaniesService } from '../../../companies/companies.service';
import { PriceHistoryComponent } from '../../../../../components/price-history/price-history.component';

@Component({
	selector: 'kt-special-tour',
	templateUrl: './special-tour.component.html',
	styleUrls: ['./special-tour.component.scss']
})
export class SpecialTourComponent implements OnInit {

	modalReference: any;

	public tour: any = {};
	editindex: any = null;
	orderId: any;

	// @ViewChild("createTourForm") tourFrm: NgForm;
	tourList: any = [];

	@Input() orderIdsList;
	@Input() contractorId: any;

	tourFrm: FormGroup;
	openFrm: FormGroup;


	@ViewChild(DataTableDirective, { static: false })
	datatableElement: DataTableDirective;

	daysOfWeek: any = [];
	personList: any = [];
	specialOrderTypeList: any = [];
	companyList = [];
	contractorOrderIdsList: any = [];
	orderExistIds: any = [];
	deletedOrderIds: any = [];
	priceBasisList: any = [];

	dtOptions: DataTables.Settings = {};
	dtContractorOptions: DataTables.Settings = {};
	flagDiv: boolean = false;
	customerName: string;
	response: any;
	priceList: any;
	priceType: string;

	con_pri: any;
	selectedRow: number = 0;

	@ViewChild(DaterangePickerComponent, { static: false })
	public date_of_expiryPicker: DaterangePickerComponent;
	public valid_from: DaterangePickerComponent;
	public dayPicker: DaterangePickerComponent;

	constructor(
		private route: ActivatedRoute,
		public router: Router, private fb: FormBuilder,
		private modalService: NgbModal,
		private translate: TranslateService, private transServ: TranslationService,
		private commonService: CommonService, private contractorsService: ContractorsService,
		private cd: ChangeDetectorRef,
		private personsService: PersonsService,
		private companyservice: CompaniesService,
		private orderService: OrderService,
		private dialog: MatDialog
	) {

		let current_lng = this.transServ.getSelectedLanguage();
		this.translate.use(current_lng);

		const allParams = this.route.snapshot.params;

		if (allParams && allParams.contractorId !== "") {
			this.contractorId = allParams.contractorId;
		}

	}

	ngOnInit() {
		this.tourFrm = new FormGroup({
			order_number: new FormControl(''),
			description: new FormControl(''),
			contractor_price: new FormControl(''),
			day: new FormControl(''),
			once_per_billing: new FormControl(''),
			no_customer_invoice: new FormControl(''),
			order_type: new FormControl(''),
			contractor: new FormControl(''),
			comment: new FormControl(''),
			status: new FormControl(0),
			billed_company: new FormControl(''),
			fuel_surcharge: new FormControl('')
		});
		this.openFrm = new FormGroup({
			companyId: new FormControl(''),
			type: new FormControl(''),
			description: new FormControl(''),
			amount: new FormControl(''),
			unit: new FormControl(''),
			price: new FormControl('')

		});
		this.companyservice.getCompaniessList({}).subscribe(resp => {
			if (resp) {
				this.companyList = resp.data;
			}
		});
		this.priceBasisList = this.commonService.priceBasis();
		this.specialOrderTypeList = this.commonService.specialOrderTypeList();
		this.valid_from = this.commonService.dateRancePickerOptions();
		this.dayPicker = this.commonService.dateRancePickerOptions();
		this.date_of_expiryPicker = this.commonService.dateRancePickerOptions();
		this.daysOfWeek = this.commonService.weekDays();
		this.dataTableCall();
		this.contractorsDatatable();
	}

	ngOnChanges() {
		if (this.orderIdsList && this.orderIdsList !== undefined) {
			if (this.orderIdsList && this.orderIdsList.length > 0) {
				for (const pdid of this.orderIdsList) {
					this.orderExistIds.push(pdid.orderId);
				}
			}
		}
	}

	submit(form: NgForm) {

		let frmdata = this.tourFrm.value;

		if (this.tourFrm.valid) {

			this.commonService.addeditOrder(frmdata).subscribe(resp => {
				if (resp) {
					this.contractorOrderIdsList.push(resp.newOrderId);
					this.addedNewOrder();
				}
			});
			this.modalClose();

		} else {
			$("#tourFrm").addClass("validateFrm");
		}
	}

	receiveOrderIdsList($event) {
		if ($event && $event > 0) {
			this.contractorOrderIdsList.push($event);
			this.orderExistIds.push($event);
			this.addedNewOrder();
		}
	}

	addedNewOrder() {
		if (this.contractorOrderIdsList.length > 0) {
			this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
				dtInstance.draw();
				this.modalClose();
			});
		}
	}

	selectRow(index) {
		this.selectedRow = index;
	}

	modalClose() {
		this.editindex = null;
		this.modalReference.close();
		this.tourFrm.controls['order_number'].setValue('');
		this.tourFrm.controls['description'].setValue('');
		this.tourFrm.controls['contractor_price'].setValue('');
		this.tourFrm.controls['day'].setValue('');
		this.tourFrm.controls['once_per_billing'].setValue('');
		this.tourFrm.controls['no_customer_invoice'].setValue('');
		this.tourFrm.controls['order_type'].setValue('');
		this.tourFrm.controls['contractor'].setValue('');
		this.con_pri = null;
	}


	addOrder(content) {
		this.newNumber();
		this.modalReference = this.modalService.open(content, { centered: true, size: 'lg', backdrop: 'static', windowClass: 'dark-theme' });
	}

	editContractorOrder(orderId: any, content){
		this.orderId = orderId;
		this.contractorOrderDetails();
		this.modalReference = this.modalService.open(content, { centered: true, size: 'lg', backdrop: 'static', windowClass: 'dark-theme' });
	}

	contractorOrderDetails() {
		this.orderService.getOrderDetails({ orderId: this.orderId }).subscribe(result => {
			this.response = result.data;
			if (this.response) {
				this.tourFrm.controls['order_number'].setValue(this.response.order_number);
				this.tourFrm.controls['description'].setValue(this.response.description);
				this.tourFrm.controls['contractor_price'].setValue(this.response.contractor_price);
				this.tourFrm.controls['day'].setValue(this.response.day.split(","));
				this.tourFrm.controls['once_per_billing'].setValue(this.response.once_per_billing);
				this.tourFrm.controls['no_customer_invoice'].setValue(this.response.no_customer_invoice);
				this.tourFrm.controls['order_type'].setValue(this.response.order_type);
				this.tourFrm.controls['contractor'].setValue(this.response.contractor_name);
			}
		});
	}

	newNumber() {
		this.commonService.getNewOrderNo().subscribe(result => {
			this.orderId = result.neworderId;
			this.tourFrm.controls[`order_number`].setValue(result.neworderId);
		});
	}

	deleteContractorOrder(ccpid, pid) {
		let contractorCOId = parseInt(ccpid);
		let contractorOId = parseInt(pid);
		if (contractorCOId > 0) {
			this.deletedOrderIds.push(contractorOId);
			var index2 = this.orderExistIds.indexOf(contractorOId);
			if (index2 > -1) {
				this.orderExistIds.splice(index2, 1);
				this.refeshTable();
			}
			this.refeshTable();
		}
		else if (contractorOId > 0) {
			var index = this.contractorOrderIdsList.indexOf(contractorOId);
			if (index > -1) {
				this.contractorOrderIdsList.splice(index, 1);
				this.refeshTable();
			}
		}
	}


	getContractorOrderData() {
		return { 'newOrderIds': this.contractorOrderIdsList, 'deleteContractorOrders': this.deletedOrderIds }
	}
	filterVal: any;

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
				dataTablesParameters.search.contractorId = this.contractorId;
				dataTablesParameters.search.newOrderIds = this.contractorOrderIdsList;
				dataTablesParameters.search.deletedOrderIds = this.deletedOrderIds;
				this.contractorsService.getOrderList(dataTablesParameters).subscribe(resp => {
					this.response = resp;
					if (this.response && this.response.data) {
						this.tourList = this.response.data;
						this.cd.markForCheck();
						callback({
							recordsTotal: this.response.recordsTotal,
							recordsFiltered: this.response.recordsFiltered,
							data: []
						});
						// this.spinner.hide();
					}
				});
			}
		};
	}

	async openDialog(event) {
		const dialogConfig = new MatDialogConfig();
		this.priceType = event.currentTarget.name;
		this.priceList = [];
		dialogConfig.disableClose = false;
		dialogConfig.autoFocus = false;
		dialogConfig.width = "auto";
		dialogConfig.height = "auto";
		dialogConfig.maxHeight = "80vh";
		dialogConfig.panelClass = ['dark-theme', 'custom-modalbox'];

		let params = {
			orderId: this.orderId,
			priceType: this.priceType
		};
		this.priceList = await this.commonService.getPriceList(params).toPromise();
		this.priceList = this.priceList.data.map(item => (
			{
			...item,
			valid_from: item.valid_from,
			date_of_expiry: item.date_of_expiry
			})
		);
		dialogConfig.data = {
			priceList: this.priceList
		};

		let dialogRef = this.dialog.open(PriceHistoryComponent, dialogConfig);

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				let priceHistoryData = {
					orderId: this.orderId,
					entityId: this.contractorId,
					priceType: this.priceType,
					insert: result,
					update: [],
					deletedIds: []
				};

				this.commonService.addNewPriceHistory(priceHistoryData)
					.subscribe((res: any) => {
					console.log("priceHistory result: ", res);
				});
			}
		});
	}

	public contractorsDatatable() {
		this.dtContractorOptions = {
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
				dataTablesParameters.search.contractorId = this.contractorId;
				dataTablesParameters.search.newOrderIds = this.contractorOrderIdsList;
				dataTablesParameters.search.deletedOrderIds = this.deletedOrderIds;

				this.personsService.getPersonList(dataTablesParameters).subscribe(resp => {
					this.response = resp;
					if (this.response && this.response.data) {
						this.personList = this.response.data;
						this.cd.markForCheck();
						callback({
							recordsTotal: this.response.recordsTotal,
							recordsFiltered: this.response.recordsFiltered,
							data: []
						});
					} async: true
				});
			}
		};
	}

	refeshTable() {
		this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
			dtInstance.draw();
		});
	}

	selectPerson(item) {
		this.customerName = item.first_name;
		this.flagDiv = false;
	}

}
