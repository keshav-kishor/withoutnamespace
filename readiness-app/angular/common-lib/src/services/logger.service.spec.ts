import { TestBed, inject } from '@angular/core/testing';
import { LoggerModule, NGXLogger, NGXLoggerHttpService, LoggerConfig, NGXLogInterface, NgxLoggerLevel } from 'ngx-logger';
import { HttpClient, HttpHandler } from '@angular/common/http';

import { SessionStorageService } from './session-storage.service';
import { LoggerService } from './logger.service';
import { DatastoreKeys } from '../enums/data-store-keys';

describe('LoggerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoggerModule.forRoot({ level: NgxLoggerLevel.TRACE })],
      providers: [NGXLogger, NGXLoggerHttpService, HttpClient, HttpHandler, LoggerConfig]
    });
  });

  it('should be created', () => {
    const service: LoggerService = TestBed.get(LoggerService);
    expect(service).toBeTruthy();
  });

  it('should be able to write trace/debug/info/log/warn/error/fatal logs to NGXLogger', () => {
    const loggerService = TestBed.get(LoggerService);
    const ngxLogger = TestBed.get(NGXLogger);
    const fileName = 'logger.service.spec.tc';

    ['trace', 'debug', 'info', 'log', 'warn', 'error', 'fatal'].forEach(logMode => {
      spyOn(ngxLogger, logMode);
      loggerService[logMode](fileName, logMode);
      expect(ngxLogger[logMode]).toHaveBeenCalledWith(fileName, logMode);
    });
  });

  it('should be able to download the logs', () => {
    const loggerService = TestBed.get(LoggerService);
    const storageService = TestBed.get(SessionStorageService);

    spyOn(storageService, 'get');
    loggerService.downloadLog();
    expect(storageService.get).toHaveBeenCalledWith(DatastoreKeys.AppLogs);
  });
});
