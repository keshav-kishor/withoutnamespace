import { Injectable } from '@angular/core';
import { NGXLoggerMonitor, NGXLogInterface, NgxLoggerLevel } from 'ngx-logger';
import { StorageService } from './storage.service';
import { DatastoreKeys } from '../enums/data-store-keys';

@Injectable({
  providedIn: 'root'
})
export class LogMonitorService implements NGXLoggerMonitor {

  constructor(private storageServiceSvc: StorageService) {
  }

  onLog(log: NGXLogInterface) {
    let logStatements = this.storageServiceSvc.get(DatastoreKeys.AppLogs);
    logStatements = logStatements ? logStatements : '';
    // store in session storage
    logStatements += this.getFormattedMessage(log);
    this.storageServiceSvc.set(DatastoreKeys.AppLogs, logStatements);
  }

  getFormattedMessage(log: NGXLogInterface): String {
    return log.timestamp + ' ' + NgxLoggerLevel[log.level] + ' [' + log.message + '] ' + log.additional + '\n';
  }

  getAllLogs() {
    return this.storageServiceSvc.get(DatastoreKeys.AppLogs);
  }
}
