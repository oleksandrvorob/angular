// Angular
import { Injectable } from '@angular/core';
// Tranlsation
import { TranslateService } from '@ngx-translate/core';

export interface Locale {
	lang: string;
	// tslint:disable-next-line:ban-types
	data: Object;
}

@Injectable({
	providedIn: 'root'
})
export class TranslationService {
	// Private properties
	private langIds: any = [];

	/**
	 * Service Constructor
	 *
	 * @param translate: TranslateService
	 */
	constructor(private translate: TranslateService) {
		// add new langIds to the list
		var userLang = navigator.language || window.navigator['userLanguage'];

		let defaultLng = "ge";
		if(userLang && userLang!==null && userLang!==undefined && userLang!==""){
			if(userLang.includes("en")){
				defaultLng ='en';
			}else if(userLang.includes("de") || userLang.includes("ge")){
				defaultLng = 'ge';
			}
		}

		this.translate.addLangs([defaultLng]);

		// this language will be used as a fallback when a translation isn't found in the current language
		this.translate.setDefaultLang(defaultLng);

	}

	/**
	 * Load Translation
	 *
	 * @param args: Locale[]
	 */
	loadTranslations(...args: Locale[]): void {
		const locales = [...args];

		locales.forEach(locale => {
			// use setTranslation() with the third argument set to true
			// to append translations instead of replacing them
			this.translate.setTranslation(locale.lang, locale.data, true);

			this.langIds.push(locale.lang);
		});

		// add new languages to the list
		this.translate.addLangs(this.langIds);
	}

	/**
	 * Setup language
	 *
	 * @param lang: any
	 */
	setLanguage(lang) {
		if (lang) {
			this.translate.use(this.translate.getDefaultLang());
			this.translate.use(lang);
			localStorage.setItem('language', lang);
		}
	}

	/**
	 * Returns selected language
	 */
	getSelectedLanguage(): any {
		return localStorage.getItem('language') || this.translate.getDefaultLang();
	}


	public dataTableLang(  ){
        let crr_lang = this.getSelectedLanguage();

        if(crr_lang=='en'){
          return  {
              info: "_START_ to _END_ of _TOTAL_ ",
              infoEmpty: "0 to 0 of 0 ",
              processing: "Processing...",
              paginate: {
                "first":      "",
                "last":       "",
                "next":       '<i class="fa fa-chevron-right" ></i>',
                "previous":   '<i class="fa fa-chevron-left" ></i>'
            }
          };
        }
        else if(crr_lang=='de' || crr_lang=='ge'){
          return  {
              info: "_START_ bis _END_ von _TOTAL_",
              infoEmpty: "0 bis 0 von 0 ",
              processing: "Wird bearbeitet...",
              paginate: {
                "first":      "",
                "last":       "",
                "next":       '<i class="fa fa-chevron-right" ></i>',
                "previous":   '<i class="fa fa-chevron-left" ></i>'
            }
          };
        }

    }


}
