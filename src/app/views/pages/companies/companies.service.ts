import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {

  private _url: string = "/assets/mock-data/history_data.json";
  constructor(public http: HttpClient) { }

  public addeditCompanies(data): Observable<any> {
    return this.http.post(`${environment.apiUrl}addeditCompany`, data);
  }

  public getCompaniessList(data): Observable<any> {
    return this.http.post(`${environment.apiUrl}companiesList`, data);
  }

  public getCompaniesDetails(data: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}getCompanyDetails`, { params: data });
  }

  public deleteCompany(data: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}deleteCompany`, { params: data });
  }

  public getNewCompanyNo(): Observable<any> {
    return this.http.get(`${environment.apiUrl}getNewCompanyNo`, {});
  }

  public getAllCodes(): Observable<any> {
    return this.http.post(`${environment.apiUrl}companiesList`, {
      global: false,
      columns: [
        {
          name: 'code'
        },
        {
          name: 'companyId'
        },

      ],
      status: 1
    });
  }

  public getAllBanksByCompanyId(companyId, data): Observable<any> {
	return this.http.post(`${environment.apiUrl}companyBanks`, {...data, companyId});
  }

}
