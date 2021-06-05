import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from './../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContractorsService {

  private _url: string = "/assets/mock-data/history_data.json";

  constructor(public http: HttpClient) { }

  public addeditContractor(data): Observable<any> {
    return this.http.post(`${environment.apiUrl}addeditContractor`, data);
  }

  public getContractorsList(data): Observable<any> {
    return this.http.post(`${environment.apiUrl}contractorsList`, data);
  }

  public getContractorDetails(data: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}getContractorDetails`, { params: data });
  }

  public deleteContractor(data: any): Observable<any> {
    return this.http.delete(`${environment.apiUrl}deleteContractor`, { params: data });
  }

  public getNewContractorNo(): Observable<any> {
    return this.http.get(`${environment.apiUrl}getNewContractorNo`, {});
  }

  public getPersonList(data): Observable<any> {
    return this.http.post(`${environment.apiUrl}contractorPersonList`, data);
  }

  public deleteContractorPerson(data): Observable<any> {
    return this.http.post(`${environment.apiUrl}deleteContractorPerson`, data);
  }

  public getOrderList(data): Observable<any> {
    return this.http.post(`${environment.apiUrl}contractorOrderList`, data);
  }

  public deleteContractorOrder(data): Observable<any> {
    return this.http.post(`${environment.apiUrl}deleteContractorOrder`, data);
  }
}
