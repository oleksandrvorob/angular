import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import {from} from 'rxjs';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class WebpackTranslateLoader implements TranslateLoader {
  constructor(@Inject(PLATFORM_ID) private platformId: object) {}
  getTranslation(lang: string): Observable<any> {
    return isPlatformBrowser(this.platformId) ? from(System.import(`../../assets/i18n/${lang}.json`))
      : of('../../assets/i18n/en.json');
  }
}
