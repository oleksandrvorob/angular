import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapsService {

	private _clientsUrl: string = "/assets/mock-data/clients_locations.json";
	private _contractorsUrl: string = "/assets/mock-data/contractors_locations.json";

	constructor(public http: HttpClient) { }

	public getClientsList(data): Observable<any> {
		// return this.http.get(this._clientsUrl, { params: data });
		return this.http.post(`${environment.apiUrl}clientsList`, data);
	}

	public getContractorsList(data): Observable<any> {
		// return this.http.get(this._contractorsUrl, { params: data });
		return this.http.post(`${environment.apiUrl}contractorsList`, data);
	}

	public getLocationInfo(street: string, postalCode: any, city: string): Observable<any> {
		let cors_api_host = 'https://cors-anywhere.herokuapp.com/';
    	let url = cors_api_host + 'https://geocode.xyz/' + street + ',' + '+' + postalCode + '+' + city + '?json=1';
    	return this.http.get(url);
		// 'https://geocode.xyz/Hauptstr.,+57632+Berzhausen?json=1'
	}
}
