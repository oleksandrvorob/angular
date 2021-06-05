import { Component, Input, OnInit, ViewChild, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslationService } from '../../../../../core/_base/layout';
import { CommonService } from './../../../../../services/common.service';
import { CompaniesService } from './../../companies.service';

@Component({
	selector: 'kt-banking',
	templateUrl: './banking.component.html',
	styleUrls: ['./banking.component.scss']
})
export class BankingComponent implements OnInit {

	public bankingFrm: FormGroup;
	isValidIBAN: boolean;
	bankName: string;
	bic: string;
	bankList: any = [];
	dtBankOptions: DataTables.Settings = {};
	companyId: number;
	@Input() bankingDatas;
	@Output() changeFormData = new EventEmitter<boolean>();

	constructor(
		private route: ActivatedRoute,
		public router: Router,
		private fb: FormBuilder,
		private cd: ChangeDetectorRef,
		private translate: TranslateService,
		private transServ: TranslationService,
		private commonService: CommonService,
		private companiesService: CompaniesService ,
	) {
		let current_lng = this.transServ.getSelectedLanguage();
		this.translate.use(current_lng);
	}

	ngOnInit() {

		this.changeFormData.emit(true);
		this.bankingFrm = new FormGroup({
			account: new FormControl(''),
			bank_name: new FormControl(''),
			bankId: new FormControl(''),
			iban: new FormControl(''),
			bic: new FormControl(''),
			dtaus_no: new FormControl(''),
			usage: new FormControl(''),
			dtaus_path: new FormControl(''),
			sepa: new FormControl(''),
			converter: new FormControl(''),
			sepa_path: new FormControl(''),
			sepa_no: new FormControl('')
		});

		this.bankingFrm.valueChanges.subscribe(val => {
			if (val.account !== "" ||
				val.bank_name !== "" ||
				val.iban !== "" ||
				val.bic !== "" ||
				val.dtaus_no !== "" ||
				val.usage !== "" ||
				val.dtaus_path !== "" ||
				val.sepa !== "" ||
				val.converter !== "" ||
				val.sepa_path !== "" ||
				val.sepa_no !== "") {
				this.changeFormData.emit(false);
			} else {
				this.changeFormData.emit(true);
			}
		});
		this.getAllBanks();
	}

	ngOnChanges() {
		if (this.bankingDatas && this.bankingDatas !== undefined) {
			this.companyId = this.bankingDatas.companyId;
			for (var key in this.bankingDatas) {
				if (this.bankingDatas.hasOwnProperty(key) && key !== 'company_bankingId' && key !== 'companyId') {

					let value = (this.bankingDatas[key] && this.bankingDatas[key] != undefined && this.bankingDatas[key] !== null) ? this.bankingDatas[key] : '';
					if(this.bankingFrm.controls[`${key}`] != undefined) {
						this.bankingFrm.controls[`${key}`].setValue(value);
					}
				}
			}
		}

	}

	formData() {

		if (this.bankingFrm.valid) {
			// return this.bankingFrm.value;
			let fromData = this.bankingFrm.value;
			return fromData;

		}
		else {
			$("#bankingFrm").addClass("validateFrm");
			return false;
		}

		// return this.bankingFrm.value;
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
						this.bankName = "";
						this.bic = "";
					}
				);
		} else {
			this.bankName = "";
			this.bic = "";
		}
	}

	onClickBankTable(evt){
		const parentId = evt.target.parentNode.id;
		if (parentId !== 'bank_Item') evt.stopPropagation();
	}

	selectBank(item) {
		this.bankingFrm.controls['bank_name'].setValue(item.name);
		this.bankingFrm.controls['bankId'].setValue(item.bankId);
		this.bankingFrm.controls['iban'].setValue(item.iban);
		this.bankingFrm.controls['bic'].setValue(item.bic);
	}

	changeuStrMandatory(){

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

				dataTablesParameters.search.value = this.bankingFrm.get('bank_name').value;

				this.companiesService.getAllBanksByCompanyId(this.companyId, dataTablesParameters).subscribe(resp => {
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
