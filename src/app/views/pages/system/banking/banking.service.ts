import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class BankingService {

	constructor(public http: HttpClient) {}

	public addNewBank(data): Observable<any> {
		return this.http.post(`${environment.apiUrl}banks`, data);
	}
	public getAllBanks(data): Observable<any> {
		return this.http.post(`${environment.apiUrl}banksList`, data);
	}
	public editBank(bankId, data): Observable<any> {
		return this.http.patch(`${environment.apiUrl}banks/` + bankId, data);
	}
	public deleteBank(bankId): Observable<any> {
		return this.http.delete(`${environment.apiUrl}banks/` + bankId);
	}
	public getBankById(bankId): Observable<any> {
		return this.http.get(`${environment.apiUrl}banks/` + bankId);
	}

	public getNewBankNo( ): Observable<any> {
		return this.http.get(`${environment.apiUrl}getNewBankId`, {});
	  }
}
