import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from './../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenPositionsService {

  private _url: string = "/assets/mock-data/open_position.json";

  constructor(public http: HttpClient) {}

  public getopenpositionList(data): Observable<any> {
    return this.http.post(`${environment.apiUrl}getOpenPositionList`, data);
  }
}
