import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { LogMonitorService } from './log-monitor.service';
import { SessionStorageService } from './session-storage.service';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  private logMonitorService: LogMonitorService;

  constructor(private logger: NGXLogger, private storageService: SessionStorageService) {
    this.logMonitorService = new LogMonitorService(storageService);
    this.logger.registerMonitor(this.logMonitorService);
  }

  trace(moduleName, message) {
    this.logger.trace(moduleName, message);
  }

  debug(moduleName, message) {
    this.logger.debug(moduleName, message);
  }

  info(moduleName, message) {
    this.logger.info(moduleName, message);
  }

  log(moduleName, message) {
    this.logger.log(moduleName, message);
  }

  warn(moduleName, message) {
    this.logger.warn(moduleName, message);
  }

  error(moduleName, message) {
    this.logger.error(moduleName, message);
  }

  fatal(moduleName, message) {
    this.logger.fatal(moduleName, message);
  }

  downloadLog() {
    const logStatements = this.logMonitorService.getAllLogs();
    const zip = new JSZip();
    zip.file('app-logs.txt', logStatements);

    zip.generateAsync({ type: 'blob' })
      .then(function (content) {
        saveAs(content, 'salesforce-logs.zip');
      });
  }
}
