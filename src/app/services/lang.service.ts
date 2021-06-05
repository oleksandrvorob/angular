import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  lang = 'en';
  dataSource = new BehaviorSubject(this.lang);
  data = this.dataSource.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    const lang = isPlatformBrowser(this.platformId) ? localStorage.getItem('lang') : 'en';
    if (lang || isPlatformBrowser(this.platformId)) {
      this.updatedDataSelection(lang);
    }
  }
  updatedDataSelection(data: string) {
    document.getElementsByTagName('html')[0].setAttribute('lang', data);
    this.dataSource.next(data);
  }
}
