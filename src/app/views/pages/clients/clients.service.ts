import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  private _url: string = "/assets/mock-data/history_data.json";
  private _invoicesUrl: string = "/assets/mock-data/invoices_list.json";
  private _invoiceItemsUrl: string = "/assets/mock-data/invoice_items_list.json";

  constructor(public http: HttpClient) { }

  public addeditClient(data): Observable<any> {
    return this.http.post(`${environment.apiUrl}addeditClient`, data);
  }

  public getClientsList(data): Observable<any> {
    return this.http.post(`${environment.apiUrl}clientsList`, data);
  }

  public getClientDetails(data: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}getClientDetails`, { params: data });
  }

  public deleteClient(data: any): Observable<any> {
    return this.http.delete(`${environment.apiUrl}deleteClient`, { params: data });
  }

  public getNewClientNo(): Observable<any> {
    return this.http.get(`${environment.apiUrl}getNewClientNo`, {});
  }

  public getPersonList(data): Observable<any> {
    return this.http.post(`${environment.apiUrl}clientPersonList`, data);
  }

  public deleteClientPerson(data): Observable<any> {
    return this.http.post(`${environment.apiUrl}deleteClientPerson`, data);
  }

  public getOrderList(data): Observable<any> {
    return this.http.post(`${environment.apiUrl}clientOrderList`, data);
  }

  public deleteClientOrder(data): Observable<any> {
    return this.http.post(`${environment.apiUrl}deleteClientOrder`, data);
  }

  public getInvoicesList(data): Observable<any> {
	return this.http.post(`${environment.apiUrl}invoices`, data);
  }

  public getClientInvoices(clientId, data): Observable<any> {
	return this.http.post(`${environment.apiUrl}clientInvoices`, {...data, clientId: clientId});
  }

  public getInvoiceItemsList(invoiceId, data): Observable<any> {
	return this.http.post(`${environment.apiUrl}invoiceItems`, {...data, invoiceId: invoiceId});
  }
}
