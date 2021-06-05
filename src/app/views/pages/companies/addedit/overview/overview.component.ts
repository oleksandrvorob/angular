import {Component, Input, OnInit, ViewChild, EventEmitter, Output} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

import { TranslationService } from '../../../../../core/_base/layout';

import { FormBuilder, FormGroup, FormControl , Validators } from '@angular/forms';

import { CompaniesService } from './../../companies.service';
import { CommonService } from './../../../../../services/common.service';
import { DaterangePickerComponent } from 'ng2-daterangepicker';
import { CalendarValidator } from '../../../../../validators/calendar.validator';

@Component({
  selector: 'kt-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

	public overviewData: FormGroup;
	matcher = new CalendarValidator();
	@Input() basicData;

	@ViewChild(DaterangePickerComponent, { static: true })
	public last_rech_date: DaterangePickerComponent;

	@Output() changeFormData = new EventEmitter<boolean>();

	constructor(private route: ActivatedRoute,
		public router: Router, private fb: FormBuilder,
		private translate: TranslateService,
		private transServ: TranslationService ,
		private companiesService: CompaniesService ,
		private commonService: CommonService ) {
			let current_lng = this.transServ.getSelectedLanguage();
			this.translate.use(current_lng);
	}

	ngOnInit() {

		this.changeFormData.emit(true);
		this.overviewData = new FormGroup({
			companyId: new FormControl(''),
			// company_number: new FormControl({value: '', disabled: true}),
			company_number: new FormControl(''),
			group_name: new FormControl(''),
			name1: new FormControl(''),
			name2: new FormControl(''),
			street: new FormControl(''),
			postcode: new FormControl(''),
			country_name: new FormControl(''),
			phone1: new FormControl(''),
			phone2: new FormControl(''),
			fax: new FormControl(''),
			ustr_mandatory: new FormControl(''),
			// ustr_mandatory_value: new FormControl({value: '', disabled: true}),
			ustr_mandatory_value: new FormControl(''),
			code: new FormControl('', Validators.maxLength(5)),
			invoice_number: new FormControl(''),
			num_invoice: new FormControl(''),
			num_r_branch: new FormControl(''),
			last_set_position: new FormControl(''),
			ag_ltp_number: new FormControl(''),
			last_rech_date: new FormControl(''),
		});

		this.overviewData.valueChanges.subscribe(val => {
			if(
				val.group_name !== "" ||
				val.name1 !== "" ||
				val.name2 !== "" ||
				val.street !== "" ||
				val.postcode !== "" ||
				val.phone1 !== "" ||
				val.phone2 !== "" ||
				val.fax !== "" ||
				val.ustr_mandatory_value !== "" ||
				val.code !== "" ||
				val.invoice_number !== "" ||
				val.num_invoice !== "" ||
				val.num_r_branch !== "" ||
				val.last_set_position !== "" ||
				val.ag_ltp_number !== "" ||
				val.last_rech_date !== ""){
					this.changeFormData.emit(false);
				}else {
					this.changeFormData.emit(true);
				}
		});

		const allParams = this.route.snapshot.params;

		this.last_rech_date = this.commonService.dateRancePickerOptions();


		if(allParams){
			if(allParams.companyId ===undefined || allParams.companyId===null )  this.newNumber();
		}


    }

	ustr_mandatory_disabled = true;

	ngOnChanges() {
		if(this.basicData && this.basicData!==undefined){
			for (var key in this.basicData) {
				if (this.basicData.hasOwnProperty(key) && key !=='status' && key !=='created_time' && key !=='updated_time' ) {
					let value = (this.basicData[key] && this.basicData[key]!=undefined && this.basicData[key]!==null) ? this.basicData[key] : '';
					if(key!=='ustr_mandatory'){
						this.ustr_mandatory_disabled = ((value!==1) ? false : true);
					}
					if(this.overviewData.controls[`${key}`] != undefined) {
						if (key == 'last_rech_date') {
							if(value == "0000-00-00") {
								this.overviewData.controls[`${key}`].setValue("");
							} else {
								this.overviewData.controls[`${key}`].setValue(this.commonService.convertDateforCustomFormat(value));
							}
						}else{
							this.overviewData.controls[`${key}`].setValue(value);
						}
					}
				}

			}
		}

	}

	formData(){
		if(this.overviewData.valid){
			let formData = this.overviewData.value;
			return formData;
		}
		else{
			$("#overviewData").addClass("validateFrm");
			return false;
		}
	}

	newNumber(){
		this.companiesService.getNewCompanyNo().subscribe(result => {
			this.overviewData.controls[`company_number`].setValue(result.newcompanyId);
		});
	}

	changeuStrMandatory(){
		this.ustr_mandatory_disabled = !this.ustr_mandatory_disabled;
		this.overviewData.controls['ustr_mandatory_value'].setValue('19');
	}


	last_rech_dateSelect(value: any, datepicker?: any){
		let start = value.start;
		let last_rech_date = this.commonService.transformDate(start, 'dd.MM.yyyy');
		if( this.overviewData.value.last_rech_date == last_rech_date)
		{
			this.overviewData.controls[`last_rech_date`].setValue(last_rech_date);
		}
	}

	dateApplied(e:any){
		this.overviewData.controls[e.event.currentTarget.name].setValue(this.commonService.transformDate(e.picker.startDate, 'dd.MM.yyyy'));
	}

	changePhoneNumber($event){
		if($event.target.name === 'phone1' && $event.target.value === '') {
		  this.overviewData.controls['phone1'].setValue('+49');
		}
		if($event.target.name === 'phone2' && $event.target.value === '') {
		  this.overviewData.controls['phone2'].setValue('+49');
		}
	}

	emptyValue($event){
		if($event.target.name === 'phone1' && $event.target.value === '+49'){
		  this.overviewData.controls['phone1'].setValue('');
		  $event.target.value = '';
		}
		if($event.target.name === 'phone2' && $event.target.value === '+49'){
		  this.overviewData.controls['phone2'].setValue('');
		  $event.target.value = '';
		}
	}

	getCityName(event) {
		let zipCode = event.target.value;
		this.commonService.getCityName(zipCode).subscribe(result => {
			this.overviewData.controls['country_name'].setValue(result.country);
		}, error => {
			console.log("error: ", error);
		});
	}
}
