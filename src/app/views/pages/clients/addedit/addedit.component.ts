import { HttpClient, HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { MatDialog } from '@angular/material/dialog';

import { OverviewComponent } from './overview/overview.component';
import { TranslateService } from '@ngx-translate/core';

import { ClientsService } from './../clients.service';
import { NavbarActionsService } from './../../../../services/navbar-actions.service';

import { CommentsComponent } from './comments/comments.component';
import { ContactPersonComponent } from './contact-person/contact-person.component';
import { OrderComponent } from './order/order.component';
import { SpecialTourComponent } from './special-tour/special-tour.component';
import { HistoryComponent } from './history/history.component';

import { DialogComponent } from '../../../../components/dialog/dialog.component';

import { ActivatedRoute, Router } from '@angular/router';

import { TranslationService } from '../../../../core/_base/layout';
import { Location } from '@angular/common';

import { pipe } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { CommonService } from '../../../../services/common.service';

export function uploadProgress<T>(cb: (progress: number) => void) {
  return tap((event: HttpEvent<T>) => {
    if (event.type === HttpEventType.UploadProgress) {
      cb(Math.round((100 * event.loaded) / event.total));
    }
  });
}

export function toResponseBody<T>() {
  return pipe(
    filter((event: HttpEvent<T>) => event.type === HttpEventType.Response),
    map((res: HttpResponse<T>) => res.body)
  );
}

@Component({
  selector: 'kt-addedit',
  templateUrl: './addedit.component.html',
  styleUrls: ['./addedit.component.scss']
})
export class AddeditComponent implements OnInit {

  @ViewChild(OverviewComponent, { static: true }) overview: OverviewComponent;
  @ViewChild(ContactPersonComponent, { static: true }) personComp: ContactPersonComponent;
  @ViewChild(CommentsComponent, { static: true }) commentComp: CommentsComponent;
  @ViewChild(OrderComponent, { static: true }) orderComp: OrderComponent;
  @ViewChild(SpecialTourComponent, { static: true }) specialtourComp: SpecialTourComponent;
  @ViewChild(HistoryComponent, { static: false }) historyComp: HistoryComponent;

  clientId: any;
  clientNumber: any;
  basicData: any;
  presonIdsList: any;
  comments: any;
  orderIdsList: any;
  specialorderData: any;
  history: any;
  isDisabled: boolean = true;
  isUpdating: boolean = false;
  uploadedFile: any;
  fileName: any;
  fileKeyName: any;
  navBarSubscription: any;
  isAddMode: boolean = true;
  response: any;

  constructor(private clientservice: ClientsService,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private transServ: TranslationService,
    public router: Router,
    private _location: Location,
    private http: HttpClient,
    private cd: ChangeDetectorRef,
    public dialog: MatDialog,
    private navBarActionService: NavbarActionsService,
    private commonService: CommonService
  ) {

    let current_lng = this.transServ.getSelectedLanguage();
    this.translate.use(current_lng);

  }

  ngOnInit() {
    const allParams = this.route.snapshot.params;
    if (allParams && allParams.clientId !== undefined) {
      this.clientId = allParams.clientId;
      this.isAddMode = false;
    }

    if (!this.isAddMode)
      this.clientDetails();

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

  clientDetails() {
    this.clientservice.getClientDetails({ clientId: this.clientId }).subscribe(result => {
      // this.router.navigate([`clients`]);
      this.response = result.data;
      this.basicData = this.response.basicData;
      this.comments = this.basicData.comment;
      this.presonIdsList = this.response.presonIdsList;
      this.orderIdsList = this.response.tourList;
      this.specialorderData = this.response.specialtourData[0];
      this.clientNumber = this.basicData.client_number;
    });
  }

  submitFrm() {
    this.isUpdating = true;
    let basicData = this.overview.formData();
    let clientPersonData = this.personComp.getClientPersonData();
    let personList: any = []; let deleteClientPersons: any = [];
    if (clientPersonData !== undefined) {
      personList = clientPersonData.newPersonIds;
      deleteClientPersons = clientPersonData.deleteClientPersons;
    }

    let comments: any = this.commentComp.getComment();
    let clientOrderData: any = this.orderComp.getClientOrderData();

    let orderDataList: any = [];
    let deleteClientOrders: any = [];
    let priceHistoryList: any = [];

    if (clientOrderData !== undefined) {
      orderDataList = clientOrderData.newOrderIds;
      deleteClientOrders = clientOrderData.deleteClientOrders;
      priceHistoryList = clientOrderData.priceHistoryList;
    }

    let specialorderData = this.specialtourComp.getSpecialtour();

    let formData = new FormData();
    if (basicData !== false && comments !== false && specialorderData !== false) {

      const file: File = basicData['contract_file'];
      if (file) {
        formData.append("contractFiles", file, file.name);
      }

      //convert date
      if (basicData['contract_start_date']) {
        basicData['contract_start_date'] = this.commonService.convertDateforISO(basicData['contract_start_date']);
      }

      if (basicData['contract_end_date']) {
        basicData['contract_end_date'] = this.commonService.convertDateforISO(basicData['contract_end_date']);
      }

      formData.append('basicData', JSON.stringify(basicData));
      formData.append('personList', JSON.stringify(personList));
      formData.append('deleteClientPersons', JSON.stringify(deleteClientPersons));
      formData.append('comment', comments.comment);
      formData.append('orderDataList', JSON.stringify(orderDataList));
      formData.append('deleteClientOrders', JSON.stringify(deleteClientOrders));
      formData.append('specialorderData', JSON.stringify(specialorderData));
      formData.append('priceHistory', JSON.stringify(priceHistoryList));
      this.clientservice.addeditClient(formData)
        .subscribe((res: any) => {
          this.uploadedFile = res.uploadedFile;
          this.fileName = res.fileName;
          this.fileKeyName = res.fileKeyName;
          this.cd.markForCheck();
          this.overview.ngOnInit();
          this.personComp.ngOnInit();
          this.commentComp.ngOnInit();
          this.orderComp.ngOnInit();
          this.specialtourComp.ngOnInit();

          this.router.navigate([`clients`]);
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

	/**
	 * On destroy
	 */
  ngOnDestroy(): void {
    this.navBarActionService.changeActionName('');
    this.navBarSubscription.unsubscribe();
  }

  changeClientNumber(clientNumber: string) {
    this.clientNumber = clientNumber;
  }

  getNewClientId(clientId: any) {
    this.clientId = clientId;
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
