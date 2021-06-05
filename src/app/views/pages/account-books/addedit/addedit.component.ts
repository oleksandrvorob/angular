import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { first } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../../components/dialog/dialog.component';

import { ActivatedRoute, Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../../services/lang.service';
import { TranslationService } from '../../../../core/_base/layout';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AccountBooksService } from './../account-books.service';

import { CommonService } from './../../../../services/common.service';
import { DaterangePickerComponent } from 'ng2-daterangepicker';

import { ClientsService } from './../../clients/clients.service';
import { NavbarActionsService } from './../../../../services/navbar-actions.service';

import * as $ from 'jquery';
import { Location } from '@angular/common';
import { PersonsService } from '../../persons/persons.service';
import { CalendarValidator } from '../../../../validators/calendar.validator';
import { ContractorsService } from '../../contractors/contractors.service';


@Component({
  selector: 'kt-addedit',
  templateUrl: './addedit.component.html',
  styleUrls: ['./addedit.component.scss']
})
export class AddeditComponent implements OnInit {

  	public tourFrm: FormGroup;

	@ViewChild(DaterangePickerComponent, { static: true })
	public date_of_expiryPicker: DaterangePickerComponent;
	public valid_from: DaterangePickerComponent;
	public dayPicker: DaterangePickerComponent;
	public contractor_valid_from: DaterangePickerComponent;
	public contractor_date_of_expiry: DaterangePickerComponent;
	public client_valid_from: DaterangePickerComponent;
	public client_date_of_expiry: DaterangePickerComponent;

	orderId: any;
	newOrderNumber: number;
	cli_pri: any;
	cli_pri_week: any;
	cli_pri_weekend: any;
	con_pri: any;
	con_pri_week: any;
	con_pri_weekend: any;
	orderTypeList: any = [];
	selectedOrderType: number;
	selectedPriceBasis: number;
	priceBasisList: any = [];
	isDisabled: boolean = true;
	daysOfWeek: any = [];
	personList: any = [];
	clientList: any = [];
	contractorList: any = [];
	clientId: any;
	dtClientOptions: DataTables.Settings = {};
	dtContractorOptions: DataTables.Settings = {};
	dtPersonOptions: DataTables.Settings = {};
	vehicleSizeList: any = [];
	selectedVehicleSize: number;
	isUpdating: boolean = false;
	navBarSubscription: any;
	matcher = new CalendarValidator();
	response: any;
	isAddMode: boolean = true;

	constructor(private route: ActivatedRoute,
		public router: Router, private fb: FormBuilder,
		private translate: TranslateService,
		private languageService: LanguageService,
		private transServ: TranslationService,
		private orderService: AccountBooksService,
		private commonService: CommonService,
		private clientService: ClientsService,
		private contractorService: ContractorsService,
		private _location: Location,
		private personsService: PersonsService,
		private cd: ChangeDetectorRef,
		public dialog: MatDialog,
		private navBarActionService: NavbarActionsService

	) {

		let current_lng = this.transServ.getSelectedLanguage();
		this.translate.use(current_lng);
		//check add or edit mode
		const allParams = this.route.snapshot.params;
		if ( allParams && allParams.accountBooksId !== undefined && allParams.accountBooksId != null )
		{
			this.orderId = allParams.accountBooksId;
			this.isAddMode = false;
		}

		if ( !this.isAddMode )
			this.tourDetails();
		else
			this.newNumber();
	}

	ngOnInit() {
		this.initialize();
		this.navBarActionService.changeActionName('');
		this.navBarSubscription = this.navBarActionService.action.subscribe(actionName => {
			if (actionName === 'save') this.submitFrm();
			if (actionName === 'cancel') this.cancel();
		});

		this.navBarActionService.changeDisabledSaveStatus(this.isDisabled);

	}

