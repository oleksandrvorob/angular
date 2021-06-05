import {Component, Input, OnInit, ViewChild, Output, EventEmitter} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

import { FormBuilder, FormGroup, FormControl , Validators } from '@angular/forms';
import { TranslationService } from '../../../../../core/_base/layout';

@Component({
  selector: 'kt-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {

	public invoiceFrm: FormGroup;

	@Input() invoiceData;
	@Output() changeFormData = new EventEmitter<boolean>();

	constructor(private route: ActivatedRoute,
		public router: Router, private fb: FormBuilder,
		private translate: TranslateService,
		private transServ: TranslationService  ) {

		let current_lng = this.transServ.getSelectedLanguage();
		this.translate.use(current_lng);
	}

	ngOnInit() {

		this.changeFormData.emit(true);
		this.invoiceFrm = new FormGroup({
			executive_director: new FormControl(''),
			commercial_register: new FormControl(''),
			commercial_register_number: new FormControl(''),
			complementary: new FormControl(''),
			hra: new FormControl(''),
			ust_id: new FormControl(''),
			tax_number: new FormControl(''),
			logo_file: new FormControl(''),
			logo_position: new FormControl(''),
			website: new FormControl(''),
		});

		this.invoiceFrm.valueChanges.subscribe(val => {
			if(val.executive_director !== "" ||
				val.commercial_register !== "" ||
				val.ust_id !== "" ||
				val.tax_number !== "" ||
				val.logo_file !== "" ||
				val.logo_position !== "" ||
				val.website !== ""){
					this.changeFormData.emit(false);
				}else {
					this.changeFormData.emit(true);
				}
		});


    }

	ngOnChanges() {
		if(this.invoiceData && this.invoiceData!==undefined){
			for (var key in this.invoiceData) {
				if (this.invoiceData.hasOwnProperty(key) && key !=='company_rechnungsfullId' && key !=='companyId' ) {
					let value = (this.invoiceData[key] && this.invoiceData[key]!=undefined && this.invoiceData[key]!==null) ? this.invoiceData[key] : '';
					if(this.invoiceFrm.controls[`${key}`] != undefined) {
						this.invoiceFrm.controls[`${key}`].setValue(value);
					}
				}
			}
		}

	}

	formData(){

		if(this.invoiceFrm.valid){
			let fromData = this.invoiceFrm.value;
			return fromData;

		}
		else{
			$("#invoiceFrm").addClass("validateFrm");
			return false;
		}


	}

}
