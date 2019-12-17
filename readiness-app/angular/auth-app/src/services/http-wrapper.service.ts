import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AccessTokenService } from 'common-lib';

@Injectable({
  providedIn: 'root'
})
export class HttpWrapperService {

  static JsonContent = 'application/json; charset=UTF-8';

  constructor(private httpClient: HttpClient, private accessTokenSvc: AccessTokenService) {
  }

  private getHeaders(): HttpHeaders {
    const authToken = this.accessTokenSvc.getAccessToken();
    return new HttpHeaders({
      'Content-Type': HttpWrapperService.JsonContent,
      'Authorization': 'bearer ' + authToken.accessToken
    });
  }

  get(url: string, httpHeaders?: HttpHeaders) {
    return this.httpClient.get(url, { headers: httpHeaders ? httpHeaders : this.getHeaders() });
  }

  getText(url: string) {
    return this.httpClient.get(url, { responseType: 'text' });
  }

  post(url: string, body: any, httpHeaders?: HttpHeaders, withCredentials?: boolean) {
    return this.httpClient.post(url, body, { headers: httpHeaders ? httpHeaders : this.getHeaders(), withCredentials: withCredentials });
  }

  put(url: string, body: any, httpHeaders?: HttpHeaders) {
    return this.httpClient.put(url, body, { headers: httpHeaders ? httpHeaders : this.getHeaders() });
  }

  delete(url: string, httpHeaders?: HttpHeaders) {
    return this.httpClient.delete(url, { headers: httpHeaders ? httpHeaders : this.getHeaders() });
  }

  deleteWithBody(url: string, body: any, httpHeaders?: HttpHeaders) {
    return this.httpClient.request('delete', url, { headers: httpHeaders ? httpHeaders : this.getHeaders(), body: body } );
  }

}
