import { TestBed, async } from '@angular/core/testing';
import { NGXLogger, NGXLoggerHttpService, LoggerConfig } from 'ngx-logger';
import { HttpClient, HttpHandler } from '@angular/common/http';

import { AccessTokenService } from './access-token.service';
import { AuthToken } from '../model/auth-token.model';
import { LocalStorageService } from './local-storage.service';
import { DatastoreKeys } from '../enums/data-store-keys';

describe('AccessTokenService', () => {
  let localStorageSvc: LocalStorageService;
  let service: AccessTokenService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NGXLogger, NGXLoggerHttpService, HttpClient, HttpHandler, LoggerConfig]
    });
    localStorageSvc = TestBed.get(LocalStorageService);
    service = TestBed.get(AccessTokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('set access token for UserHub', async(() => {
    const data = {
      accessToken: 'access-token-from-unit-testing',
      refreshToken: 'refresh-token-from-unit-testing',
      accessTokenExpiry: '3600',
      refresh_token_server_uri: 'refresh-token-from-unit-testing-url'
    };
    const expected = new AuthToken();
    expected.parseData(data);
    service.setAccessToken(expected);
    const res = service.isTokenExpired();
    expect(res).toBeDefined();
  }));

  it('sets and get access token object', async(() => {
    const data = {
      access_token: 'access-token-from-unit-testing',
      refresh_token: 'refresh-token-from-unit-testing',
      expires_in: '3600',
      refresh_token_server_uri: 'refresh-token-from-unit-testing-url'
    };
    const expected = new AuthToken();
    expected.parseData(data);

    service.setAccessToken(expected);
    const actual: AuthToken = service.getAccessToken();
    expect(actual.accessToken).toEqual(expected.accessToken);
  }));

  it('check token is expired or not', async(() => {
    const data = {
      access_token: 'access-token-from-unit-testing',
      refresh_token: 'refresh-token-from-unit-testing',
      expires_in: '3600',
      refresh_token_server_uri: 'refresh-token-from-unit-testing-url'
    };
    const expected = new AuthToken();
    expected.parseData(data);
    service.setAccessToken(expected);
    const res = service.isTokenExpired();
    expect(res).toBeDefined();
  }));

  it('check auth token is stored or not', async(() => {
    localStorageSvc.remove(DatastoreKeys.AuthToken);
    const res = service.isTokenExpired();
    expect(res).toBeDefined();
  }));
});
