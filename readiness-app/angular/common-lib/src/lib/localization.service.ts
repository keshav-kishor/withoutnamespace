import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalizationService {
  supportedLangs = ['de', 'en_US', 'es', 'fr', 'it', 'ja', 'ko', 'pt_BR', 'ru', 'zh_CN'];

  constructor(private translate: TranslateService) {
    // list of supported languages
    translate.addLangs(this.supportedLangs);
    // set fallback language
    translate.setDefaultLang('en_US');
  }

  setLanguage(langCode: string) {
    this.translate.use(langCode);
  }

  // Returns the localized value for the key if single key is passed
  // Returns the key value pair of localization key and its translated value if multiple localization keys are passed
  getLocalizedValue(localizationKey: string | Array<string>): Observable<string | any> {
    return this.translate.get(localizationKey);
  }
}
