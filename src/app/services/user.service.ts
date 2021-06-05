import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class UserService {
	constructor(public http: HttpClient) {}

	public getAllClients(): Observable<any> {
		return this.http.get(`${environment.apiUrl}clients`);
	}

	public deleteClient(id): Observable<any> {
		return this.http.delete(`${environment.apiUrl}clients/${id}`);
	}

	public getContactPersonByUserId(id): Observable<any> {
		return this.http.get(`${environment.apiUrl}contact-person?clientId=${id}`);
	}

	public getContactPersonByContactPersonId(id): Observable<any> {
		return this.http.get(`${environment.apiUrl}contact-person?contactPersonId=${id}`);
	}

	public editContactPerson(id, data, userId): Observable<any> {
		return this.http.put(`${environment.apiUrl}contact-person/${id}`, {
			clientId: userId,
			...data
		});
	}

	public createContactPerson(id, data): Observable<any> {
		return this.http.post(`${environment.apiUrl}contact-person`,
			{
				clientId: id,
				...data
			});
	}

	public deleteContactPerson(id): Observable<any> {
		return this.http.delete(`${environment.apiUrl}contact-person/${id}`);
	}

	public getUser(id): Observable<any> {
		return this.http.get(`${environment.apiUrl}clients?clientId=${id}`);
	}

	public editUser(id, data): Observable<any> {
		return this.http.put(`${environment.apiUrl}clients/${id}`, data);
	}

	public createUser(data): Observable<any> {
		return this.http.post(`${environment.apiUrl}clients`, data);
	}

	public getRoutes(id): Observable<any> {
		return this.http.get(`${environment.apiUrl}client-routes?clientId=${id}`);
	}


	public deleteRoute(id): Observable<any> {
		return this.http.delete(`${environment.apiUrl}client-routes/${id}`);
	}

	public addRoute(form): Observable<any> {
		return this.http.post(`${environment.apiUrl}client-routes`, form);
	}

	public getRoute(id): Observable<any> {
		return this.http.get(`${environment.apiUrl}client-routes?clientRouteId=${id}`);
	}

	public editRoute(id, form): Observable<any> {
		return this.http.put(`${environment.apiUrl}client-routes/${id}`, form);
	}
}
