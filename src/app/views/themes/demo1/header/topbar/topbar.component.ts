// Angular
import { Component, OnInit } from '@angular/core';
import { NavbarActionsService } from './../../../../../services/navbar-actions.service';

@Component({
	selector: 'kt-topbar',
	templateUrl: './topbar.component.html',
	styleUrls: ['./topbar.component.scss'],
})

export class TopbarComponent implements OnInit {
	isDisabledSave: boolean;
	isDisabledCancel: boolean;

	currentUserRoleID: any;
	constructor(private navBarActionService: NavbarActionsService) { }

	ngOnInit() {
		this.currentUserRoleID = localStorage.getItem("logistic_login_user_type");
		this.navBarActionService.disabledSave.subscribe(newStatus => {
			this.isDisabledSave = newStatus;

		});
		this.navBarActionService.disabledCancel.subscribe(newStatus => {
			this.isDisabledCancel = newStatus;
		});
	}

	cancel() {
		this.navBarActionService.changeActionName('cancel');
	}

	save() {
		this.navBarActionService.changeActionName('save');
	}
}
