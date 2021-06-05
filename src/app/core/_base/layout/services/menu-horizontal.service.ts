// Angular
import { Injectable } from '@angular/core';
// RxJS
import { BehaviorSubject } from 'rxjs';
// Object-Path
import * as objectPath from 'object-path';
// Service
import { MenuConfigService } from './menu-config.service';

@Injectable()
export class MenuHorizontalService {
	// Public properties
	menuList$: BehaviorSubject<any> = new BehaviorSubject({});

	/**
	 * Service constructor
	 *
	 * @param menuConfigService: MenuConfigServcie
	 */
	constructor(private menuConfigService: MenuConfigService) {
		this.loadMenu();
	}

	/**
	 * Load menu list
	 */
	loadMenu() {
		// get menu list
		const menuItems = objectPath.get(this.menuConfigService.getMenus(), 'header.items');
		this.menuList$.next(menuItems);
	}
}
