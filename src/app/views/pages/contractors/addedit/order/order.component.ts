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
import { ClientsService } from '../../../clients/clients.service';
import { OrderService } from '../../../orders/order.service';
import { CompaniesService } from '../../../companies/companies.service';
import { PriceHistoryComponent } from '../../../../../components/price-history/price-history.component';
import { CalendarValidator } from '../../../../../validators/calendar.validator';

@Component({
	selector: 'kt-order',
	templateUrl: './order.component.html',
	styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
	@Input() orderIdsList;
	@Input() isAddMode;
	@Input() contractorId: any;

	modalReference: any;
	tourFrm: FormGroup;

	@ViewChild(DataTableDirective, { static: false })
	datatableElement: DataTableDirective;

	orderId: any;
	public tour: any = {};
	editindex: any = null;
	dtOptions: DataTables.Settings = {};
	dtCustomerOptions: DataTables.Settings = {};
	flagDiv: boolean = false;
	customerName: string;
	customerNumber: string;
	response: any;
	priceType: string;
	filterVal: any;
	selectedRow: number = 0;
	con_pri: any;
	con_pri_week: any;
	con_pri_weekend: any;
	matcher = new CalendarValidator();

	daysOfWeek: any = [];
	clientList: any = [];
	tourList: any = [];
	orderTypeList: any = [];
	priceList: any = [];
	addedNewpriceList: any = [];
	billed_CompanyList: any = [];
	contractorOrderIdsList: any = [];
	selectedOrderType: number;
	selectedPriceBasis: number;
	orderExistIds: any = [];
	deletedOrderIds: any = [];
	priceBasisList: any = [];

	@ViewChild(DaterangePickerComponent, { static: false })
	public date_of_expiryPicker: DaterangePickerComponent;
	public valid_from: DaterangePickerComponent;
	public dayPicker: DaterangePickerComponent;

	constructor(
		private route: ActivatedRoute,
		public router: Router, private fb: FormBuilder,
		private modalService: NgbModal,
		private translate: TranslateService,
		private transServ: TranslationService,
		private commonService: CommonService,
		private companiesService: CompaniesService,
		private contractorsService: ContractorsService,
		private cd: ChangeDetectorRef,
		private clientService: ClientsService,
		private dialog: MatDialog,
		private orderService: OrderService,
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
			price_basis: new FormControl(''),
			day: new FormControl(''),
			once_per_billing: new FormControl(''),
			no_customer_invoice: new FormControl(''),
			order_type: new FormControl(''),
			contractor_valid_from: new FormControl(''),
			contractor_date_of_expiry: new FormControl(''),
			contractor: new FormControl(''),
			contractor_price_week: new FormControl(''),
			contractor_price_weekend: new FormControl(''),
			comment: new FormControl(''),
			status: new FormControl(1),
			billed_company: new FormControl('')
		});

		this.priceBasisList = this.commonService.priceBasis();
		this.orderTypeList = this.commonService.orderTypeList();
		this.valid_from = this.commonService.dateRancePickerOptions();
		this.dayPicker = this.commonService.dateRancePickerOptions();
		this.date_of_expiryPicker = this.commonService.dateRancePickerOptions();
		this.daysOfWeek = this.commonService.weekDays();

		this.selectedOrderType = 0;
		this.selectedPriceBasis = 3;

		this.dataTableCall();
		this.customerDataTable();
		this.getCompanyList();
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
		frmdata.contractor_valid_from = this.commonService.convertDateforISO(frmdata.contractor_valid_from);
		frmdata.contractor_date_of_expiry = this.commonService.convertDateforISO(frmdata.contractor_date_of_expiry);
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

	modalClose() {
		this.editindex = null;
		this.modalReference.close();
		this.tourFrm.controls['order_number'].setValue('');
		this.tourFrm.controls['description'].setValue('');
		this.tourFrm.controls['contractor_price'].setValue('');
		this.tourFrm.controls['price_basis'].setValue('');
		this.tourFrm.controls['day'].setValue('');
		this.tourFrm.controls['once_per_billing'].setValue('');
		this.tourFrm.controls['no_customer_invoice'].setValue('');
		this.tourFrm.controls['order_type'].setValue('');
		this.tourFrm.controls['contractor'].setValue('');
		this.tourFrm.controls['contractor_price_week'].setValue('');
		this.tourFrm.controls['contractor_price_weekend'].setValue('');
		this.tourFrm.controls['contractor_valid_from'].setValue('');
		this.tourFrm.controls['contractor_date_of_expiry'].setValue('');
		this.con_pri_week = null;
		this.con_pri_weekend = null;
		this.con_pri = null;
		this.selectedOrderType = null;
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
				this.tourFrm.controls['price_basis'].setValue(this.response.price_basis);
				this.tourFrm.controls['day'].setValue(this.response.day.split(","));
				this.tourFrm.controls['once_per_billing'].setValue(this.response.once_per_billing);
				this.tourFrm.controls['no_customer_invoice'].setValue(this.response.no_customer_invoice);
				this.tourFrm.controls['order_type'].setValue(this.response.order_type);
				this.tourFrm.controls['contractor'].setValue(this.response.contractor_name);
				this.tourFrm.controls['contractor_price_week'].setValue(this.response.contractor_price_week);
				this.tourFrm.controls['contractor_price_weekend'].setValue(this.response.contractor_price_weekend);

				if (this.response.contractor_valid_from == '0000-00-00') {
					this.tourFrm.controls['contractor_valid_from'].setValue('');
				} else {
					this.tourFrm.controls['contractor_valid_from'].setValue(this.commonService.convertDateforCustomFormat(this.response.contractor_valid_from));
				}
				if (this.response.contractor_date_of_expiry == '0000-00-00') {
					this.tourFrm.controls['contractor_date_of_expiry'].setValue('');
				} else {
					this.tourFrm.controls['contractor_date_of_expiry'].setValue(this.commonService.convertDateforCustomFormat(this.response.contractor_date_of_expiry));
				}
			}
		});
	}

	newNumber() {
		this.commonService.getNewOrderNo().subscribe(result => {
			this.orderId = result.neworderId;
			this.tourFrm.controls[`order_number`].setValue( (this.customerNumber || "0000000000") + this.orderId);
		});
	}

	gettourList() {
		return this.tourList;
	}

	onClickCustomerTable(evt){
		const parentId = evt.target.parentNode.id;
		if (parentId !== 'customer_Item') evt.stopPropagation();
	}

	async openDialog(event) {
		this.priceType = event.currentTarget.name;
		this.priceList = [];
		const dialogConfig = new MatDialogConfig();
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

	date_of_expirySelect(value: any, datepicker?: any) {

		let start = value.start;
		let date_of_expiry = this.commonService.transformDate(start, 'dd.MM.yyyy');
		if (this.tourFrm.value.contractor_date_of_expiry == date_of_expiry) {
			this.tourFrm.controls[`contractor_date_of_expiry`].setValue(date_of_expiry);
		}
	}

	valid_fromSelect(value: any, datepicker?: any) {

		let start = value.start;
		let valid_from = this.commonService.transformDate(start, 'dd.MM.yyyy');
		if (this.tourFrm.value.contractor_valid_from == valid_from) {
			this.tourFrm.controls[`contractor_valid_from`].setValue(valid_from);
		}
	}

	dateApplied(e: any) {
		this.tourFrm.controls[e.event.currentTarget.name].setValue(this.commonService.transformDate(e.picker.startDate, 'dd.MM.yyyy'));
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
		return { 'newOrderIds': this.contractorOrderIdsList, 'deleteContractorOrders': this.deletedOrderIds, 'priceHistoryList': this.addedNewpriceList }
	}

	refeshTable() {
		this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
			dtInstance.draw();
		});
	}

	selectCustomer(item) {
		this.customerName = item.name1;
		this.tourFrm.controls[`order_number`].setValue(item.client_number + this.orderId);
		this.flagDiv = false;
	}

	selectRow(index) {
		this.selectedRow = index;
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
					}

				});
			}
		};
	}


	public customerDataTable() {

		let response: any;

		this.dtCustomerOptions = {
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

				this.clientService.getClientsList(dataTablesParameters).subscribe(resp => {
					response = resp;
					if (response && response.data) {
						this.clientList = response.data;
						this.cd.markForCheck();
						callback({
							recordsTotal: response.recordsTotal,
							recordsFiltered: response.recordsFiltered,
							data: []
						});

					} async: true

				});
			}
		};
	}

	public getCompanyList() {
		this.companiesService.getCompaniessList({}).subscribe(response => {
			this.billed_CompanyList = response.data;
		});
	}
}
