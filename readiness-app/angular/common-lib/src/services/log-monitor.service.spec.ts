import { TestBed, inject } from '@angular/core/testing';
import { NGXLogInterface, NgxLoggerLevel } from 'ngx-logger';

import { LogMonitorService } from './log-monitor.service';
import { SessionStorageService } from './session-storage.service';
import { StorageService } from './storage.service';
import { DatastoreKeys } from '../enums/data-store-keys';

describe('LogMonitorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: StorageService, useClass: SessionStorageService }]
    });
  });

  it('should be created', () => {
    const service: LogMonitorService = TestBed.get(LogMonitorService);
    expect(service).toBeTruthy();
  });

  it('should be able to write logs to sessionstorage', () => {
    const monitorService = TestBed.get(LogMonitorService);
    const storageService = TestBed.get(SessionStorageService);

    storageService.remove(DatastoreKeys.AppLogs);
    const logEntry = new NGXLogInterface();
    logEntry.timestamp = '2019-03-01 10:15:48.256';
    logEntry.level = NgxLoggerLevel.DEBUG;
    logEntry.message = 'LogMonitorService';
    logEntry.additional = ['test'];
    monitorService.onLog(logEntry);
    expect(monitorService.getAllLogs().trim()).toBe('2019-03-01 10:15:48.256 DEBUG [LogMonitorService] test');
  });

  it('should be able to get all the logs from the storage', () => {
    const logs = '2019-03-01 10:15:48.256 DEBUG [LogMonitorService] test';
    const storageService = TestBed.get(SessionStorageService);
    storageService.set(DatastoreKeys.AppLogs, logs);
    const monitorService = TestBed.get(LogMonitorService);
    expect(monitorService.getAllLogs()).toBe(logs);
  });

  it('should be able append with the existing logs', () => {
    const log1 = '2019-03-01 10:15:48.256 DEBUG [LogMonitorService] test';
    const log2 = '2019-03-01 10:15:48.257 DEBUG [LogMonitorService] test';
    const storageSvc = TestBed.get(SessionStorageService);
    const logMonitorSvc = TestBed.get(LogMonitorService);

    storageSvc.remove(DatastoreKeys.AppLogs);
    storageSvc.set(DatastoreKeys.AppLogs, log1);

    const logEntry = new NGXLogInterface();
    logEntry.timestamp = '2019-03-01 10:15:48.257';
    logEntry.level = NgxLoggerLevel.DEBUG;
    logEntry.message = 'LogMonitorService';
    logEntry.additional = ['test'];
    logMonitorSvc.onLog(logEntry);
    expect(logMonitorSvc.getAllLogs().trim()).toBe(log1 + log2);
  });

});
