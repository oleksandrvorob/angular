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
import { BankingService } from '../../../system/banking/banking.service';

import { CompaniesService } from '../../../companies/companies.service';
import { MapsService } from '../../../maps/maps.service';

@Component({
	selector: 'kt-overview',
	templateUrl: './overview.component.html',
	styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
	@Input() basicData;
	@Input() isAddMode;
	@Output() changeFormData = new EventEmitter<boolean>();
	public personsFrm: FormGroup;
	
	personDetails: any = {};
	articleData: any = {};
	
	personId: any;
	isDisabled: boolean = true;
	isUpdating: boolean = false;
	salutationList: any = [];
	person_type_list: any = [];
	navBarSubscription: any;
	orderIdsList: any = [];
	priceList: any = [];
	constructor(private route: ActivatedRoute,
		public router: Router,
		private fb: FormBuilder,
		private translate: TranslateService,
		private transServ: TranslationService,
		private languageService: LanguageService,
		private cd: ChangeDetectorRef,
		private commonService: CommonService,
	) {
		let current_lng = this.transServ.getSelectedLanguage();
		this.translate.use(current_lng);
	}

	ngOnInit() {
		this.personsFrm = new FormGroup({
			personId: new FormControl(''),
			salutation: new FormControl(''),
			first_name: new FormControl(''),
			surname: new FormControl(''),
			position: new FormControl(''),
			department: new FormControl(''),
			phone: new FormControl(''),
			mobile_number: new FormControl(''),
			fax: new FormControl(''),
			email: new FormControl(''),
			type: new FormControl(''),
			comment: new FormControl(''),
			status: new FormControl(''),
		});

		this.personsFrm.valueChanges.subscribe(val => {
			if (val.salutation !== "" ||
				val.first_name !== "" ||
				val.surname !== "" ||
				val.position !== "" ||
				val.department !== "" ||
				val.phone !== "" ||
				val.mobile_number !== "" ||
				val.fax !== "" ||
				val.email !== "" ||
				val.comment !== "" ||
				val.type !== ""
			) {
				this.changeFormData.emit(false);
			} else {
				this.isDisabled = true;
				this.changeFormData.emit(true);
			}
		});

		this.salutationList = this.commonService.salutationList();
		this.person_type_list = this.commonService.personTypeList();
	}

	ngOnChanges() {
		if (this.basicData && this.basicData !== undefined) {
			this.personsFrm.controls[`personId`].setValue(this.basicData.personId);
			this.personsFrm.controls[`salutation`].setValue(this.basicData.salutation);
			this.personsFrm.controls[`first_name`].setValue(this.basicData.first_name);
			this.personsFrm.controls[`surname`].setValue(this.basicData.surname);
			this.personsFrm.controls[`position`].setValue(this.basicData.position);
			this.personsFrm.controls[`department`].setValue(this.basicData.department);
			this.personsFrm.controls[`phone`].setValue(this.basicData.phone);
			this.personsFrm.controls[`mobile_number`].setValue(this.basicData.mobile_number);
			this.personsFrm.controls[`fax`].setValue(this.basicData.fax);
			this.personsFrm.controls[`email`].setValue(this.basicData.email);
			this.personsFrm.controls[`type`].setValue(this.basicData.type);
			this.personsFrm.controls[`comment`].setValue(this.basicData.comment);
		}
	}


	changePhoneNumber($event) {
		if ($event.target.name === 'phone' && $event.target.value === '') {
			this.personsFrm.controls['phone'].setValue('+49');
		}
		if ($event.target.name === 'mobile_number' && $event.target.value === '') {
			this.personsFrm.controls['mobile_number'].setValue('+49');
		}
	}

	emptyValue($event) {
		if ($event.target.name === 'phone' && $event.target.value === '+49') {
			this.personsFrm.controls['phone'].setValue('');
			$event.target.value = '';
		}
		if ($event.target.name === 'mobile_number' && $event.target.value === '+49') {
			this.personsFrm.controls['mobile_number'].setValue('');
			$event.target.value = '';
		}
	}

	formData() {
		$("#personsFrm").addClass("validateFrm");
		if (this.personsFrm.valid) {
			return this.personsFrm.value;
		} else {
			return false;
		}
	}
}
