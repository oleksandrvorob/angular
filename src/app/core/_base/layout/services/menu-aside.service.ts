// Angular
import { Injectable } from '@angular/core';
// RxJS
import { BehaviorSubject } from 'rxjs';
// Object path
import * as objectPath from 'object-path';
// Services
import { MenuConfigService } from './menu-config.service';

@Injectable()
export class MenuAsideService {
	// Public properties
	classes: string;
	menuList$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

	/**
	 * Service Constructor
	 *
	 * @param menuConfigService: MenuConfigService
	 * @param store: Store<AppState>
	 */
	constructor(
		private menuConfigService: MenuConfigService
	) {
		this.loadMenu();
	}

	/**
	 * Load menu
	 */
	loadMenu() {
		// get menu list
		const menuItems: any[] = objectPath.get(this.menuConfigService.getMenus(), 'aside.items');
		this.menuList$.next(menuItems);
	}
}
