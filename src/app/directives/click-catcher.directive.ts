import { Directive, HostListener, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[ktClickCatcher]',
  exportAs: 'tbDropdown',
})
export class ClickCatcherDirective {

  isShowTbDropDown: boolean;
  isShowPersonDropdownTable: boolean;
  isShowBankDropdownTable: boolean;

  targetId: string;

  constructor(private el: ElementRef) {
    this.isShowTbDropDown = false;
    this.isShowPersonDropdownTable = false;
    this.isShowBankDropdownTable = false;
    this.targetId = "";
  }


  @HostListener('click', ['$event'])
  onClick(evt: any) {
    if (evt.target.id === "contractor" ||
      evt.target.id === "customer" ||
      evt.target.id === "alternative_invoice_recipient_name" ||
      evt.target.id === "bank1_name" ||
      evt.target.id === "bank2_name") {
      this.isShowTbDropDown = true;
      this.targetId = evt.target.id;
    }
    else if (evt.target.id === "person_first_name") {
      this.isShowPersonDropdownTable = true;
    }
    else if (evt.target.id === "client_bank" || evt.target.id === "contractor_bank" || evt.target.id === "bank_name") {
      this.isShowBankDropdownTable = true;
    } else {
      this.isShowTbDropDown = false;
      this.isShowBankDropdownTable = false;
      this.isShowPersonDropdownTable = false;
    }
  }
}