	initialize() {
		this.tourFrm = new FormGroup({
			orderId: new FormControl(''),
			order_number: new FormControl(''),
			description: new FormControl(''),
			customer: new FormControl(''),
			client_price: new FormControl(''),
			price_basis: new FormControl(''),
			day: new FormControl(''),
			once_per_billing: new FormControl(''),
			no_customer_invoice: new FormControl(''),
			order_type: new FormControl(''),
			valid_from: new FormControl(''),
			date_of_expiry: new FormControl(''),
			fuel_fee: new FormControl(''),
			vehicle_size: new FormControl(''),
			number_of_departures: new FormControl(''),
			departure_times: new FormControl(''),
			personId: new FormControl(''),
			person_first_name: new FormControl(''),
			contractor: new FormControl(''),
			contractorId: new FormControl(''),
			contractor_valid_from: new FormControl(''),
			contractor_date_of_expiry: new FormControl(''),
			contractor_price_week: new FormControl(''),
			contractor_price_weekend: new FormControl(''),
			client_valid_from: new FormControl(''),
			client_date_of_expiry: new FormControl(''),
			client_price_week: new FormControl(''),
			client_price_weekend: new FormControl(''),
			driver_name: new FormControl(''),
			phone: new FormControl(''),
			tourcode: new FormControl(''),
			password: new FormControl(''),
			comment: new FormControl(''),
		});

		this.tourFrm.valueChanges.subscribe(val => {
			if (val.description !== "" ||
				val.customer !== "" ||
				val.client_price !== undefined ||
				val.price_basis !== "" ||
				val.day !== "" ||
				val.once_per_billing !== "" ||
				val.no_customer_invoice !== "" ||
				val.valid_from !== "" ||
				val.date_of_expiry !== "" ||
				val.fuel_fee !== "" ||
				val.no_customer_invoice !== "" ||
				val.once_per_billing !== "" ||
				val.vehicle_size !== '' ||
				val.number_of_departures !== '' ||
				val.departure_times !== '' ||
				val.order_type !== "" ||
				val.personId !== "" ||
				val.person_first_name !== "" ||
				val.contractor !== "" ||
				val.contractorId !== "" ||
				val.contractor_valid_from !== "" ||
				val.contractor_date_of_expiry !== "" ||
				val.contractor_price_week !== undefined ||
				val.contractor_price_weekend !== undefined ||
				val.driver_name !== "" ||
				val.phone !== "" ||
				val.tourcode !== "" ||
				val.password !== "" ||
				val.comment !== "") {
				this.isDisabled = false;
				this.navBarActionService.changeDisabledSaveStatus(this.isDisabled);
			} else {
				this.isDisabled = true;
				this.navBarActionService.changeDisabledSaveStatus(this.isDisabled);
			}
		});

		this.personDataTable();
		this.clientDataTable();
		this.contractorDataTable();

		this.priceBasisList = this.commonService.priceBasis();
		this.orderTypeList = this.commonService.orderTypeList();
		this.valid_from = this.commonService.dateRancePickerOptions();
		this.dayPicker = this.commonService.dateRancePickerOptions();
		this.date_of_expiryPicker = this.commonService.dateRancePickerOptions();

		this.contractor_valid_from = this.commonService.dateRancePickerOptions();
		this.contractor_date_of_expiry = this.commonService.dateRancePickerOptions();
		this.client_valid_from = this.commonService.dateRancePickerOptions();
		this.client_date_of_expiry = this.commonService.dateRancePickerOptions();
		this.daysOfWeek = this.commonService.weekDays();

		this.selectedOrderType = 0;

		this.vehicleSizeList = this.commonService.vehicleSizeList();
		this.selectedVehicleSize = 0;
		this.selectedPriceBasis = 3;
	}

