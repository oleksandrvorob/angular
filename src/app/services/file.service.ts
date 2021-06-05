import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from './../../environments/environment';
import { saveAs } from 'file-saver';

export const saveFile = (blobContent: Blob, fileName: string) => {
	const blob = new Blob([blobContent], { type: 'application/pdf'});
	saveAs(blob, fileName);
};

@Injectable({
  providedIn: 'root'
})
export class FileService {

  	constructor(public http: HttpClient) { }

	public downloadFile(fileKeyName: string, fileName: string){
		let headers = new HttpHeaders();
		headers = headers.set('Accept', 'application/pdf');
		this.http.get(`${environment.apiUrl}download/` + fileKeyName,
		{
			headers: headers,
			responseType: 'blob'
		}).subscribe((data) => {
			saveFile(data, fileName);
		},
		(error: any) => {
			console.log("error: ", error);
		});
	}
}
