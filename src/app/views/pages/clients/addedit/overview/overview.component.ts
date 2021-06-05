import { Component, OnInit, Input, ViewChild, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { ClientsService } from '../../../clients/clients.service';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormGroupDirective } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../../../services/lang.service';

import { TranslationService } from '../../../../../core/_base/layout';
import { DateServicesService } from './../../../../../services/date-services.service'

import { CommonService } from './../../../../../services/common.service';
import { FileService } from './../../../../../services/file.service';

import * as $ from 'jquery';

import { DaterangePickerComponent } from 'ng2-daterangepicker';
import { BankingService } from '../../../system/banking/banking.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { CalendarValidator } from '../../../../../validators/calendar.validator';
import { CompaniesService } from '../../../companies/companies.service';
import { MapsService } from '../../../maps/maps.service';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';

@Component({
	selector: 'kt-overview',
	templateUrl: './overview.component.html',
	styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

	@Input() basicData;
	@Input() progress;
	@Input() uploadedFile;
	@Input() fileName;
	@Input() fileKeyName;
	@Input() isAddMode;
	@Output() changeFormData = new EventEmitter<boolean>();
	@Output() changeClientNumberEvent = new EventEmitter<string>();
	@Output() getNewClientIdEvent = new EventEmitter<any>();

	@ViewChild(DaterangePickerComponent, { static: true })

	public contract_start_date: DaterangePickerComponent;
	public contract_end_date: DaterangePickerComponent;
	public billed: DaterangePickerComponent;
	public overviewData: FormGroup;

	newClientNumber: number = null;
	companyList = [];
	currencyList: any = [];
	rechRhythmLust: any = [];
	zahlRhythmList: any = [];
	terminationTimeList: any = [];
	stateList: any = [];
	bankList: any = [];
	alternativeInvoiceRecipientList: any = [];
	termination_time_value_show: any = false;
	ustr_mandatory_disabled = true;
	currentDate: any;
	companyCode: string;
	bankName: string;
	cityName: string;
	countryName: string;
	stateName: string;
	zipCodeError: boolean = false;
	isValidStartDate: any;
	src: string;
	dtOptionsForAlternativeInvoiceRecipient: DataTables.Settings = {};
	dtBankOptions: DataTables.Settings = {};
	matcher = new CalendarValidator();
	account_managers: FormArray;
	alter_invoice_recId: number = null;

	constructor(private route: ActivatedRoute,
		public router: Router,
		private fb: FormBuilder,
		private translate: TranslateService,
		private transServ: TranslationService,
		private languageService: LanguageService,
		private cd: ChangeDetectorRef,
		private clientsServices: ClientsService,
		private dateServicesService: DateServicesService,
		private commonService: CommonService,
		private fileService: FileService,
		private bankingService: BankingService,
		private companyservice: CompaniesService,
		private mapsService: MapsService
	) {

		let current_lng = this.transServ.getSelectedLanguage();
		this.translate.use(current_lng);
	}

	ngOnInit() {
		this.zipCodeError = false;
		this.currentDate = new Date();
		this.changeFormData.emit(true);
		this.overviewData = new FormGroup({
			clientId: new FormControl(''),
			companyId: new FormControl(''),
			client_number: new FormControl(''),
			name1: new FormControl(''),
			name2: new FormControl(''),
			street: new FormControl(''),
			zipcode: new FormControl(''),
			city: new FormControl(''),
			state: new FormControl(''),
			country: new FormControl(''),
			phone1: new FormControl(''),
			phone2: new FormControl(''),
			mobile: new FormControl(''),
			alternative_invoice_recipient: new FormControl(''),
			alternative_invoice_recipient_name: new FormControl(''),
			fax: new FormControl(''),
			email: new FormControl(''),
			rech_rhythm: new FormControl(''),
			zahl_rhythm: new FormControl(''),
			contract_file: new FormControl(''),
			contract_start_date: new FormControl(''),
			contract_end_date: new FormControl(''),
			termination_time: new FormControl(''),
			termination_time_value: new FormControl(''),
			print_branch_invoice: new FormControl(''),
			billed: new FormControl(''),
			tax_identification_number: new FormControl(''),
			bank: new FormControl(''),
			iban: new FormControl(''),
			bic: new FormControl(''),
			national_tax_number: new FormControl(''),
			ustr_mandatory: new FormControl(''),
			ustr_mandatory_value: new FormControl(''),
			currency: new FormControl(''),
			vendor_number: new FormControl(''),
			debitor_no: new FormControl(''),
			cost_center: new FormControl(''),
			account_managers: this.fb.array([this.createManager()]),
			location: this.createLocation()
		});

		this.overviewData.valueChanges.subscribe(val => {
			if (val.companyId !== undefined ||
				val.name1 !== "" ||
				val.name2 !== "" ||
				val.street !== "" ||
				val.zipcode !== "" ||
				val.city !== undefined ||
				val.phone1 !== "" ||
				val.phone2 !== "" ||
				val.mobile !== "" ||
				val.alternative_invoice_recipient !== "" ||
				val.alternative_invoice_recipient_name !== "" ||
				val.fax !== "" ||
				val.email !== "" ||
				val.rech_rhythm !== "" ||
				val.zahl_rhythm !== "" ||
				val.contract_file !== "" ||
				val.contract_start_date !== "" ||
				val.termination_time !== "" ||
				val.termination_time_value !== "" ||
				val.print_branch_invoice !== "" ||
				val.state !== undefined ||
				val.country !== "" ||
				val.billed !== "" ||
				val.bank !== undefined ||
				val.iban !== "" ||
				val.bic !== "" ||
				val.ustr_mandatory !== "" ||
				val.ustr_mandatory_value !== "" ||
				val.currency !== "" ||
				val.tax_identification_number !== "" ||
				val.national_tax_number !== "" ||
				val.vendor_number !== "" ||
				val.debitor_no !== "" ||
				val.cost_center !== "") {
				this.changeFormData.emit(false);
			} else {
				this.changeFormData.emit(true);
			}
		});

		this.contract_start_date = this.commonService.dateRancePickerOptions();
		this.contract_end_date = this.commonService.dateRancePickerOptions();
		this.billed = this.commonService.dateRancePickerOptions();
		this.currencyList = this.commonService.getCurrency();
		this.rechRhythmLust = this.commonService.getRechRhythm();
		this.zahlRhythmList = this.commonService.getZahlRhythm();
		this.terminationTimeList = this.commonService.terminationTime();
		this.commonService.getStateList().subscribe(result => {
			if (result) {
				this.stateList = result.data;
				const curLang = this.transServ.getSelectedLanguage();
				if (curLang === 'ge') {
					this.stateList = this.stateList.map((item, index) => {
						item.name = item.ge;
						return item;
					});
				}
			}
		});

		this.companyservice.getAllCodes().subscribe(resp => {
			if (resp) {
				this.companyList = resp.data;
			}
		});
		//check add or edit mode
		if (this.isAddMode)
			this.newNumber();
		this.dataTableCall();
		this.getAllBanks();

	}

	ngOnChanges() {
		if (this.basicData && this.basicData !== undefined) {
			for (var key in this.basicData) {
				if (this.basicData.hasOwnProperty(key) && key !== 'status' && key !== 'comment' && key !== 'created_time' && key !== 'updated_time' && key !== 'contract_file') {
					let value = (this.basicData[key] && this.basicData[key] != undefined && this.basicData[key] !== null) ? this.basicData[key] : '';
					if (key === 'ustr_mandatory') {
						if (value == 1) this.ustr_mandatory_disabled = false;
						this.overviewData.controls[`${key}`].setValue(value);
					}
					else if (key === 'termination_time') {
						if (value == 'Sonstige') this.termination_time_value_show = true;
						this.overviewData.controls[`${key}`].setValue(value);
					}

					else {
						if (this.overviewData.controls[`${key}`] != undefined) {
							//convert date for custom format
							if (key == 'contract_start_date' || key == 'contract_end_date' || key == 'billed') {
								if(value == '0000-00-00'){
									this.overviewData.controls[`${key}`].setValue("");
								} else {
									this.overviewData.controls[`${key}`].setValue(this.commonService.convertDateforCustomFormat(value));
								}
							}
							else
								this.overviewData.controls[`${key}`].setValue(value);
						}

					}
				}
			}
		}
	}

	newNumber() {
		this.clientsServices.getNewClientNo().subscribe(result => {
			this.newClientNumber = result.newclientId;
			let client_number = this.commonService.paddingZero(this.newClientNumber.toString(), 5);
			this.overviewData.controls[`client_number`].setValue(client_number)
			this.cd.markForCheck();
			this.changeClientNumberEvent.emit(client_number);
			this.getNewClientIdEvent.emit(this.newClientNumber);
		});
	}

	formData() {
		$("#overviewFrm").addClass("validateFrm");

		if (this.overviewData.valid) {
			return this.overviewData.value;
		} else {
			return false;
		}
	}

	changeTerminationTime($event) {
		this.termination_time_value_show = false;
		if ($event && $event.value !== undefined && $event.value !== "") {
			if ($event.value === "Sonstige") {
				this.termination_time_value_show = true;
			} else {
				this.overviewData.controls['termination_time_value'].setValue('');
			}
		}
	}

	changeuStrMandatory() {
		this.ustr_mandatory_disabled = !this.ustr_mandatory_disabled;
		this.overviewData.controls['ustr_mandatory_value'].setValue('19');
	}

	changePhoneNumber($event) {
		if ($event.target.name === 'phone1' && $event.target.value === '') {
			this.overviewData.controls['phone1'].setValue('+49');
		}
		if ($event.target.name === 'phone2' && $event.target.value === '') {
			this.overviewData.controls['phone2'].setValue('+49');
		}
		if ($event.target.name === 'mobile' && $event.target.value === '') {
			this.overviewData.controls['mobile'].setValue('+49');
		}
	}

	emptyValue($event) {
		if ($event.target.name === 'phone1' && $event.target.value === '+49') {
			this.overviewData.controls['phone1'].setValue('');
			$event.target.value = '';
		}
		if ($event.target.name === 'phone2' && $event.target.value === '+49') {
			this.overviewData.controls['phone2'].setValue('');
			$event.target.value = '';
		}
		if ($event.target.name === 'mobile' && $event.target.value === '+49') {
			this.overviewData.controls['mobile'].setValue('');
			$event.target.value = '';
		}
	}

	billedDateSelect(value: any, datepicker?: any){
		let start = value.start;
		let billed_date = this.commonService.transformDate(start, 'dd.MM.yyyy');
		if (this.overviewData.value.billed == billed_date) {
			this.overviewData.controls[`billed`].setValue(billed_date);
		}
	}

	contract_start_dateSelect(value: any, datepicker?: any) {
		let start = value.start;
		let contract_start_date = this.commonService.transformDate(start, 'dd.MM.yyyy');
		if (this.overviewData.value.contract_start_date == contract_start_date) {
			this.overviewData.controls[`contract_start_date`].setValue(contract_start_date);
		}
	}

	dateApplied(e: any) {
		this.overviewData.controls[e.event.currentTarget.name].setValue(this.commonService.transformDate(e.picker.startDate, 'dd.MM.yyyy'));
	}

	contract_end_dateSelect(value: any, datepicker?: any) {
		let start = value.start;
		let contract_end_date = this.commonService.transformDate(start, 'dd.MM.yyyy');
		if (this.overviewData.value.contract_end_date == contract_end_date) {
			this.overviewData.controls[`contract_end_date`].setValue(contract_end_date);
		}
	}

	is_int(value) {
		if ((parseFloat(value) == parseInt(value)) && !isNaN(value)) {
			return true;
		} else {
			return false;
		}
	}

	getCityName(event) {
		let zipCode = event.target.value;
		if ((zipCode.length == 5) && (this.is_int(zipCode))) {
			this.commonService.getCityName(zipCode)
				.subscribe(result => {
					if (result) {
						this.cityName = result.city;
						this.countryName = result.country;
						this.stateName = result.state_short;
					}
				},
					error => {
						this.zipCodeError = true;
						this.cityName = "";
						this.countryName = "";
						this.stateName = "";
					}
				);
		} else {
			this.zipCodeError = false;
			this.cityName = "";
			this.countryName = "";
			this.stateName = "";
		}

		this.getLocationInfo();
	}

	createLocation(): FormGroup {
		return this.fb.group({
			lat: '',
			lng: '',
			marker: {
				lat: '',
				lng: '',
				draggable: true
			},
			address: '',
			zoom: 6
		});
	}

	getLocationInfo() {
		let street = this.overviewData.get('street').value;
		let zipcode = this.overviewData.get('zipcode').value;
		let city = this.overviewData.get('city').value;

		if (street !== undefined && street !== "" && zipcode !== undefined && zipcode !== "" && city !== undefined && city !== "") {
			this.mapsService.getLocationInfo(street, zipcode, city)
				.subscribe(result => {
					this.overviewData.patchValue({
						location: {
							lat: result.latt,
							lng: result.longt,
							marker: {
								lat: result.latt,
								lng: result.longt,
								draggable: true
							},
							address: street + ', ' + city + ', ' + zipcode,
							zoom: 6
						}
					});
				});
		}
	}

	validateIBAN(event) {
		let iban = event.target.value;
		if (iban.length > 15) {
			this.commonService.validateIBAN(iban)
				.subscribe(result => {
					this.bankName = result.bankData.name;
				},
					error => {
						console.log("iban is invalid");
						this.bankName = "";
					}
				);
		} else {
			console.log("The length of IBAN should be bigger than 15.");
			this.bankName = "";
		}
	}

	download() {
		this.fileService.downloadFile(this.fileKeyName, this.fileName);
	}

	selectAlternativeInvoiceRecipient({ name1, name2, clientId }) {
		const fullName = name1 && name1.trim() ? name1.trim() : '' + name2 && name2.trim() ? name2.trim() : '';
		this.overviewData.controls['alternative_invoice_recipient_name'].setValue(fullName);
		this.overviewData.controls['alternative_invoice_recipient'].setValue(clientId);
	}

	onClickTable(evt) {
		const parentId = evt.target.parentNode.id;
		if (parentId !== 'Alternative_Invoice_Recipient_Item') evt.stopPropagation();
	}

	selectBank(item) {
		this.overviewData.controls['bank'].setValue(item.name);
	}

	onClickBankTable(evt) {
		const parentId = evt.target.parentNode.id;
		if (parentId !== 'bank_Item') evt.stopPropagation();
	}

	createManager(): FormGroup {
		return this.fb.group({
			name: '',
			phone: ''
		});
	}

	addAccountManager() {
		this.account_managers = this.overviewData.get('account_managers') as FormArray;
		this.account_managers.push(this.createManager());
	}

	removeAccountManager(i: number) {
		this.account_managers = this.overviewData.get('account_managers') as FormArray;
		this.account_managers.removeAt(i);
	}

	selectCompany(e) {
		if (this.isAddMode) {
			let client_number = this.commonService.paddingZero(e.value, 2) + this.commonService.paddingZero(this.newClientNumber.toString(), 5);
			this.overviewData.controls[`client_number`].setValue(client_number);
			this.cd.markForCheck();
			this.changeClientNumberEvent.emit(client_number);
		}
	}

	dataTableCall() {
		this.dtOptionsForAlternativeInvoiceRecipient = {
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

				dataTablesParameters.search.value = this.overviewData.get('alternative_invoice_recipient_name').value;

				this.clientsServices.getClientsList(dataTablesParameters).subscribe(resp => {
					if (resp && resp.data) {
						this.alternativeInvoiceRecipientList = resp.data;
						this.cd.markForCheck();
						callback({
							recordsTotal: resp.recordsTotal,
							recordsFiltered: resp.recordsFiltered,
							data: []
						});
					}

				});
			}
		};
	}

	getAllBanks() {
		this.dtBankOptions = {
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

				dataTablesParameters.search.value = this.overviewData.get('bank').value;

				this.bankingService.getAllBanks(dataTablesParameters).subscribe(resp => {
					if (resp) {
						this.bankList = resp.data;
						this.cd.markForCheck();
						callback({
							recordsTotal: resp.recordsTotal,
							recordsFiltered: resp.recordsFiltered,
							data: []
						});
					}
				});
			}
		};
	}
}


