// Angular
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GestureConfig } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { OverlayModule } from '@angular/cdk/overlay';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Angular in memory
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
// NgBootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// Perfect Scroll bar
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
// SVG inline
import { InlineSVGModule } from 'ng-inline-svg';
// Env
import { environment } from '../environments/environment';
// Hammer JS
import 'hammerjs';
// NGX Permissions
import { NgxPermissionsModule } from 'ngx-permissions';
// NGRX
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
// State
import { metaReducers, reducers } from './core/reducers';
// Copmponents
import { AppComponent } from './app.component';
// Modules
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
// Partials
import { PartialsModule } from './views/partials/partials.module';
// Services
import { DataTableService, FakeApiService } from './core/_base/layout';
// Layout Services
import {
	LayoutConfigService, LayoutRefService, MenuAsideService, MenuConfigService, MenuHorizontalService, PageConfigService, SplashScreenService, SubheaderService,
	KtDialogService
} from './core/_base/layout';
// Auth
import { AuthModule } from './views/pages/auth/auth.module';
import { AuthService, PermissionEffects, permissionsReducer, RoleEffects, rolesReducer } from './core/auth';
// CRUD
import { HttpUtilsService, LayoutUtilsService, TypesUtilsService } from './core/_base/crud';
// Config
import { LayoutConfig } from './core/_config/demo1/layout.config';
// Highlight JS
import { HIGHLIGHT_OPTIONS, HighlightLanguage } from 'ngx-highlightjs';
import * as typescript from 'highlight.js/lib/languages/typescript';
import * as scss from 'highlight.js/lib/languages/scss';
import * as xml from 'highlight.js/lib/languages/xml';
import * as json from 'highlight.js/lib/languages/json';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
export function HttpLoaderFactory(http: HttpClient) {
	return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}
import { DatePipe } from '@angular/common';
import { StringPipe } from './pipes/string.pipe';

import {
	ActionNotificationComponent
} from './views/partials/content/crud';
import { PriceHistoryComponent } from './components/price-history/price-history.component';
import { DialogComponent } from './components/dialog/dialog.component';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';

// tslint:disable-next-line:class-name
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
	wheelSpeed: 0.5,
	swipeEasing: true,
	minScrollbarLength: 40,
	maxScrollbarLength: 300,
};

export function initializeLayoutConfig(appConfig: LayoutConfigService) {
	// initialize app by loading default demo layout config
	return () => {
		if (appConfig.getConfig() === null) {
			appConfig.loadConfigs(new LayoutConfig().configs);
		}
	};
}

export function hljsLanguages(): HighlightLanguage[] {
	return [
		{ name: 'typescript', func: typescript },
		{ name: 'scss', func: scss },
		{ name: 'xml', func: xml },
		{ name: 'json', func: json }
	];
}

@NgModule({
	declarations: [AppComponent, StringPipe, PriceHistoryComponent, DialogComponent],
	imports: [
		BrowserAnimationsModule,
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		environment.isMockEnabled ? HttpClientInMemoryWebApiModule.forRoot(FakeApiService, {
			passThruUnknownUrl: true,
			dataEncapsulation: false
		}) : [],
		NgxPermissionsModule.forRoot(),
		PartialsModule,
		CoreModule,
		OverlayModule,
		StoreModule.forRoot(reducers, { metaReducers, runtimeChecks: { strictStateImmutability: true, strictActionImmutability: true } }),
		EffectsModule.forRoot([]),
		StoreRouterConnectingModule.forRoot({ stateKey: 'router' }),
		StoreDevtoolsModule.instrument(),
		AuthModule.forRoot(),
		NgbModule,
		TranslateModule.forRoot(),
		MatProgressSpinnerModule,
		MatDialogModule,
		MatButtonModule,
		MatIconModule,
		MatInputModule,
		MatFormFieldModule,
		MatDatepickerModule,
		InlineSVGModule.forRoot(),
		HttpClientModule,
		TranslateModule.forRoot({
			loader: { provide: TranslateLoader, useFactory: HttpLoaderFactory, deps: [HttpClient] }
		}),
		FormsModule,
		ReactiveFormsModule
	],
	exports: [],
	providers: [
		AuthService,
		LayoutConfigService,
		LayoutRefService,
		MenuConfigService,
		PageConfigService,
		KtDialogService,
		DataTableService,
		SplashScreenService,
		{
			provide: PERFECT_SCROLLBAR_CONFIG,
			useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
		},
		{
			provide: HAMMER_GESTURE_CONFIG,
			useClass: GestureConfig
		},
		{
			// layout config initializer
			provide: APP_INITIALIZER,
			useFactory: initializeLayoutConfig,
			deps: [LayoutConfigService], multi: true
		},
		{
			provide: HIGHLIGHT_OPTIONS,
			useValue: { languages: hljsLanguages }
		},
		// template services
		SubheaderService,
		MenuHorizontalService,
		MenuAsideService,
		HttpUtilsService,
		TypesUtilsService,
		LayoutUtilsService,
		DatePipe
	],
	bootstrap: [AppComponent],
	entryComponents: [
		ActionNotificationComponent,
		PriceHistoryComponent,
		DialogComponent
	]
})
export class AppModule {
}
