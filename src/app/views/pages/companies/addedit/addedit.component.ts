import { Component, OnInit, ViewChild } from '@angular/core';


import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { first } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import { CompaniesService } from './../companies.service';
import { NavbarActionsService } from './../../../../services/navbar-actions.service';

import { OverviewComponent } from './overview/overview.component';
import { BankingComponent } from './banking/banking.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { DialogComponent } from '../../../../components/dialog/dialog.component';
import { ActivatedRoute, Router } from '@angular/router';

import { TranslationService } from '../../../../core/_base/layout';
import { Location } from '@angular/common';

@Component({
  selector: 'kt-addedit',
  templateUrl: './addedit.component.html',
  styleUrls: ['./addedit.component.scss']
})
export class AddeditComponent implements OnInit {

  @ViewChild(OverviewComponent, { static: true }) overview: OverviewComponent;
  @ViewChild(BankingComponent, { static: true }) bankComp: BankingComponent;
  @ViewChild(InvoiceComponent, { static: true }) invoiceComp: InvoiceComponent;

  companyId: any;

  basicData: any;
  bankingData: any;
  invoiceData: any;
  isDisabled: boolean = true;
  isUpdating: boolean = false;

  navBarSubscription: any;

  constructor(private companiesService: CompaniesService,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private transServ: TranslationService,
    public router: Router,
    private _location: Location,
    public dialog: MatDialog,
    private navBarActionService: NavbarActionsService) {

    let current_lng = this.transServ.getSelectedLanguage();
    this.translate.use(current_lng);

  }

  ngOnInit() {
    const allParams = this.route.snapshot.params;

    if (allParams) {
      if (allParams.companyId !== undefined) {
        this.companyId = allParams.companyId;
      }
    }

    if (this.companyId && this.companyId > 0) {
      this.clientDetails();
    }

    this.navBarActionService.changeActionName('');
    this.navBarSubscription = this.navBarActionService.action.subscribe(actionName => {
      if(actionName==='save') this.submitFrm();
      if(actionName==='cancel') this.cancel();
    });

    this.navBarActionService.changeDisabledSaveStatus(this.isDisabled);

  }

  response: any;

  clientDetails() {
    this.companiesService.getCompaniesDetails({ companyId: this.companyId }).subscribe(result => {
      // this.router.navigate([`clients`]);
      this.response = result.data;
      this.basicData = this.response.basicData;
      this.bankingData = this.response.bankingData;
      this.invoiceData = this.response.invoiceData;
    });
  }

  submitFrm() {
	let sendData = new FormData();
    this.isUpdating = true;
	let basicData = this.overview.formData();
	let bankingData = this.bankComp.formData();
	let invoiceData = this.invoiceComp.formData();

	const logo_file: File = invoiceData['logo_file'];
	if(logo_file) {
		sendData.append("logo", logo_file);
	}

    if (basicData !== false && bankingData !== false && invoiceData !== false) {
		sendData.append('basicData', JSON.stringify(basicData));
		sendData.append('bankingData', JSON.stringify(bankingData));
		sendData.append('invoiceData', JSON.stringify(invoiceData));

      this.companiesService.addeditCompanies(sendData).subscribe(data => {
        this.router.navigate([`companies`]);
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

	/**
	 * On destroy
	 */
  ngOnDestroy(): void {
    this.navBarActionService.changeActionName('');
    this.navBarSubscription.unsubscribe();
  }
}
