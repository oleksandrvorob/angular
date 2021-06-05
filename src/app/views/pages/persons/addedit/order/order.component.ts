import { Component, OnInit, Input, ViewChild, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientsService } from '../../../clients/clients.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { NgForm } from '@angular/forms';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { TranslationService, DatatableColumnModel } from '../../../../../core/_base/layout';
import { TranslateService } from '@ngx-translate/core';

import { CommonService } from './../../../../../services/common.service';
import { DaterangePickerComponent } from 'ng2-daterangepicker';
import { DataTableDirective } from 'angular-datatables';
import { PersonsService } from '../../../persons/persons.service';

import { PriceHistoryComponent } from '../../../../../components/price-history/price-history.component';
import { CalendarValidator } from '../../../../../validators/calendar.validator';
@Component({
	selector: 'kt-order',
	templateUrl: './order.component.html',
	styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

	@ViewChild(DataTableDirective, { static: false })
	@ViewChild(DaterangePickerComponent, { static: false })
	@Input() orderIdsList;

	public date_of_expiryPicker: DaterangePickerComponent;
	public valid_from: DaterangePickerComponent;
	public dayPicker: DaterangePickerComponent;
	public tour: any = {};
	modalReference: any;
	editindex: any = null;
	tourList: any = [];
	tourFrm: FormGroup;
	orderTypeList: any = [];
	datatableElement: DataTableDirective;
	priceList: any;
	clientId: any;
	clientOrderIdsList: any = [];
	orderExistIds: any = [];
	deletedOrderIds: any = [];
	priceBasisList: any = [];
	daysOfWeek: any = [];
	personList: any = [];
	dtOptions: DataTables.Settings = {};
	dtContractorOptions: DataTables.Settings = {};
	response: any;
	value: any;
	matcher = new CalendarValidator();
	filterVal: any;
	columns: DatatableColumnModel[];

	constructor(private clientService: ClientsService,
		private route: ActivatedRoute,
		public router: Router, private fb: FormBuilder,
		private modalService: NgbModal,
		private translate: TranslateService, private transServ: TranslationService,
		private commonService: CommonService,
		private cd: ChangeDetectorRef,
		private personsService: PersonsService,
		private dialog: MatDialog
	) {
		let current_lng = this.transServ.getSelectedLanguage();
		this.translate.use(current_lng);

		const allParams = this.route.snapshot.params;

		if (allParams && allParams.personId !== "") {
			this.clientId = allParams.personId;
		}
	}

	ngOnInit() {
		console.log('order is loaded');
		this.tourFrm = new FormGroup({
			order_number: new FormControl(''),
			description: new FormControl(''),
			client_price: new FormControl(''),
			price_basis: new FormControl(''),
			day: new FormControl(''),
			once_per_billing: new FormControl(''),
			no_customer_invoice: new FormControl(''),
			order_type: new FormControl(''),
			valid_from: new FormControl(''),
			date_of_expiry: new FormControl(''),
			contractor: new FormControl(''),
			contractor_price_week: new FormControl(''),
			contractor_price_weeken: new FormControl(''),
			comment: new FormControl(''),
			status: new FormControl(0),
		});
		this.priceBasisList = this.commonService.priceBasis();
		this.orderTypeList = this.commonService.orderTypeList();
		this.valid_from = this.commonService.dateRancePickerOptions();
		this.dayPicker = this.commonService.dateRancePickerOptions();
		this.date_of_expiryPicker = this.commonService.dateRancePickerOptions();
		this.daysOfWeek = this.commonService.weekDays();

		this.columns = [
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

		this.personOrderList();
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
		this.tour = {};
		// this.setFormData();
	}

	addOrder(content) {
		this.newNumber();
		this.modalReference = this.modalService.open(content, { centered: true, size: 'lg', backdrop: 'static', windowClass: 'dark-theme' });
	}

	newNumber() {
		this.commonService.getNewOrderNo().subscribe(result => {
			this.tourFrm.controls[`order_number`].setValue(result.newordersId);
		});
	}

	deleteTour(i) {
		let index = parseInt(i);
		if (index > -1) {
			this.tourList.splice(index, 1);
		}

	}

	gettourList() {
		return this.tourList;
	}

	date_of_expirySelect(value: any, datepicker?: any) {

		let start = value.start;
		let date_of_expiry = this.commonService.transformDate(start, 'dd.MM.yyyy');
		if (this.tourFrm.value.date_of_expiry == date_of_expiry) {
			this.tourFrm.controls[`date_of_expiry`].setValue(date_of_expiry);
		}
	}

	valid_fromSelect(value: any, datepicker?: any) {

		let start = value.start;
		let valid_from = this.commonService.transformDate(start, 'dd.MM.yyyy');
		if (this.tourFrm.value.valid_from == valid_from) {
			this.tourFrm.controls[`valid_from`].setValue(valid_from);
		}
	}

	dateApplied(e: any) {
		this.tourFrm.controls[e.event.currentTarget.name].setValue(this.commonService.transformDate(e.picker.startDate, 'dd.MM.yyyy'));
	}

	dayPickerSelect(value: any, datepicker?: any) {
		let start = value.start;
		let day = this.commonService.transformDate(start, 'dd.MM.yyyy');
		this.tourFrm.controls[`day`].setValue(day);
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
		return { 'newOrderIds': this.clientOrderIdsList, 'deleteClientOrders': this.deletedOrderIds }
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

	public personOrderList() {
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
				dataTablesParameters.search.personId = this.clientId;
				dataTablesParameters.search.newOrderIds = this.clientOrderIdsList;
				dataTablesParameters.search.deletedOrderIds = this.deletedOrderIds;

				dataTablesParameters.columns = this.columns;

				this.personsService.getPersonOrderList(dataTablesParameters).subscribe(resp => {
					this.response = resp;
					if (this.response && this.response.data) {
						this.tourList = this.response.data;
						this.cd.markForCheck();
						// this.cd.detectChanges();
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

}
