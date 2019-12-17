import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { DatastoreKeys } from '../enums/data-store-keys';
import { AuthToken } from '../model/auth-token.model';
import { ValidationUtilsService } from './../utils/validation-utils.service';

@Injectable({
  providedIn: 'root'
})
export class AccessTokenService {

  constructor(private storageSvc: LocalStorageService, private validationUtilSvc: ValidationUtilsService) {
  }

  getAccessToken(): AuthToken {
    const authToken: string = this.storageSvc.get(DatastoreKeys.AuthToken);
    return JSON.parse(authToken);
  }

  setAccessToken(authToken: AuthToken) {
    return this.storageSvc.set(DatastoreKeys.AuthToken, JSON.stringify(authToken));
  }

  isTokenExpired() {
    const authToken = this.getAccessToken();
    if (this.validationUtilSvc.isNotNullOrEmpty(authToken)) {
      // If the token is going to expire in another 2 mins then also we need to refresh token
      return ((new Date().getTime() - authToken.accessTokenTime) / 1000) >= (authToken.expiresIn - (2 * 60));
    }
    return true;
  }
}
