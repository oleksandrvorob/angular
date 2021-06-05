import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class PaymentRunService {

	constructor(public http: HttpClient) {}

	public getAllContractors(data): Observable<any> {
		return this.http.get(`${environment.apiUrl}payments/contractors`, data);
	}

	public getContractorInvoices(contractorId, data): Observable<any> {
		return this.http.post(`${environment.apiUrl}contractorInvoices`, {...data, contractorId});
	  }
}
