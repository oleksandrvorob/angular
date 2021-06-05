import { Injectable } from '@angular/core';


import {HttpClient} from '@angular/common/http';
import {environment} from './../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountBooksService {

  constructor(public http: HttpClient) {}

  public addeditOrder(data): Observable<any> {    
		return this.http.post(`${environment.apiUrl}addeditOrder`, data);
  }
  

  public getOrderList(data): Observable<any> {
		return this.http.post(`${environment.apiUrl}orderList`, data);
  }

    
  public getOrderDetails(data : any ): Observable<any> {
		return this.http.get(`${environment.apiUrl}getOrderDetails`, {params:data});
  }
  
  public deleteOrder(data : any ): Observable<any> {
		return this.http.get(`${environment.apiUrl}deleteOrder`, {params:data});
  }

  public getNewOrderNo( ): Observable<any> {
		return this.http.get(`${environment.apiUrl}getNewOrderNo`, {});
  }

}