	tourDetails() {
		this.orderService.getOrderDetails({ orderId: this.orderId }).subscribe(result => {
			this.response = result.data;
			if (this.response) {
				this.tourFrm.controls['orderId'].setValue(this.response.orderId);
				this.tourFrm.controls['order_number'].setValue(this.response.order_number);
				// this.tourFrm.controls['surname'].setValue(this.response.surname);
				this.tourFrm.controls['description'].setValue(this.response.description);
				this.tourFrm.controls['customer'].setValue(this.response.customer);
				this.tourFrm.controls['client_price'].setValue(this.response.client_price);
				this.tourFrm.controls['price_basis'].setValue(this.response.price_basis);
				this.tourFrm.controls['day'].setValue(this.response.day.split(","));
				this.tourFrm.controls['valid_from'].setValue(this.commonService.convertDateforCustomFormat(this.response.valid_from));
				this.tourFrm.controls['date_of_expiry'].setValue(this.commonService.convertDateforCustomFormat(this.response.date_of_expiry));
				this.tourFrm.controls['fuel_fee'].setValue(this.response.fuel_fee);
				this.tourFrm.controls['once_per_billing'].setValue(this.response.once_per_billing);
				this.tourFrm.controls['no_customer_invoice'].setValue(this.response.no_customer_invoice);
				this.tourFrm.controls['vehicle_size'].setValue(this.response.vehicle_size);
				this.tourFrm.controls['number_of_departures'].setValue(this.response.number_of_departures);
				this.tourFrm.controls['departure_times'].setValue(this.response.departure_times);
				this.tourFrm.controls['order_type'].setValue(this.response.order_type);
				this.tourFrm.controls['contractor'].setValue(this.response.contractor);
				this.tourFrm.controls['contractorId'].setValue(this.response.contractorId);
				this.tourFrm.controls['contractor_valid_from'].setValue(this.commonService.convertDateforCustomFormat(this.response.contractor_valid_from));
				this.tourFrm.controls['contractor_date_of_expiry'].setValue(this.commonService.convertDateforCustomFormat(this.response.contractor_date_of_expiry));
				this.tourFrm.controls['contractor_price_week'].setValue(this.response.contractor_price_week);
				this.tourFrm.controls['contractor_price_weekend'].setValue(this.response.contractor_price_weekend);
				this.tourFrm.controls['client_valid_from'].setValue(this.commonService.convertDateforCustomFormat(this.response.client_valid_from));
				this.tourFrm.controls['client_date_of_expiry'].setValue(this.commonService.convertDateforCustomFormat(this.response.client_date_of_expiry));
				this.tourFrm.controls['client_price_week'].setValue(this.response.client_price_week);
				this.tourFrm.controls['client_price_weekend'].setValue(this.response.client_price_weekend);
				this.tourFrm.controls['driver_name'].setValue(this.response.driver_name);
				this.tourFrm.controls['phone'].setValue(this.response.phone);
				this.tourFrm.controls['tourcode'].setValue(this.response.tourcode);
				this.tourFrm.controls['password'].setValue(this.response.password);
				this.tourFrm.controls['personId'].setValue(this.response.personId);
				this.tourFrm.controls['person_first_name'].setValue(this.response.person_first_name);
			}
		});
	}

	submitFrm() {
		$("#toursFrm").addClass("validateFrm");

		if (this.tourFrm.valid) {
			this.isUpdating = true;
			let formData = this.tourFrm.value;
			formData.clientId = this.clientId;
			formData.client_valid_from = this.commonService.convertDateforISO(formData.client_valid_from);
			formData.client_date_of_expiry = this.commonService.convertDateforISO(formData.client_date_of_expiry);
			formData.contractor_date_of_expiry = this.commonService.convertDateforISO(formData.contractor_date_of_expiry	);
			formData.contractor_valid_from = this.commonService.convertDateforISO(formData.contractor_valid_from);
			formData.valid_from = this.commonService.convertDateforISO(formData.valid_from);
			formData.date_of_expiry = this.commonService.convertDateforISO(formData.date_of_expiry);
			this.orderService.addeditOrder(formData).subscribe(data => {
				this.router.navigate(['account-books']);
			});

		}

	}

	cancel() {
		this._location.back();
	}

	newNumber() {
		this.orderService.getNewOrderNo().subscribe(result => {
			this.newOrderNumber = result.neworderId;
			this.tourFrm.controls['order_number'].setValue(this.newOrderNumber);
		});
	}

	date_of_expiryPickerSelect(value: any, datepicker?: any) {

		let start = value.start;
		let date_of_expiry = this.commonService.transformDate(start, 'dd.MM.yyyy');
		if (this.tourFrm.value.date_of_expiry == date_of_expiry) {
			this.tourFrm.controls['date_of_expiry'].setValue(date_of_expiry);
		}
	}

	valid_fromSelect(value: any, datepicker?: any) {

		let start = value.start;
		let valid_from = this.commonService.transformDate(start, 'dd.MM.yyyy');
		if (this.tourFrm.value.valid_from == valid_from) {
			this.tourFrm.controls['valid_from'].setValue(valid_from);
		}
	}

