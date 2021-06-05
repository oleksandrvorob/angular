import { Subscription } from 'rxjs';
// Angular
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, ActivatedRoute, RouterEvent, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
// Layout
import { LayoutConfigService, SplashScreenService } from './core/_base/layout';
// Layout
import { TranslationService } from './core/_base/layout';
// language list
import { locale as enLang } from './core/_config/i18n/en';
import { locale as chLang } from './core/_config/i18n/ch';
import { locale as esLang } from './core/_config/i18n/es';
import { locale as jpLang } from './core/_config/i18n/jp';
import { locale as deLang } from './core/_config/i18n/de';
import { locale as frLang } from './core/_config/i18n/fr';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from './services/lang.service';
import { UserService } from './services/user.service';

import { NavbarActionsService } from './services/navbar-actions.service';

import * as $ from 'jquery';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'body[kt-root]',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
	// Public properties
	title = 'Logistic';
	loader: boolean;
	private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

	constructor(private translationService: TranslationService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private layoutConfigService: LayoutConfigService,
		private splashScreenService: SplashScreenService,
		private translate: TranslateService,
		private languageService: LanguageService,
		private userService: UserService,
		private navBarActionService: NavbarActionsService) {

		// register translations
		this.translationService.loadTranslations(enLang, chLang, esLang, jpLang, deLang, frLang);


		localStorage.setItem('lang', 'en');

		// this.languageService.data.subscribe(data => {
		// 	if (data) {
		// 		translate.setDefaultLang(`${data}`);
		// 	}
		// });
		translate.setDefaultLang('ge');

		//
		router.events.pipe(filter((e: Event) => e instanceof NavigationEnd)
		).subscribe((e: NavigationEnd) => {
			this.navBarActionService.changeCurrentUrl(e.url);
		});
	}

	ngOnInit(): void {

		$(document).on('keypress', '.number', function (e) {
			alert(11111)
			if (e.which != 8 && e.which != 0 && e.which != 46 && (e.which < 48 || e.which > 57)) {
				return false;
			}
		});

		$(document).on('keypress', '.digits', function (e) {
			if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
				return false;
			}
		});

		// enable/disable loader
		this.loader = this.layoutConfigService.getConfig('loader.enabled');

		const routerSubscription = this.router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				// hide splash screen
				this.splashScreenService.hide();

				// scroll to top on every route change
				window.scrollTo(0, 0);
			}
		});
		this.unsubscribe.push(routerSubscription);
	}

	/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.unsubscribe.forEach(sb => sb.unsubscribe());
	}
}
