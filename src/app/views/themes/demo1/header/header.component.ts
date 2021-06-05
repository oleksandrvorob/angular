// Angular
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
	NavigationCancel,
	NavigationEnd,
	NavigationStart,
	RouteConfigLoadEnd,
	RouteConfigLoadStart,
	Router
} from '@angular/router';
// Object-Path
import * as objectPath from 'object-path';
// Loading bar
import { LoadingBarService } from '@ngx-loading-bar/core';
// Layout
import { LayoutConfigService, LayoutRefService } from '../../../../core/_base/layout';
// HTML Class Service
import { HtmlClassService } from '../html-class.service';
import { SubheaderService , TranslationService } from '../../../../core/_base/layout';
import { Breadcrumb } from '../../../../core/_base/layout/services/subheader.service';
import { Subscription } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';


@Component({
	selector: 'kt-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
	// Public properties
	menuHeaderDisplay: boolean;
	layout: string;
	today: number = Date.now();
	title: string = '';
	desc: string = '';
	breadcrumbs: Breadcrumb[] = [];
	@ViewChild('ktHeader', { static: true }) ktHeader: ElementRef;
	private subscriptions: Subscription[] = [];

	/**
	 * Component constructor
	 *
	 * @param router: Router
	 * @param layoutRefService: LayoutRefService
	 * @param layoutConfigService: LayoutConfigService
	 * @param loader: LoadingBarService
	 * @param htmlClassService: HtmlClassService
	 */
	constructor(
		private router: Router,
		public subheaderService: SubheaderService,
		private layoutRefService: LayoutRefService,
		private layoutConfigService: LayoutConfigService,
		public loader: LoadingBarService,
		public htmlClassService: HtmlClassService, private translate: TranslateService , private transServ : TranslationService
	) {
		// page progress bar percentage
		this.router.events.subscribe(event => {
			if (event instanceof NavigationStart) {
				// set page progress bar loading to start on NavigationStart event router
				this.loader.start();
			}
			if (event instanceof RouteConfigLoadStart) {
				this.loader.increment(35);
			}
			if (event instanceof RouteConfigLoadEnd) {
				this.loader.increment(75);
			}
			if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
				// set page progress bar loading to end on NavigationEnd event router
				this.loader.complete();
			}
		});

		let current_lng = this.transServ.getSelectedLanguage();
		console.log(current_lng);
		
	    // this.translate.use(current_lng);
	  
	}


	titleResp : any;

	ngAfterViewInit(): void {
		this.subscriptions.push(this.subheaderService.title$.subscribe(bt => {
			// breadcrumbs title sometimes can be undefined
			if (bt) {
				Promise.resolve(null).then(() => {
					// console.log(bt);
					this.titleResp = bt;
					let translate = this.titleResp.translate;
					
					// console.log(translate);
					this.title = translate;
					// this.translate.get([translate]).subscribe((res: string) => {
					// 	console.log(res);
					// 	//=> 'hello world'

					// 	this.title = res[translate];
						
					// });

					// this.title = bt.title;
					this.desc = bt.desc;
				});
			}
		}));

		this.subscriptions.push(this.subheaderService.breadcrumbs$.subscribe(bc => {
			Promise.resolve(null).then(() => {
				this.breadcrumbs = bc;
			});
		}));
		this.layoutRefService.addElement('header', this.ktHeader.nativeElement);
	}
	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit(): void {
		const config = this.layoutConfigService.getConfig();
		this.layout = this.layoutConfigService.getConfig('subheader.layout');

		// get menu header display option
		this.menuHeaderDisplay = objectPath.get(config, 'header.menu.self.display');

		// animate the header minimize the height on scroll down. to be removed, not applicable for default demo
		/*if (objectPath.get(config, 'header.self.fixed.desktop.enabled') || objectPath.get(config, 'header.self.fixed.desktop')) {
			// header minimize on scroll down
			this.ktHeader.nativeElement.setAttribute('data-ktheader-minimize', '1');
		}*/
	}

	ngOnDestroy(): void {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}
}
