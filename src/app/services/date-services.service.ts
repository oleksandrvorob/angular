import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DateServicesService {

  constructor(private datePipe: DatePipe) {}

  transformDate(date , formate = 'yyyy-MM-dd') {

    return this.datePipe.transform(date, formate );

  }

}
