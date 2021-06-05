import { Component, OnInit, ViewChild } from '@angular/core';

import { DaterangePickerComponent } from 'ng2-daterangepicker';
import { CommonService } from './../../../services/common.service';
import { FormBuilder, FormGroup } from '@angular/forms';

import { TranslationService } from '../../../core/_base/layout';
import { TranslateService } from '@ngx-translate/core';
import { CalendarValidator } from '../../../validators/calendar.validator';

@Component({
  selector: 'kt-bill-run',
  templateUrl: './bill-run.component.html',
  styleUrls: ['./bill-run.component.scss']
})
export class BillRunComponent implements OnInit {

	@ViewChild(DaterangePickerComponent, { static: true })
	public invoice_date: DaterangePickerComponent;
	public customer_billing_from: DaterangePickerComponent;
	public customer_billing_to: DaterangePickerComponent;
	public businessman_billing_from: DaterangePickerComponent;
	public businessman_billing_to: DaterangePickerComponent;
	matcher = new CalendarValidator();
	billFrData: FormGroup;
	companyList = [];
	companyCode: string;

	constructor(private commonService: CommonService,
	private fb: FormBuilder,
	private translate: TranslateService,
	private transServ: TranslationService,
	){
		let current_lng = this.transServ.getSelectedLanguage();
		this.translate.use(current_lng);
	}

	ngOnInit() {
		this.billFrData = this.fb.group({
			'invoice_date': [''],
			'company' : [''],
			'diesel_price': [''],
			'customer_bills': [''],
			'customer_monthly_billing' : [''],
			'customer_billing1': [''],
			'customer_billing2': [''],
			'customer_billing_diesel_surcharge' : [''],
			'customer_only' : [''],
			'group_only' : [''],
			'businessman_bills' : [''],
			'businessman_monthly_billing' : [''],
			'businessman_billing1' : [''],
			'businessman_billing2' : [''],
			'businessman_billing_diesel_surcharge' : [''],
			'settle_installment_payments' : [''],
			'businessman_only' : [''],
			'customer_billing_month': [''],
			'customer_billing_year': [''],
			'customer_billing_from': [''],
			'customer_billing_to': [''],
			'businessman_billing_month': [''],
			'businessman_billing_year': [''],
			'businessman_billing_from': [''],
			'businessman_billing_to': ['']
		});

		this.invoice_date = this.commonService.dateRancePickerOptions();
		this.customer_billing_from = this.commonService.dateRancePickerOptions();
		this.customer_billing_to = this.commonService.dateRancePickerOptions();
		this.businessman_billing_from = this.commonService.dateRancePickerOptions();
		this.businessman_billing_to = this.commonService.dateRancePickerOptions();
	}

	cancel(){

	}
	submitFrm(){

	}
	invoice_dateSelect(value: any, datepicker?: any){
		let start = value.start;
		let invoice_date = this.commonService.transformDate(start, 'dd.MM.yyyy');
		this.billFrData.controls[`invoice_date`].setValue(invoice_date);
	}

	customer_billing_start(value: any, datepicker?: any){
		let start = value.start;
		let customer_start_date = this.commonService.transformDate(start, 'dd.MM.yyyy');
		this.billFrData.controls[`customer_billing_from`].setValue(customer_start_date);
	}

	customer_billing_end(value: any, datepicker?: any){
		let start = value.start;
		let customer_end_date = this.commonService.transformDate(start, 'dd.MM.yyyy');
		this.billFrData.controls[`customer_billing_to`].setValue(customer_end_date);
	}

	businessman_billing_start(value: any, datepicker?: any){
		let start = value.start;
		let businessman_start_date = this.commonService.transformDate(start, 'dd.MM.yyyy');
		this.billFrData.controls[`businessman_billing_from`].setValue(businessman_start_date);
	}

	businessman_billing_end(value: any, datepicker?: any){
		let start = value.start;
		let businessman_end_date = this.commonService.transformDate(start, 'dd.MM.yyyy');
		this.billFrData.controls[`businessman_billing_to`].setValue(businessman_end_date);
	}

	dateApplied(e: any) {
		this.billFrData.controls[e.event.currentTarget.name].setValue(this.commonService.transformDate(e.picker.startDate, 'dd.MM.yyyy'));
	}

	selectCompany(e) {
		
	}
}
