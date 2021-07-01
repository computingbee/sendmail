import { Injectable } from '@angular/core';

import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Email } from '../models/email';

import { environment } from '../../environments/environment';
import { $ } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http: HttpClient) { }

  relaymailservice(): Observable<any> {
   return this.http.get<any>(environment.apiEmailRelayServiceHost);
  }

  uploaddownloadfileservice(): Observable<any> {
    return this.http.get<any>(environment.apiUpDownloadFileServiceHost);
   }

  history(params: any): Observable<any> {

    //return this.http.get<any>("http://10.0.2.5:8084/api/relaymail/history", { params });
    return this.http.get<any>(environment.apiEmailRelayServiceHost + "/history", { params });

  }

  relay(message: Email) {

    //return this.http.post<Email>("http://10.0.2.5:8084/api/relaymail/relay", message, {
      return this.http.post<Email>(environment.apiEmailRelayServiceHost + "/relay", message, {
      reportProgress: true,
      responseType: 'json'
    });
  }

  upload(file: File): Observable<HttpEvent<any>> {

    const formData: FormData = new FormData();

    formData.append('file', file);
    //const req = new HttpRequest('POST', 'http://10.0.2.5:8082/upload', formData, {
      const req = new HttpRequest('POST', environment.apiUpDownloadFileServiceHost + "/upload", formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }
}
