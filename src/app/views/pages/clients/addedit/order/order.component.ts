import { Component, OnInit, Input, ViewChild, ChangeDetectorRef, ViewEncapsulation, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientsService } from '../../../clients/clients.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { NgForm } from '@angular/forms';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { TranslationService, DatatableColumnModel } from '../../../../../core/_base/layout';
import { TranslateService } from '@ngx-translate/core';

import { CommonService } from './../../../../../services/common.service';
import { CompaniesService } from '../../../companies/companies.service';
import { DaterangePickerComponent } from 'ng2-daterangepicker';
import { DataTableDirective } from 'angular-datatables';
import { PersonsService } from '../../../persons/persons.service';
import { OrderService } from '../../../orders/order.service';

import { PriceHistoryComponent } from '../../../../../components/price-history/price-history.component';
import { CalendarValidator } from '../../../../../validators/calendar.validator';
import { fromEvent, Observable } from 'rxjs';
@Component({
	selector: 'kt-order',
	templateUrl: './order.component.html',
	styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

	@ViewChild(DataTableDirective, { static: false })
	@ViewChild(DaterangePickerComponent, { static: false })
	@Input() orderIdsList;
	@Input() clientNumber;
	@Input() isAddMode;
	@Input() clientId;

	orderId: any;

	date_of_expiryPicker: DaterangePickerComponent;
	valid_from: DaterangePickerComponent;
	dayPicker: DaterangePickerComponent;

	tour: any = {};
	modalReference: any;
	editindex: any = null;
	tourList: any = [];
	tourFrm: FormGroup;
	orderTypeList: any = [];
	datatableElement: DataTableDirective;
	priceType: string;
	priceList: any = [];
	addedNewpriceList: any = [];
	selectedOrderType: number;
	selectedPriceBasis: number;
	clientOrderIdsList: any = [];
	orderExistIds: any = [];
	deletedOrderIds: any = [];
	priceBasisList: any = [];
	daysOfWeek: any = [];
	personList: any = [];
	billed_CompanyList: any = [];
	dtOptions: DataTables.Settings = {};
	dtContractorOptions: DataTables.Settings = {};
	response: any;
	matcher = new CalendarValidator();
	filterVal: any;
	cli_pri: any;
	cli_pri_week: any;
	cli_pri_weekend: any;
	con_pri: any;
	con_pri_week: any;
	con_pri_weekend: any;
	selectedRow: number = 0;
	columns: DatatableColumnModel[] = [
		{
			name: 'company_name',
			search: {
				value: ''
			}
		},
		{
			name: 'order_number',
			search: {
				value: ''
			}
		},
		{
			name: 'description',
			search: {
				value: ''
			}
		},
		{
			name: 'client_number',
			search: {
				value: ''
			}
		},
		{
			name: 'client_name',
			search: {
				value: ''
			}
		},
		{
			name: 'client_city',
			search: {
				value: ''
			}
		},
		{
			name: 'contractor_number',
			search: {
				value: ''
			}
		},
		{
			name: 'contractor_name',
			search: {
				value: ''
			}
		},
		{
			name: 'contractor_price',
			search: {
				value: ''
			}
		},
		{
			name: 'client_price',
			search: {
				value: ''
			}
		},
	];

	constructor(private clientService: ClientsService,
		private route: ActivatedRoute,
		public router: Router, private fb: FormBuilder,
		private modalService: NgbModal,
		private translate: TranslateService, private transServ: TranslationService,
		private commonService: CommonService,
		private companiesService: CompaniesService,
		private cd: ChangeDetectorRef,
		private personsService: PersonsService,
		private dialog: MatDialog,
		private orderService: OrderService,
	) {
		let current_lng = this.transServ.getSelectedLanguage();
		this.translate.use(current_lng);

		const allParams = this.route.snapshot.params;

		if (allParams && allParams.clientId !== "") {
			this.clientId = allParams.clientId;
		}
	}

	ngOnInit() {
		this.tourFrm = new FormGroup({
			order_number: new FormControl(''),
			description: new FormControl(''),
			client_price: new FormControl(''),
			price_basis: new FormControl(''),
			day: new FormControl(''),
			once_per_billing: new FormControl(''),
			no_customer_invoice: new FormControl(''),
			order_type: new FormControl(''),
			client_valid_from: new FormControl(''),
			client_date_of_expiry: new FormControl(''),
			contractor: new FormControl(''),
			client_price_week: new FormControl(''),
			client_price_weekend: new FormControl(''),
			comment: new FormControl(''),
			status: new FormControl(1),
			billed_company: new FormControl('')
		});

		this.selectedOrderType = 0;
		this.selectedPriceBasis = 3;

		this.priceBasisList = this.commonService.priceBasis();
		this.orderTypeList = this.commonService.orderTypeList();
		this.valid_from = this.commonService.dateRancePickerOptions();
		this.dayPicker = this.commonService.dateRancePickerOptions();
		this.date_of_expiryPicker = this.commonService.dateRancePickerOptions();
		this.daysOfWeek = this.commonService.weekDays();
		this.dataTableCall();
		this.contractorsDatatable();
		this.getCompanyList();
	}

	ngOnChanges(changes: SimpleChanges) {
		if (this.orderIdsList && this.orderIdsList !== undefined) {
			if (this.orderIdsList && this.orderIdsList.length > 0) {
				for (const pdid of this.orderIdsList) {
					this.orderExistIds.push(pdid.orderId);
				}
			}
		}
		this.clientNumber = changes.clientNumber.currentValue;
	}

	submit(form: NgForm) {
		let frmdata = this.tourFrm.value;
		frmdata.client_valid_from = this.commonService.convertDateforISO(frmdata.client_valid_from);
		frmdata.client_date_of_expiry = this.commonService.convertDateforISO(frmdata.client_date_of_expiry);
		if (this.tourFrm.valid) {
			this.commonService.addeditOrder(frmdata).subscribe(resp => {
				if (resp) {
					this.clientOrderIdsList.push(resp.newOrderId);
					this.addedNewOrder();
				}
			});
			this.modalClose();
		}
		else
			$("#tourFrm").addClass("validateFrm");

	}

	receiveOrderIdsList($event) {
		if ($event && $event > 0) {
			this.clientOrderIdsList.push($event);
			this.addedNewOrder();
		}
	}


	addedNewOrder() {
		if (this.clientOrderIdsList.length > 0) {
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
		this.tourFrm.controls['client_price'].setValue('');
		this.tourFrm.controls['price_basis'].setValue('');
		this.tourFrm.controls['day'].setValue('');
		this.tourFrm.controls['once_per_billing'].setValue('');
		this.tourFrm.controls['no_customer_invoice'].setValue('');
		this.tourFrm.controls['order_type'].setValue('');
		this.tourFrm.controls['contractor'].setValue('');
		this.tourFrm.controls['client_price_week'].setValue('');
		this.tourFrm.controls['client_price_weekend'].setValue('');
		this.tourFrm.controls['client_valid_from'].setValue('');
		this.tourFrm.controls['client_date_of_expiry'].setValue('');
		this.cli_pri_week = null;
		this.cli_pri_weekend = null;
		this.cli_pri = null;
		this.selectedOrderType = null;
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
					entityId: this.clientId,
					priceType: this.priceType,
					insert: result,
					update: [],
					deletedIds: []
				};

				this.commonService.addNewPriceHistory(priceHistoryData)
					.subscribe((res: any) => {
				});
			}
		});
	}

	addOrder(content) {
		this.newNumber();
		this.modalReference = this.modalService.open(content, { centered: true, size: 'lg', backdrop: 'static', windowClass: 'dark-theme' });
	}

	editClientOrder(orderId: any, content){
		this.orderId = orderId;
		this.clientOrderDetails();
		this.modalReference = this.modalService.open(content, { centered: true, size: 'lg', backdrop: 'static', windowClass: 'dark-theme' });
	}

	clientOrderDetails() {
		this.orderService.getOrderDetails({ orderId: this.orderId }).subscribe(result => {
			this.response = result.data;
			if (this.response) {
				this.tourFrm.controls['order_number'].setValue(this.response.order_number);
				this.tourFrm.controls['description'].setValue(this.response.description);
				this.tourFrm.controls['client_price'].setValue(this.response.client_price);
				this.tourFrm.controls['price_basis'].setValue(this.response.price_basis);
				this.tourFrm.controls['day'].setValue(this.response.day.split(","));
				this.tourFrm.controls['once_per_billing'].setValue(this.response.once_per_billing);
				this.tourFrm.controls['no_customer_invoice'].setValue(this.response.no_customer_invoice);
				this.tourFrm.controls['order_type'].setValue(this.response.order_type);
				this.tourFrm.controls['contractor'].setValue(this.response.contractor_name);
				this.tourFrm.controls['client_price_week'].setValue(this.response.client_price_week);
				this.tourFrm.controls['client_price_weekend'].setValue(this.response.client_price_weekend);

				if (this.response.client_valid_from == '0000-00-00') {
					this.tourFrm.controls['client_valid_from'].setValue('');
				} else {
					this.tourFrm.controls['client_valid_from'].setValue(this.commonService.convertDateforCustomFormat(this.response.client_valid_from));
				}
				if (this.response.client_date_of_expiry == '0000-00-00') {
					this.tourFrm.controls['client_date_of_expiry'].setValue('');
				} else {
					this.tourFrm.controls['client_date_of_expiry'].setValue(this.commonService.convertDateforCustomFormat(this.response.client_date_of_expiry));
				}
			}
		});
	}

	newNumber() {
		this.commonService.getNewOrderNo().subscribe(result => {
			this.orderId = result.neworderId;
			this.tourFrm.controls[`order_number`].setValue( (this.clientNumber || '') + result.neworderId);
		});
	}

	deleteTour(i) {
		let index = parseInt(i);
		if (index > -1) {
			this.tourList.splice(index, 1);
		}
	}

	date_of_expirySelect(value: any, datepicker?: any) {

		let start = value.start;
		let date_of_expiry = this.commonService.transformDate(start, 'dd.MM.yyyy');
		if (this.tourFrm.value.client_date_of_expiry == date_of_expiry) {
			this.tourFrm.controls[`client_date_of_expiry`].setValue(date_of_expiry);
		}
	}

	valid_fromSelect(value: any, datepicker?: any) {

		let start = value.start;
		let valid_from = this.commonService.transformDate(start, 'dd.MM.yyyy');
		if (this.tourFrm.value.client_valid_from == valid_from) {
			this.tourFrm.controls[`client_valid_from`].setValue(valid_from);
		}
	}

	dateApplied(e: any) {
		this.tourFrm.controls[e.event.currentTarget.name].setValue(this.commonService.transformDate(e.picker.startDate, 'dd.MM.yyyy'));
	}

	deleteClientOrder(ccpid, pid) {

		let clientCOId = parseInt(ccpid);
		let clientOId = parseInt(pid);

		if (clientCOId > 0) {
			this.deletedOrderIds.push(clientOId);
			this.refeshTable();
		}
		else if (clientOId > 0) {
			var index = this.clientOrderIdsList.indexOf(clientOId);
			if (index > -1) {
				this.clientOrderIdsList.splice(index, 1);
				this.refeshTable();
			}
		}
	}

	getClientOrderData() {
		return { 'newOrderIds': this.clientOrderIdsList, 'deleteClientOrders': this.deletedOrderIds, 'priceHistoryList': this.addedNewpriceList }
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

	refeshTable() {
		this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
			dtInstance.draw();
		});
	}

	selectPerson(item) {
		this.tourFrm.controls['contractor'].setValue(item.first_name);
	}

	onClickTable(evt) {
		const parentId = evt.target.parentNode.id;
		if (parentId !== 'contractor_person_Item') evt.stopPropagation();
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
				dataTablesParameters.search.clientId = this.clientId;
				dataTablesParameters.search.newOrderIds = this.clientOrderIdsList;
				dataTablesParameters.search.deletedOrderIds = this.deletedOrderIds;

				dataTablesParameters.columns = this.columns;

				this.clientService.getOrderList(dataTablesParameters).subscribe(resp => {
					this.response = resp;
					if (this.response && this.response.data) {
						this.tourList = this.response.data;
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
				dataTablesParameters.search.clientId = this.clientId;
				dataTablesParameters.search.newOrderIds = this.clientOrderIdsList;
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

	public getCompanyList() {
		this.companiesService.getCompaniessList({}).subscribe(response => {
			this.billed_CompanyList = response.data;
		});
	}

}
