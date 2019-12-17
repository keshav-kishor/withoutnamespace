import { Component } from '@angular/core';
import { LocalizationService } from 'common-lib';
import { ApexParams } from '../common/apex-params';

@Component({
  selector: 'auth-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'auth-app';

  constructor(private localizationSvc: LocalizationService) {
    const initParam = ApexParams.init();
    this.localizationSvc.setLanguage(initParam.langCode);
  }
}
