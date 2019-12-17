import { TestBed } from '@angular/core/testing';
import { NGXLogger, NGXLoggerHttpService, LoggerConfig } from 'ngx-logger';
import { HttpClient, HttpHandler } from '@angular/common/http';

import { SessionStorageService } from './session-storage.service';
import { DatastoreKeys } from '../enums/data-store-keys';
import { AuthToken } from '../model/auth-token.model';

describe('SessionStorageService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [NGXLogger, NGXLoggerHttpService, HttpClient, HttpHandler, LoggerConfig]
  }));

  it('should be created', () => {
    const service: SessionStorageService = TestBed.get(SessionStorageService);
    expect(service).toBeTruthy();
  });

  it('gets non exist value as null', () => {
    const expected = null;
    const service: SessionStorageService = TestBed.get(SessionStorageService);
    service.remove(DatastoreKeys.AuthToken);
    const actual: String = service.get(DatastoreKeys.AuthToken);
    expect(actual).toEqual(expected);
  });

  it('sets a valid value', () => {
    const expected = new AuthToken();
    const service: SessionStorageService = TestBed.get(SessionStorageService);
    service.set(DatastoreKeys.AuthToken, JSON.stringify(expected));
    const actual: String = service.get(DatastoreKeys.AuthToken);
    expect(actual).toEqual(JSON.stringify(expected));
  });
});
