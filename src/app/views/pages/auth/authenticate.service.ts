import { Injectable } from '@angular/core';

import {HttpClient} from '@angular/common/http';
import {environment} from './../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  constructor(public http: HttpClient) { }

  login(params:any): Observable<any> {
    return this.http.post(`${environment.apiUrl}login`, params);
  }

}
