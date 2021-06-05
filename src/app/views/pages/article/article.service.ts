import { Injectable } from '@angular/core';

import {HttpClient} from '@angular/common/http';
import {environment} from './../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(public http: HttpClient) {}

  public addeditArticle(data): Observable<any> {
		return this.http.post(`${environment.apiUrl}addeditArticle`, data);
  }


  public getArticleList(data): Observable<any> {
		return this.http.post(`${environment.apiUrl}ArticleList`, data);
  }

  public getAllArticle(data : any = {}): Observable<any> {
		return this.http.get(`${environment.apiUrl}getArticleList`, data);
  }

  public getArticleDetails(data : any ): Observable<any> {
		return this.http.get(`${environment.apiUrl}getArticleDetails`, {params:data});
  }

  public deleteArticle(data : any ): Observable<any> {
		return this.http.delete(`${environment.apiUrl}deleteArticle`, {params:data});
  }

  public getNewArticleNo( ): Observable<any> {
		return this.http.get(`${environment.apiUrl}getNewArticleNo`, {});
  }

}
