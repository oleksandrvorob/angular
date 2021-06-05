import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormControl, FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { CommonService } from '../../services/common.service';

@Component({
	selector: 'kt-price',
	templateUrl: './price-history.component.html',
	styleUrls: ['./price-history.component.scss']
})
export class PriceHistoryComponent implements OnInit {

	priceList: any;

	addedNewPriceList: any = [];
	priceHistoryForm: FormGroup;

	getFormattedPriceList(rowPriceList) {
		return rowPriceList.map(item => ({ ...item, valid_from: new Date(item.valid_from), date_of_expiry: new Date(item.date_of_expiry) }));
	}

	constructor(
		private dialogRef: MatDialogRef<PriceHistoryComponent>,
		@Optional() @Inject(MAT_DIALOG_DATA) public data: any,
		private commonService: CommonService,) {

		this.priceList = this.getFormattedPriceList(data.priceList);
	}

	ngOnInit() {
		this.priceHistoryForm = new FormGroup({
			price: new FormControl(''),
			valid_from: new FormControl(''),
			date_of_expiry: new FormControl('')
		});
	}

	handleDeleteRow(item: any, deletedIndex: number) {
		this.priceList = this.priceList.filter((item, index) => index !== deletedIndex);
		if (item) {
			let priceHistoryData = {
				insert: [],
				update: [],
				deletedIds: [item.id]
			};

			this.commonService.addNewPriceHistory(priceHistoryData)
				.subscribe((res: any) => {
				console.log("priceHistory result: ", res);
			});
		}
	}

	handleAddRow() {
		this.priceList = [...this.priceList, {
			price: '',
			valid_from: new FormControl(new Date()),
			date_of_expiry: new FormControl(new Date())
		}];

		this.addedNewPriceList = [...this.addedNewPriceList, {
			price: this.priceHistoryForm.get('price').value,
			valid_from: this.priceHistoryForm.get('valid_from').value,
			date_of_expiry: this.priceHistoryForm.get('date_of_expiry').value,
		}];
	}

	onAdd() {
		this.handleAddRow();
	}

	onClose() {
		this.dialogRef.close();
	}

	onSave() {
		this.addedNewPriceList = [...this.addedNewPriceList, {
			price: this.priceHistoryForm.get('price').value,
			valid_from: this.priceHistoryForm.get('valid_from').value,
			date_of_expiry: this.priceHistoryForm.get('date_of_expiry').value,
		}];
		this.addedNewPriceList.shift();
		this.dialogRef.close(this.addedNewPriceList);
	}
}
