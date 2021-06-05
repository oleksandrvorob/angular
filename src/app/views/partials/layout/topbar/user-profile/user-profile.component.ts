// Angular
import { Component, OnInit, Input } from '@angular/core';
// RxJS
import { Observable } from 'rxjs';
// NGRX
import { select, Store } from '@ngrx/store';
// State
import { AppState } from '../../../../../core/reducers';
import { currentUser, Logout, User } from '../../../../../core/auth';

import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'kt-user-profile',
	templateUrl: './user-profile.component.html',
})
export class UserProfileComponent implements OnInit {
	// Public properties
	user$: Observable<User>;

	@Input() showAvatar: boolean = true;
	@Input() showHi: boolean = false;
	@Input() showBadge: boolean = false;

	first_name : any ;
	last_name : any ;
	pic : any ='./assets/media/users/300_25.jpg';
	/**
	 * Component constructor
	 *
	 * @param store: Store<AppState>
	 */
	constructor(private store: Store<AppState> , private router: Router) {
		this.first_name = localStorage.getItem("logistic_login_user_first_name");
		// console.log(this.first_name);
		
		this.last_name = localStorage.getItem("logistic_login_user_last_name");
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit(): void {
		this.user$ = this.store.pipe(select(currentUser));
	}

	/**
	 * Log out
	 */
	logout() {
		// this.store.dispatch(new Logout());
		
		localStorage.removeItem("logistic_login_access_token");
		localStorage.removeItem("logistic_login_user_first_name");
		localStorage.removeItem("logistic_login_user_last_name");
		localStorage.removeItem("logistic_login_user_type");
		
		localStorage.clear();

		this.router.navigate(['/auth/login']);
	}
}
