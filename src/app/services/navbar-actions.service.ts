import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const registerdRoutes = [
  '/clients/addedit',
  '/contractors/addedit',
  '/article/addedit',
  '/persons/addedit',
  '/orders/addedit',
  '/companies/addedit'
];

@Injectable({
  providedIn: 'root'
})
export class NavbarActionsService {
  private actionSource = new BehaviorSubject<string>('');
  action = this.actionSource.asObservable()

  private disabledSaveSource = new BehaviorSubject<boolean>(true);
  disabledSave = this.disabledSaveSource.asObservable();

  private disabledCancelSource = new BehaviorSubject<boolean>(true);
  disabledCancel = this.disabledCancelSource.asObservable();

  private currentUrlSource = new BehaviorSubject<string>('');
  currentUrl = this.currentUrlSource.asObservable();

  constructor() { }

  changeActionName(actionName: string) {
    this.actionSource.next(actionName);
  }

  changeDisabledSaveStatus(newStatus: boolean) {
    this.disabledSaveSource.next(newStatus);
  }

  changeDisabledCancelStatus(newStatus: boolean) {
    this.disabledCancelSource.next(newStatus);
  }

  changeCurrentUrl(newUrl: string) {
    this.currentUrlSource.next(newUrl);
    const isRegisteredRoute = !!registerdRoutes.find(route => newUrl.indexOf(route) >= 0);
    this.disabledCancelSource.next(!isRegisteredRoute);
    if(!isRegisteredRoute) this.disabledSaveSource.next(true);
  }
}
