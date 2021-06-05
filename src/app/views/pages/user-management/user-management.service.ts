import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  private _url: string = "/assets/mock-data/history_data.json";
  private token: string;
  private headers: any;
  constructor(public http: HttpClient) {
    this.token = localStorage.getItem('logistic_login_access_token');
    let headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token
    };
    this.headers = Object.assign({}, headers);
  }

  public getAllUsers(data): Observable<any> {
    return this.http.post(`${environment.apiUrl}usersList`,  data);
  }

  public addNewUser(data): Observable<any> {
    return this.http.post(`${environment.apiUrl}users`, data);
  }

  public deleteUser(data: any): Observable<any> {
    return this.http.delete(`${environment.apiUrl}users/` + data.userId);
  }

  public getNewUserNo( ): Observable<any> {
	return this.http.get(`${environment.apiUrl}getNewUserId`, {});
  }

  public getUserDetails(data: any): Observable<any> {
	return this.http.get(`${environment.apiUrl}users/` + data.userId);
  }

  public updateUser(userId, data: any): Observable<any> {
	return this.http.patch(`${environment.apiUrl}users/` + userId, data);
  }
}
