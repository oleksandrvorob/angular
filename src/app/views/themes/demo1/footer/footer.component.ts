// Angular
import { Component, OnInit } from '@angular/core';
import { LayoutConfigService } from '../../../../core/_base/layout';

@Component({
	selector: 'kt-footer',
	templateUrl: './footer.component.html',
})
export class FooterComponent implements OnInit {
	// Public properties
	today: number = Date.now();

	/**
	 * Component constructor
	 *
	 * @param layoutConfigService: LayouConfigService
	 */
	constructor(private layoutConfigService: LayoutConfigService) {
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit(): void {
		const config = this.layoutConfigService.getConfig();
	}
}
