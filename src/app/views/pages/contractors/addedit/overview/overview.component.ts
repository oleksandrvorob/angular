import { Component, OnInit, Input, ViewChild, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../../../services/lang.service';
import { TranslationService } from '../../../../../core/_base/layout';

import { ContractorsService } from './../../contractors.service';
import { CommonService } from './../../../../../services/common.service';
import { FileService } from './../../../../../services/file.service';
import { BankingService } from '../../../system/banking/banking.service';
import { MapsService } from '../../../maps/maps.service';

import { DaterangePickerComponent } from 'ng2-daterangepicker';
import { CalendarValidator } from '../../../../../validators/calendar.validator';
import { PaymentStopValidator } from '../../../../../validators/paymentstop.validator';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
@Component({
	selector: 'kt-overview',
	templateUrl: './overview.component.html',
	styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

	public overviewData: FormGroup;

	@Input() basicData;
	@Input() uploadedFile;
	@Input() fileName;
	@Input() fileKeyName;

	newContractorId: number = null;

	@ViewChild(DaterangePickerComponent, { static: true })
	public contract_start_date: DaterangePickerComponent;
	public contract_end_date: DaterangePickerComponent;
	public commercial_date: DaterangePickerComponent;

	@Output() changeFormData = new EventEmitter<boolean>();
	@Output() getNewContractorIdEvent = new EventEmitter<any>();


	constructor(private route: ActivatedRoute,
		public router: Router,
		private fb: FormBuilder,
		private translate: TranslateService,
		private transServ: TranslationService,
		private contractorsService: ContractorsService,
		private commonService: CommonService,
		private bankingService: BankingService,
		private mapsService: MapsService,
		private cd: ChangeDetectorRef,
		private fileService: FileService) {
		let current_lng = this.transServ.getSelectedLanguage();
		this.translate.use(current_lng);
	}

	currencyList: any = [];
	rechRhythmLust: any = [];
	zahlRhythmList: any = [];
	terminationTimeList: any = [];
	stateList: any = [];
	bankList: any = [];

	dtBankOptions: DataTables.Settings = {};

	termination_time_value_show: any = false;
	ustr_mandatory_disabled = true;
	payment_stop_box: any = false;
	paymentstopList: any = [];

	cityName: string;
	countryName: string;
	stateName: string;
	zipCodeError: boolean = false;

	isValidIBAN: boolean;
	bankName: string;
	bic: string;

	isValidPaymentStopIBAN: boolean;
	paymentStopBankName: string;
	paymentStopBic: string;
	matcher = new CalendarValidator();
	matcherForPaymentStop = new PaymentStopValidator();

	visible = true;
	selectable = true;
	removable = true;
	addOnBlur = true;
	readonly separatorKeysCodes: number[] = [ENTER, COMMA];
	mobiles: string[] = [];

	ngOnInit() {

		this.changeFormData.emit(true);
		this.overviewData = new FormGroup({
			contractorId: new FormControl(''),
			contractor_number: new FormControl(''),
			alias: new FormControl(''),
			name1: new FormControl(''),
			name2: new FormControl(''),
			street: new FormControl(''),
			zipcode: new FormControl(''),
			city: new FormControl(''),
			state: new FormControl(''),
			country: new FormControl(''),
			phone1: new FormControl(''),
			mobiles: new FormControl(''),
			fax: new FormControl(''),
			email: new FormControl(''),
			rech_rhythm: new FormControl(''),
			zahl_rhythm: new FormControl(''),
			contract_file: new FormControl(''),
			contract_start_date: new FormControl(''),
			contract_end_date: new FormControl(''),
			termination_time: new FormControl(''),
			termination_time_value: new FormControl(''),
			billed: new FormControl(''),
			tax_identification_number: new FormControl(''),
			bank: new FormControl(''),
			iban: new FormControl(''),
			bic: new FormControl(''),
			national_tax_number: new FormControl(''),
			ustr_mandatory: new FormControl(''),
			ustr_mandatory_value: new FormControl(''),
			commercial_date: new FormControl(''),
			bank1Id: new FormControl(''),
			bank1_name: new FormControl(''),
			bank2Id: new FormControl(''),
			bank2_name: new FormControl(''),
			currency: new FormControl(''),
			contract_ok: new FormControl(''),
			payment_stop: new FormControl(''),
			bankaccount_liquidator: new FormControl(''),
			account_holder: new FormControl(''),
			payment_stop_iban: new FormControl(''),
			payment_stop_bic: new FormControl(''),
			payment_stop_bank_name: new FormControl(''),
			creditor_no: new FormControl(''),
			debitor_no: new FormControl(''),
			location: this.createLocation()
		});

		this.paymentstopList = this.commonService.paymentstopList();
		this.contract_start_date = this.commonService.dateRancePickerOptions();
		this.contract_end_date = this.commonService.dateRancePickerOptions();
		this.commercial_date = this.commonService.dateRancePickerOptions();

		this.overviewData.valueChanges.subscribe(val => {
			if (val.name1 !== "" ||
				val.name2 !== "" ||
				val.alias !== "" ||
				val.street !== "" ||
				val.zipcode !== "" ||
				val.city !== undefined ||
				val.phone1 !== "" ||
				val.fax !== "" ||
				val.email !== "" ||
				val.rech_rhythm !== "" ||
				val.zahl_rhythm !== "" ||
				val.contract_file !== "" ||
				val.contract_start_date !== "" ||
				val.contract_end_date !== "" ||
				val.termination_time !== "" ||
				val.termination_time_value !== "" ||
				val.state !== undefined ||
				val.country !== "" ||
				val.billed !== "" ||
				val.tax_identification_number !== "" ||
				val.national_tax_number !== "" ||
				val.bank !== undefined ||
				val.iban !== "" ||
				val.bic !== undefined ||
				val.ustr_mandatory !== "" ||
				val.ustr_mandatory_value !== "" ||
				val.commercial_date !== "" ||
				val.bank1Id !== "" ||
				val.bank1_name !== "" ||
				val.bank2Id !== "" ||
				val.bank2_name !== "" ||
				val.currency !== "" ||
				val.payment_stop !== "" ||
				val.bankaccount_liquidator !== "" ||
				val.account_holder !== "" ||
				val.payment_stop_iban !== "" ||
				val.payment_stop_bic !== "" ||
				val.debitor_no !== "" ||
				val.creditor_no !== "" ||
				val.payment_stop_bank_name !== "") {
				this.changeFormData.emit(false);
			} else {
				this.changeFormData.emit(true);
			}
		});

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

		const allParams = this.route.snapshot.params;

		if (allParams) {
			if (allParams.contractorId === undefined || allParams.contractorId === null) this.newNumber();
		}

		this.getAllBanks();
	}

	ngOnChanges() {
		if (this.basicData && this.basicData !== undefined) {
			for (var key in this.basicData) {
				if (this.basicData.hasOwnProperty(key) && key !== 'status' && key !== 'comment' && key !== 'created_time' && key !== 'updated_time' && key !== 'location') {

					let value = (this.basicData[key] && this.basicData[key] != undefined && this.basicData[key] !== null) ? this.basicData[key] : '';
					if (key === 'ustr_mandatory') {
						if (value == 1) this.ustr_mandatory_disabled = false;
						this.overviewData.controls[`${key}`].setValue(value);
					}
					else if (key === 'termination_time') {
						if (value == 'Sonstige') this.termination_time_value_show = true;
						this.overviewData.controls[`${key}`].setValue(value);
					}
					else if (key === 'payment_stop') {
						if (value == 2) this.payment_stop_box = true;
						this.overviewData.controls[`${key}`].setValue(value);
					}
					//remove once phone2 is removed on a backend
					else if (key === 'mobiles') {
						this.mobiles = value;
					}

					else {
						if (this.overviewData.controls[`${key}`] != undefined)
						{
							if (key == 'contract_start_date' || key == 'contract_end_date' || key == 'commercial_date') {
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

	formData() {
		$("#overviewFrm").addClass("validateFrm");

		if (this.overviewData.valid) {
			this.overviewData.value.mobiles = this.mobiles;
			return this.overviewData.value;

		} else {
			return false;
		}
		// return this.overviewData.value;
	}

	newNumber() {
		this.contractorsService.getNewContractorNo().subscribe(result => {
			this.newContractorId = result.newcontractorId;
			this.overviewData.controls[`contractor_number`].setValue(result.newcontractorId);
			this.getNewContractorIdEvent.emit(this.newContractorId);
		})
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

	commercial_dateSelect(value: any, datepicker?: any) {
		let start = value.start;
		let commercial_date = this.commonService.transformDate(start, 'dd.MM.yyyy');
		if (this.overviewData.value.commercial_date == commercial_date) {
			this.overviewData.controls[`commercial_date`].setValue(commercial_date);
		}
	}

	payment_stopSelected($event: any) {
		let value = $event.value;
		if (value) {
			this.payment_stop_box = false;
			if (value == 1) {
				this.payment_stop_box = true;
			}
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
					this.bic = result.bankData.bic;
					this.isValidIBAN = result.valid;
				},
					error => {
						console.log("iban is invalid");
						this.bankName = "";
						this.bic = "";
					}
				);
		} else {
			console.log("The length of IBAN should be bigger than 15.");
			this.bankName = "";
			this.bic = "";
		}
	}

	validatePaymentStopIBAN(event) {
		let paymentStopIBAN = event.target.value;
		if (paymentStopIBAN.length > 15) {
			this.commonService.validateIBAN(paymentStopIBAN)
				.subscribe(result => {
					this.paymentStopBankName = result.bankData.name;
					this.paymentStopBic = result.bankData.bic;
					this.isValidPaymentStopIBAN = result.valid;
				},
					error => {
						console.log("iban is invalid");
						this.paymentStopBankName = "";
						this.paymentStopBic = "";
					}
				);
		} else {
			console.log("The length of IBAN should be bigger than 15.");
			this.paymentStopBankName = "";
			this.paymentStopBic = "";
		}
	}

	changePhoneNumber($event) {
		if ($event.target.name === 'phone1' && $event.target.value === '') {
			this.overviewData.controls['phone1'].setValue('+49');
		}

		if ($event.target.name === 'mobiles' && $event.target.value === '') {
			this.overviewData.controls['mobiles'].setValue('+49');
		}
	}

	emptyValue($event) {
		if ($event.target.name === 'phone1' && $event.target.value === '+49') {
			this.overviewData.controls['phone1'].setValue('');
			$event.target.value = '';
		}
	}

	download() {
		this.fileService.downloadFile(this.fileKeyName, this.fileName);
	}

	add(event: MatChipInputEvent): void {
		const input = event.input;
		const value = event.value;

		// Add
		if ((value || '').trim()) {
			this.mobiles.push(value.trim());
		}

		// Reset the input value
		if (input) {
			input.value = '';
		}
	}

	remove(mobiles: string): void {
		const index = this.mobiles.indexOf(mobiles);

		if (index >= 0) {
			this.mobiles.splice(index, 1);
		}
	}

	onClickTable(evt) {
		const parentId = evt.target.parentNode.id;
		if (parentId !== 'bank1_Item' && parentId !== 'bank2_Item' && parentId !== 'bank_Item') evt.stopPropagation();
	}

	selectBank(bank) {
		this.overviewData.controls['bank'].setValue(bank.name);
	}

	selectBank1(bank) {
		this.overviewData.controls['bank1Id'].setValue(bank.bankId);
		this.overviewData.controls['bank1_name'].setValue(bank.name);
	}

	selectBank2(bank) {
		this.overviewData.controls['bank2Id'].setValue(bank.bankId);
		this.overviewData.controls['bank2_name'].setValue(bank.name);
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
