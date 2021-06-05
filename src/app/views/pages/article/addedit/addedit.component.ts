import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { first } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../../components/dialog/dialog.component';

import { NgForm } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../../services/lang.service';
import { TranslationService } from '../../../../core/_base/layout';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ArticleService } from '../article.service';
import { NavbarActionsService } from './../../../../services/navbar-actions.service';

import * as $ from 'jquery';
import { Location } from '@angular/common';

@Component({
	selector: 'kt-addedit',
	templateUrl: './addedit.component.html',
	styleUrls: ['./addedit.component.scss']
})
export class AddeditComponent implements OnInit {

	articleData: any = {};
	public articleFrm: FormGroup;
	articleId: any;
	isDisabled: boolean = true;
	isUpdating: boolean = false;

	navBarSubscription: any;

	constructor(private route: ActivatedRoute,
		public router: Router, private fb: FormBuilder,
		private translate: TranslateService,
		private languageService: LanguageService,
		private transServ: TranslationService,
		private articleService: ArticleService,
		private _location: Location,
		public dialog: MatDialog,
		private navBarActionService: NavbarActionsService
	) {

		let current_lng = this.transServ.getSelectedLanguage();
		this.translate.use(current_lng);

		const allParams = this.route.snapshot.params;

		if (allParams) {
			if (allParams.articleId !== undefined) {
				this.articleId = allParams.articleId;

				if (this.articleId && this.articleId > 0) {
					this.articleDetails();
				}

			} else {
				this.newNumber();
			}
		}
	}

	ngOnInit() {
		this.initialize();
		this.navBarActionService.changeDisabledSaveStatus(this.isDisabled);
		this.navBarActionService.changeActionName('');
		this.navBarSubscription = this.navBarActionService.action.subscribe(actionName => {
			if (actionName === 'save') this.submitFrm();
			if (actionName === 'cancel') this.cancel();
		});
	}

	initialize() {
		this.articleFrm = new FormGroup({
			articleId: new FormControl(''),
			article_number: new FormControl(''),
			description: new FormControl(''),
			price_customer: new FormControl(''),
			price_contractor: new FormControl(''),
			group: new FormControl(''),
			purchasing_price: new FormControl('')
		});

		this.articleFrm.valueChanges.subscribe(val => {
			if (val.description !== "" ||
				val.price_customer !== "" ||
				val.price_contractor !== ""||
				val.group !== "" ||
				val.purchasing_price !== "") {
				this.isDisabled = false;
				this.navBarActionService.changeDisabledSaveStatus(this.isDisabled);
			} else {
				this.isDisabled = true;
				this.navBarActionService.changeDisabledSaveStatus(this.isDisabled);
			}
		});
	}

	submit(form: NgForm) {
		if (form.value.email === "") {
			delete form.value.email;
		}
	}

	response: any;
	articleDetails() {
		this.articleService.getArticleDetails({ articleId: this.articleId }).subscribe(result => {
			this.response = result.data;

			if (this.response) {
				this.articleFrm.controls[`articleId`].setValue(this.response.articleId);
				this.articleFrm.controls[`article_number`].setValue(this.response.article_number);
				this.articleFrm.controls[`description`].setValue(this.response.description);
				this.articleFrm.controls[`price_customer`].setValue(this.response.price_customer);
				this.articleFrm.controls[`price_contractor`].setValue(this.response.price_contractor);
				this.articleFrm.controls['group'].setValue(this.response.group);
				this.articleFrm.controls['purchasing_price'].setValue(this.response.purchasing_price);
			}
		});
	}

	submitFrm() {
		$("#articleFrm").addClass("validateFrm");	
		if (this.articleFrm.valid) {
			this.isUpdating = true;

			let fromData = this.articleFrm.value;

			this.articleService.addeditArticle(fromData).subscribe(data => {
				this.router.navigate([`article`]);
			});
		}
	}

	cancel() {
		this._location.back();
	}

	newNumber() {
		this.articleService.getNewArticleNo().subscribe(result => {
			this.articleFrm.controls[`article_number`].setValue(result.newarticleId);
		});
	}

	canDeactivate(): Observable<boolean> | boolean {

		if (!this.isUpdating && this.articleFrm.dirty) {

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

	/**
 * On destroy
 */
	ngOnDestroy(): void {
		this.navBarActionService.changeActionName('');
		this.navBarSubscription.unsubscribe();
	}
}
