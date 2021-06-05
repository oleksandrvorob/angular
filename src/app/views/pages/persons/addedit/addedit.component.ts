import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { first } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../../components/dialog/dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../../services/lang.service';
import { TranslationService } from '../../../../core/_base/layout';
import { FormBuilder, FormGroup} from '@angular/forms';
import { PersonsService } from './../persons.service';

import { CommonService } from './../../../../services/common.service';
import { NavbarActionsService } from './../../../../services/navbar-actions.service';
import { Location } from '@angular/common';
import { OrderComponent } from './order/order.component';
import { OverviewComponent } from './overview/overview.component';
import { CommentsComponent } from './comments/comments.component';
@Component({
	selector: 'kt-addedit',
	templateUrl: './addedit.component.html',
	styleUrls: ['./addedit.component.scss']
})
export class AddeditComponent implements OnInit {
	@ViewChild(OrderComponent, { static: true }) orderComp: OrderComponent;
	@ViewChild(OverviewComponent, { static: true }) overview: OverviewComponent;
	@ViewChild(CommentsComponent, { static: true }) commentComp: CommentsComponent;

	articleData: any = {};
	public personsFrm: FormGroup;
	personId: any;
	isDisabled: boolean = true;
	isUpdating: boolean = false;
	salutationList: any = [];
	person_type_list: any = [];
	navBarSubscription: any;
	orderIdsList: any = [];
	comments: any;
	positionList: any = [];
	priceList: any = [];
	basicData: any;
	isAddMode: boolean = true;
	response: any;

	constructor(private route: ActivatedRoute,
		public router: Router, private fb: FormBuilder,
		private translate: TranslateService,
		private languageService: LanguageService,
		private transServ: TranslationService,
		private personsService: PersonsService,
		private _location: Location,
		public dialog: MatDialog,
		private navBarActionService: NavbarActionsService
	) {

		let current_lng = this.transServ.getSelectedLanguage();
		this.translate.use(current_lng);
	}

	ngOnInit() {
		const allParams = this.route.snapshot.params;
		if (allParams && allParams.personId !== undefined) {
			this.personId = allParams.personId;
			this.isAddMode = false;
		}
		if (!this.isAddMode)
			this.personDetails();

		this.navBarActionService.changeActionName('');
		this.navBarSubscription = this.navBarActionService.action.subscribe(actionName => {
			if (actionName === 'save') this.submitFrm();
			if (actionName === 'cancel') this.cancel();
		});
		this.navBarActionService.changeDisabledSaveStatus(this.isDisabled);
	}

	canDeactivate(): Observable<boolean> | boolean {
		if (!this.isUpdating && !this.isDisabled) {
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

	personDetails() {
		this.personsService.getPersonDetails({ personId: this.personId }).subscribe(result => {
			this.response = result.data;
			if (this.response) {
				this.basicData = this.response.basicData;
			}
		});
	}

	submitFrm() {
		this.isUpdating = true;
		let basicData = this.overview.formData();
		//let formData:any = {};
		let formData = new FormData();
		if (basicData !== false) {
			// formData.basicData = JSON.stringify(basicData);
			formData.append('basicData', JSON.stringify(basicData));
			this.personsService.addeditPerson(formData).subscribe(data => {
				this.router.navigate([`persons`]);
			});
		}
	}

	cancel() {
		this._location.back();
	}

	setDisableStatus(isDisabled: boolean) {
		this.isDisabled = isDisabled;
		this.navBarActionService.changeDisabledSaveStatus(this.isDisabled);
	}

	ngOnDestroy(): void {
		this.navBarActionService.changeActionName('');
		this.navBarSubscription.unsubscribe();
	}
}

export function toFormData<T>(formValue: T) {
	const formData = new FormData();
	for (const key of Object.keys(formValue)) {
	  const value = formValue[key];
	  formData.append(key, value);
	}
	return formData;
  }
  
