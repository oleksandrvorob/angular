// Angular
import { Component, OnInit } from '@angular/core';
// Layout
import { LayoutConfigService } from '../../../../core/_base/layout';

@Component({
	selector: 'kt-subheader',
	templateUrl: './subheader.component.html',
})
export class SubheaderComponent implements OnInit {
	// Public properties
	// subheader layout
	layout: string;

	/**
	 * Component constructor
	 *
	 * @param layoutConfigService: LayoutConfigService
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
		this.layout = this.layoutConfigService.getConfig('subheader.layout');
	}
}