	contractor_valid_fromPickerSelect(value: any, datepicker?: any) {
		let start = value.start;
		let contractor_valid_from = this.commonService.transformDate(start, 'dd.MM.yyyy');
		if (this.tourFrm.value.contractor_valid_from == contractor_valid_from) {
			this.tourFrm.controls['contractor_valid_from'].setValue(contractor_valid_from);
		}
	}

	contractor_date_of_expiryPickerSelect(value: any, datepicker?: any) {
		let start = value.start;
		let contractor_date_of_expiry = this.commonService.transformDate(start, 'dd.MM.yyyy');
		if (this.tourFrm.value.contractor_date_of_expiry == contractor_date_of_expiry) {
			this.tourFrm.controls['contractor_date_of_expiry'].setValue(contractor_date_of_expiry);
		}
	}

	client_valid_fromPickerSelect(value: any, datepicker?: any) {
		let start = value.start;
		let client_valid_from = this.commonService.transformDate(start, 'dd.MM.yyyy');
		if (this.tourFrm.value.client_valid_from == client_valid_from) {
			this.tourFrm.controls['client_valid_from'].setValue(client_valid_from);
		}
	}

	client_date_of_expiryPickerSelect(value: any, datepicker?: any) {
		let start = value.start;
		let client_date_of_expiry = this.commonService.transformDate(start, 'dd.MM.yyyy');
		if (this.tourFrm.value.client_date_of_expiry == client_date_of_expiry) {
			this.tourFrm.controls['client_date_of_expiry'].setValue(client_date_of_expiry);
		}
	}

	dateApplied(e: any) {
		console.log('e', e);
		this.tourFrm.controls[e.event.currentTarget.name].setValue(this.commonService.transformDate(e.picker.startDate, 'dd.MM.yyyy'));
	}

	selectCustomer(item) {
		this.clientId = item.clientId;
		this.tourFrm.controls['customer'].setValue(item.name1);
		if(this.isAddMode)
			this.tourFrm.controls['order_number'].setValue(item.client_number + this.newOrderNumber);
	}

	onClickCustomerTable(evt) {
		const parentId = evt.target.parentNode.id;
		if (parentId !== 'Customer_Item') evt.stopPropagation();
	}

	selectPerson(item) {

		this.tourFrm.controls['person_first_name'].setValue(item.first_name);
		this.tourFrm.controls['personId'].setValue(item.personId);
	}

	onClickPersonTable(evt) {
		const parentId = evt.target.parentNode.id;
		if (parentId !== 'Person_Item') evt.stopPropagation();
	}

	selectContractor(item) {
		console.log('item', item);
		this.tourFrm.controls['contractor'].setValue(item.name1);
		this.tourFrm.controls['contractorId'].setValue(item.contractorId);
	}

	onClickContractorTable(evt) {
		const parentId = evt.target.parentNode.id;
		if (parentId !== 'Contractor_Item') evt.stopPropagation();
	}






	/**
	 * On destroy
	 */
	ngOnDestroy(): void {
		this.navBarActionService.changeActionName('');
		this.navBarSubscription.unsubscribe();
	}

	public personDataTable() {

		let response: any;

		this.dtPersonOptions = {
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

				this.personsService.getPersonList(dataTablesParameters).subscribe(resp => {
					response = resp;
					if (response && response.data) {
						this.personList = response.data;
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


	public clientDataTable() {

		let response: any;

		this.dtClientOptions = {
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

	public contractorDataTable() {

		let response: any;

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
				this.contractorService.getContractorsList(dataTablesParameters).subscribe(resp => {
					response = resp;
					if (response && response.data) {
						this.contractorList = response.data;
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

	canDeactivate(): Observable<boolean> | boolean {
		if (!this.isUpdating && this.tourFrm.dirty) {
			this.isUpdating = false;

			const dialogRef = this.dialog.open(DialogComponent, {
				panelClass: ['dark-theme', 'custom-modalbox']
			});

			return dialogRef.afterClosed().pipe(map(result => {
				if (result === 'save') {
					this.submitFrm();
					return true;
				} else if (result === 'discard') {
					return true;
				} else if (result === 'cancel') {
					return false;
				}
			}), first());
		}
		return true;
	}

}

