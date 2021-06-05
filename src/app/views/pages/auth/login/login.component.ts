// Angular
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// RxJS
import { Observable, Subject } from 'rxjs';
import { finalize, takeUntil, tap } from 'rxjs/operators';
// Translate
import { TranslateService } from '@ngx-translate/core';
// Store
import { Store } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';
// Auth
import { AuthNoticeService, AuthService, Login } from '../../../../core/auth';

import { AuthenticateService } from '../authenticate.service' ;

import * as $ from 'jquery';

import { TranslationService } from '../../../../core/_base/layout';



/**
 * ! Just example => Should be removed in development
 */
const DEMO_PARAMS = {
	EMAIL: 'admin@demo.com',
	PASSWORD: 'demo'
};

@Component({
	selector: 'kt-login',
	templateUrl: './login.component.html',
	encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit, OnDestroy {
	// Public params
	loginForm: FormGroup;
	loading = false;
	isLoggedIn$: Observable<boolean>;
	errors: any = [];

	invalidLogin :  any = false;
	showerror: any = false;
	button_disable : any = false;

	private unsubscribe: Subject<any>;

	private returnUrl: any;

	// Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

	/**
	 * Component constructor
	 *
	 * @param router: Router
	 * @param auth: AuthService
	 * @param authNoticeService: AuthNoticeService
	 * @param translate: TranslateService
	 * @param store: Store<AppState>
	 * @param fb: FormBuilder
	 * @param cdr
	 * @param route
	 */
	constructor(
		private router: Router,
		private auth: AuthService,
		private authNoticeService: AuthNoticeService,
		private translate: TranslateService,
		private store: Store<AppState>,
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private cd: ChangeDetectorRef,
		private authenticateService : AuthenticateService,
		private transServ : TranslationService
	) {
		this.unsubscribe = new Subject();

		let current_lng = this.transServ.getSelectedLanguage();

		this.translate.use(current_lng);

	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit(): void {
		this.initLoginForm();

		// redirect back to the returnUrl before login
		this.route.queryParams.subscribe(params => {
			// this.returnUrl = params['returnUrl'] || '/';
		});
		// this.submit();
	}

	/**
	 * On destroy
	 */
	ngOnDestroy(): void {
		this.authNoticeService.setNotice(null);
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.loading = false;
	}

	/**
	 * Form initalization
	 * Default params, validators
	 */
	initLoginForm() {
		// demo message to show

		this.loginForm = this.fb.group({
			email: ['', Validators.compose([
				Validators.required,
				Validators.email,
				Validators.minLength(3),
				Validators.maxLength(320) // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
			])
			],
			password: ['', Validators.compose([
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(100)
			])
			]
		});
	}

	/**
	 * Form Submit
	 */

	response : any;

	submit() {
		const controls = this.loginForm.controls;
		/** check form */
		$("#loginForm").addClass("validateFrm");
		if (this.loginForm.invalid) {
			// Object.keys(controls).forEach(controlName =>
			// 	controls[controlName].markAsTouched()
			// );
			return;
		}

		this.loading = true;

		const authData = {
			email: controls['email'].value,
			password: controls['password'].value
		};

		this.button_disable = true;

		this.authenticateService.login(authData).subscribe((result) => {
			this.response = result;
			if(this.response && this.response.status =='ok'){
				localStorage.setItem("logistic_login_access_token", this.response.data.token);
				localStorage.setItem("logistic_login_user_first_name", this.response.data.first_name);
				localStorage.setItem("logistic_login_user_last_name", this.response.data.last_name);
				localStorage.setItem("logistic_login_user_type", this.response.data.user_type);
				this.router.navigate(['/']);
			}
			else{
				this.invalidLogin = true;
				this.button_disable = false;
				this.cd.markForCheck();
			}
		});



	}


}
