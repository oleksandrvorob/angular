import { Injectable } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {LanguageService} from './lang.service';

@Injectable({
  providedIn: 'root'
})
export class HelpersService {

  constructor(private translate: TranslateService,
              private languageService: LanguageService) { }
  i18n(value, func) {
    let str;
    this.translate.get(value).subscribe((res: string) => {
      this.translate.get(func, {value: res}).subscribe((val) => {
        str = val;
      });
    });
    return str;
  }
  i18nVal(value) {
    let str;
    this.translate.get(value).subscribe((res: string) => {
      str = res;
    });
    return str;
  }
  i18nSetProp(obj, prop = '') {
    let lang;
    this.languageService.dataSource.subscribe(data => {
      lang = obj[prop + data];
    });
    return lang;
  }
}
