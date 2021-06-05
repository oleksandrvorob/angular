// Angular
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// RxJS
import { Subject } from 'rxjs';
// Object-Path
import * as objectPath from 'object-path';
// Lodash
import { merge } from 'lodash';

@Injectable()
export class PageConfigService {
	// Public properties
	onConfigUpdated$: Subject<any>;
	pageConfig: any;

	/**
	 * Service Constructor
	 *
	 * @param router: Router
	 */
	constructor(private router: Router) {
		// register on config changed event and set default config
		this.onConfigUpdated$ = new Subject();
	}

	/**
	 * Get current page config based on route
	 */
	getCurrentPageConfig(path?: string): any {
		let url = this.router.url;

		// remove first route (demo name) from url router
		if (new RegExp(/^\/demo/).test(url)) {
			const urls = url.split('/');
			urls.splice(0, 2);
			url = urls.join('/');
		}

		if (url.charAt(0) == '/') {
			url = url.substr(1);
		}

		let configPath = url.replace(/\//g, '.');

		if (path) {
			configPath += '.' + path;
		}

		// get page config by path
		return objectPath.get(this.pageConfig, configPath);
	}

	/**
	 * Set existing config with a new value
	 * @param value: any
	 * @param save: boolean?
	 */
	setConfig(value: any, save?: boolean): void {
		this.pageConfig = merge(this.pageConfig, value);

		if (save) {
			// not implemented
		}

		// fire off an event that all subscribers will listen
		this.onConfigUpdated$.next(this.pageConfig);
	}

	/**
	 * Load confgis
	 *
	 * @param config: any
	 */
	loadConfigs(config: any) {
		this.pageConfig = config;
		this.onConfigUpdated$.next(this.pageConfig);
	}
}
