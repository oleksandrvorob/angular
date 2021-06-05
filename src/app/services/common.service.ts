import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';

import { TranslationService } from '../core/_base/layout';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(public http: HttpClient, private transServ: TranslationService, private datepipe: DatePipe) { }


  getCurrency() {
    return ['EUR', 'CHF', 'DKK', 'USD'];
  }

  getRechRhythm() {
    let crr_lang = this.transServ.getSelectedLanguage();
    if (crr_lang === 'en') {
      return ['Weekly', 'Monthly', '14 days'];
    } else if (crr_lang === 'ge') {
      return ['Wöchentlich', 'Monatlich', 'Vierzehntägig'];
    }
  }

  getZahlRhythm() {
    let crr_lang = this.transServ.getSelectedLanguage();
    if (crr_lang === 'en') {
      return ['Weekly', 'Monthly', '14 days', 'Untill 15th'];
    } else if (crr_lang === 'ge') {
      return ['Wöchentlich', 'Monatlich', 'Vierzehntägig', 'bis zum 15'];
    }
  }

  terminationTime() {
    return ['14 Tage', '30 Tage', 'Sonstige'];
  }

  public getStateList(): Observable<any> {
    return this.http.get(`${environment.apiUrl}getStateList`, {});
  }

  public addeditPerson(data): Observable<any> {
    return this.http.post(`${environment.apiUrl}addeditPerson`, data);
  }
  public getNewPersonNo(): Observable<any> {
    return this.http.get(`${environment.apiUrl}getNewPersonNo`, {});
  }

  public addeditOrder(data): Observable<any> {
    return this.http.post(`${environment.apiUrl}addeditOrder`, data);
  }
  public getNewOrderNo(): Observable<any> {
    return this.http.get(`${environment.apiUrl}getNewOrderNo`, {});
  }

  public getHistory(data): Observable<any> {
    return this.http.post(`${environment.apiUrl}getHistory`, data);
  }

  public getPriceList(data): Observable<any> {
    return this.http.get(`${ environment.apiUrl }getPriceHistory`, { params: data });
  }

  public addNewPriceHistory(data): Observable<any> {
	return this.http.post(`${environment.apiUrl}savePriceHistory`, data);
  }


  public dateRangeOption: any = {
    singleDatePicker: true,
    showDropdowns: true,
    minYear: 1901,
    maxDate: '01/01/' + (new Date().getFullYear() + 40),
    //  format:'YYYY-MM-DD',
    format: 'DD.MM.YYYY',
    autoApply: true,
    autoUpdateInput: false,
    // minDate:'10/12/2018',
    //maxDate:new Date(),
    locale: {
      //    format: 'YYYY-MM-DD',
      format: 'DD.MM.YYYY',
      applyLabel: "Sich bewerben",
      cancelLabel: "Rückkehr",
      fromLabel: 'Du',
      toLabel: 'Au',
      weekLabel: 'W',
      customRangeLabel: 'Custom Range',
      daysOfWeek: ["So", "Mo", "Di", "Do", "Fr", "Sa", "So"],
      monthNames: ["Januar ", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
      firstDay: 1
    },
    //  alwaysShowCalendars: false,
    drops: 'down',
  };

  getDate(date) {
    if (date) return new Date(date);
  }
  public minDate; public maxDate; public startDate; public endDate;
  public dateRancePickerOptions(minDate = '', maxDate = '', startDate = '', endDate = '') {
    const datePickerDayMonth: any = this.datePickerDayMonth();

    let monthNames = datePickerDayMonth.months;
    let applyLabel = datePickerDayMonth.apply;
    let cancelLabel = datePickerDayMonth.return;
    let days_of_week = datePickerDayMonth.days_of_week;

    let dateRangeOptionData = JSON.parse(JSON.stringify(this.dateRangeOption));
    dateRangeOptionData.locale.monthNames = monthNames;
    dateRangeOptionData.locale.applyLabel = applyLabel;
    dateRangeOptionData.locale.cancelLabel = cancelLabel;
    dateRangeOptionData.locale.daysOfWeek = days_of_week;

    if (minDate !== null && minDate !== undefined && minDate !== "") {
      this.minDate = this.getDate(minDate);
      dateRangeOptionData.minDate = this.minDate;
    }
    if (maxDate !== null && maxDate !== undefined && maxDate !== "") {
      this.maxDate = this.getDate(maxDate);
      dateRangeOptionData.maxDate = this.maxDate;
    }
    if (startDate !== null && startDate !== undefined && startDate !== "") {
      this.startDate = this.getDate(startDate);
      dateRangeOptionData.startDate = this.startDate;
    }
    if (endDate !== null && endDate !== undefined && endDate !== "") {
      this.endDate = this.getDate(endDate);
      dateRangeOptionData.endDate = this.endDate;
    }

    return dateRangeOptionData;
  }

  public datePickerDayMonth = () => {
    let crr_lang = this.transServ.getSelectedLanguage();

    if (crr_lang == 'en') {
      return {
        "months": [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December"
        ],
        "apply": "Apply",
        "return": "Return",
        "days_of_week": [
          "Su",
          "Mo",
          "Tu",
          "We",
          "Th",
          "Fr",
          "Sat"
        ]
      }
    }
    else if (crr_lang == 'ge') {
      return {
        "months": [
          "Januar ",
          "Februar",
          "März",
          "April",
          "Mai",
          "Juni",
          "Juli",
          "August",
          "September",
          "Oktober",
          "November",
          "Dezember"
        ],
        "apply": "Sich bewerben",
        "return": "Rückkehr",
        "days_of_week": [
          "So",
          "Mo",
          "Di",
          "Do",
          "Fr",
          "Sa",
          "So"
        ]
      }
    }
  }


  public transformDate(date, formate = "") {
    let formateType = (formate) ? formate : "yyyy-MM-dd";
    return this.datepipe.transform(date, formateType);
  }

  public paymentstopList() {
    let crr_lang = this.transServ.getSelectedLanguage();
    if (crr_lang === 'en') {
      return [{ name: "1", value: 0 }, { name: "Bankruptcy", value: 1 }];
    }
    else {
      return [{ name: "1", value: 0 }, { name: "Insolvenz", value: 1 }];
    }
  }


  public priceBasis() {
    let crr_lang = this.transServ.getSelectedLanguage();
    if (crr_lang === 'en') {
      return [
        { name: "Fixed", value: 0 },
        { name: "Per month", value: 1 },
        { name: "14 days", value: 2 },
        { name: "Per day", value: 3 },
        { name: "Per stop", value: 4 },
        { name: "Per hour", value: 5 },
        { name: "Per kilometer", value: 6 }
      ];
    } else {
      return [
        { name: "Pauschale", value: 0 },
        { name: "Pro Monat", value: 1 },
        { name: "vierzehntägig", value: 2 },
        { name: "Pro Tag", value: 3 },
        { name: "Pro Stopp", value: 4 },
        { name: "Pro Stunde", value: 5 },
        { name: "Pro Kilometer", value: 6 }
      ];
    }
  }

  public orderTypeList() {
    let crr_lang = this.transServ.getSelectedLanguage();
    if (crr_lang === 'en') {
      return [
        { name: "Day tour", value: 0 },
        { name: "Night tour", value: 1 },
        { name: "Tabelle Standard", value: 2 },
        { name: "Vehicle rental", value: 3 },
        { name: "Property leasing", value: 4 },
        { name: "Daily allowance", value: 5 },
        { name: "Consulting", value: 6 },
        { name: "Dispatcher", value: 7 },
      ];
    }
    else {
      return [
        { name: "Tagestour", value: 0 },
        { name: "Nachttour", value: 1 },
        { name: "Dienstag bis Samstags", value: 2 },
        { name: "Fzg-Vermietung", value: 3 },
        { name: "Immo-Vermietung", value: 4 },
        { name: "Tagespauschale", value: 5 },
        { name: "Beratung", value: 6 },
        { name: "Disponent", value: 7 },
      ];
    }
  }

  public specialOrderTypeList() {
    let crr_lang = this.transServ.getSelectedLanguage();
    if (crr_lang === 'en') {
      return [
        { name: "Credit item", value: 0 },
        { name: "Correction of invoice", value: 1 }
      ];
    }
    else {
      return [
        { name: "Gutschrift", value: 0 },
        { name: "Rechnungskorrektur", value: 1 }
      ];
    }
  }

  public vehicleSizeList() {
    let crr_lang = this.transServ.getSelectedLanguage();
    if (crr_lang === 'en') {
      return [
        { name: 'S', value: 0 },
        { name: 'M', value: 1 },
        { name: 'L', value: 2 }
      ];
    } else {
      return [
        { name: 'S', value: 0 },
        { name: 'M', value: 1 },
        { name: 'L', value: 2 }
      ];
    }
  }

  public personTypeList() {
    let crr_lang = this.transServ.getSelectedLanguage();
    if (crr_lang == 'en') {
      return [{ name: "Client", value: "0" }, { name: "Partner", value: "1" }];
    }
    else {
      return [{ name: "Kunde", value: "0"}, { name: "Partner", value: "1" }];
    }
  }

  public salutationList() {
    let crr_lang = this.transServ.getSelectedLanguage();
    if (crr_lang == 'ge') {
      return [{ name: "Herr.", value: "Mr." }, { name: "Frau.", value: "Mrs." }, { name: "Dr.", value: "Dr." }, { name: "Andere", value: "Other" }];
    }
    else {
      return [{ name: "Mr.", value: "Mr." }, { name: "Mrs.", value: "Mrs." }, { name: "Dr.", value: "Dr." }, { name: "Other", value: "Other" }];
    }
  }

  public getCityName(zipCode): Observable<any> {
	let cors_api_host = 'https://cors-anywhere.herokuapp.com/';
    let url = cors_api_host + 'https://zip.getziptastic.com/v2/DE/' + zipCode;
    return this.http.get(url);
  }

  public weekDays() {
    let crr_lang = this.transServ.getSelectedLanguage();
    if (crr_lang == 'en') {
      return [{ name: "Mon", value: 0 }, { name: "Tue", value: 1 }, { name: "Wen", value: 2 }, { name: "Thu", value: 3 }, { name: "Fri", value: 4 }, { name: "Sat", value: 5 }, { name: "Sun", value: 6 }];
    }
    else {
      return [{ name: "Mo", value: 0 }, { name: "Di", value: 1 }, { name: "Mi", value: 2 }, { name: "Do", value: 3 }, { name: "Fr", value: 4 }, { name: "Sa", value: 5 }, { name: "So", value: 6 }];
    }
  }

  public validateIBAN(iban): Observable<any> {
	let cors_api_host = 'https://cors-anywhere.herokuapp.com/';
    let url = cors_api_host + 'https://openiban.com/validate/' + iban + '?getBIC=true';
    return this.http.get(url);
  }

  public paddingZero(number: string, places: number){
		if (!number)
			number = '0';
		return String(number).padStart(places, '0');
  }

  convertDateforISO(date: string){
    let temp_date_array = date.split('.');
    return temp_date_array[2] + '-' + temp_date_array[1] + '-' + temp_date_array[0];
  }

  convertDateforCustomFormat(date: string){
    let temp_date_array = date.slice(0, 10).split('-');
    return temp_date_array[2] + '.' + temp_date_array[1] + '.' + temp_date_array[0];
  }
}
