// Angular
import { Component, HostBinding, OnInit, Input } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
// RxJS
import { filter } from 'rxjs/operators';
// Translate
import { TranslationService } from '../../../../../core/_base/layout';

interface LanguageFlag {
	lang: string;
	name: string;
	flag: string;
	active?: boolean;
}

@Component({
	selector: 'kt-language-selector',
	templateUrl: './language-selector.component.html',
})
export class LanguageSelectorComponent implements OnInit {
	// Public properties
	@HostBinding('class') classes = '';
	@Input() iconType: '' | 'brand';

	language: LanguageFlag;
	languages: LanguageFlag[] = [
		{
			lang: 'en',
			name: 'English',
			flag: './assets/media/flags/012-uk.svg'
		},
		// {
		// 	lang: 'ch',
		// 	name: 'Mandarin',
		// 	flag: './assets/media/flags/015-china.svg'
		// },
		// {
		// 	lang: 'es',
		// 	name: 'Spanish',
		// 	flag: './assets/media/flags/016-spain.svg'
		// },
		// {
		// 	lang: 'jp',
		// 	name: 'Japanese',
		// 	flag: './assets/media/flags/014-japan.svg'
		// },
		{
			lang: 'ge',
			name: 'German',
			flag: './assets/media/flags/017-germany.svg'
		},
		// {
		// 	lang: 'fr',
		// 	name: 'French',
		// 	flag: './assets/media/flags/019-france.svg'
		// },
	];

	/**
	 * Component constructor
	 *
	 * @param translationService: TranslationService
	 * @param router: Router
	 */
	constructor(private translationService: TranslationService, private router: Router) {
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		this.setSelectedLanguage();
		this.router.events
			.pipe(filter(event => event instanceof NavigationStart))
			.subscribe(event => {
				this.setSelectedLanguage();
			});
	}

	/**
	 * Set language
	 *
	 * @param lang: any
	 */
	setLanguage(lang) {

		this.languages.forEach((language: LanguageFlag) => {
			
			if (language.lang === lang) {
				language.active = true;
				this.language = language;
			} else {
				language.active = false;
			}
		});
		this.translationService.setLanguage(lang);
		// 
	}

	href :any ;

	setWebsiteLanguage(lang){
		this.setLanguage(lang);

		this.href = this.router.url;
		// console.log(this.href);
		// this.router.navigateByUrl('/');
		location.reload();
	}

	/**
	 * Set selected language
	 */
	setSelectedLanguage(): any {
		this.setLanguage(this.translationService.getSelectedLanguage());
	}
}
