// Angular
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient} from '@angular/common/http';
export function HttpLoaderFactory(http: HttpClient) {
	return new TranslateHttpLoader(http);
}
// NgBootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// Perfect Scrollbar
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

// Core module
import { CoreModule } from '../../core/core.module';
// CRUD Partials
import { ActionNotificationComponent, AlertComponent, DeleteEntityDialogComponent, FetchEntityDialogComponent, UpdateStatusDialogComponent } from './content/crud';
// Layout partials
import {
	ContextMenu2Component,
	ContextMenuComponent,
	LanguageSelectorComponent,
	NotificationComponent,
	QuickActionComponent,
	QuickPanelComponent,
	ScrollTopComponent,
	SearchDefaultComponent,
	SearchDropdownComponent,
	SearchResultComponent,
	SplashScreenComponent,
	StickyToolbarComponent,
	Subheader1Component,
	Subheader2Component,
	Subheader3Component,
	Subheader4Component,
	Subheader5Component,
	UserProfile2Component,
	UserProfileComponent,
	UserProfile3Component
} from './layout';
// General
import { NoticeComponent } from './content/general/notice/notice.component';
import { PortletModule } from './content/general/portlet/portlet.module';
// Errpr
import { ErrorComponent } from './content/general/error/error.component';
// SVG inline
import { InlineSVGModule } from 'ng-inline-svg';
import { CartComponent } from './layout/topbar/cart/cart.component';

import { OnlyNumberDirective } from './../../directives/number.directive';
import { OnlyTelNumberDirective } from './../../directives/tel-number.directive';
import { ClickCatcherDirective } from './../../directives/click-catcher.directive';

import { CheckboxComponent } from '../../components/checkbox/checkbox.component';
import { CheckboxGroupComponent } from '../../components/checkbox-group/checkbox-group.component';
import { FileUploadComponent } from '../../components/file-upload/file-upload.component';
import { ProgressComponent } from '../../components/progress/progress.component';

@NgModule({
	declarations: [
		ScrollTopComponent,
		NoticeComponent,
		ActionNotificationComponent,
		DeleteEntityDialogComponent,
		FetchEntityDialogComponent,
		UpdateStatusDialogComponent,
		AlertComponent,

		// topbar components
		ContextMenu2Component,
		ContextMenuComponent,
		QuickPanelComponent,
		ScrollTopComponent,
		SearchResultComponent,
		SplashScreenComponent,
		StickyToolbarComponent,
		Subheader1Component,
		Subheader2Component,
		Subheader3Component,
		Subheader4Component,
		Subheader5Component,
		LanguageSelectorComponent,
		NotificationComponent,
		QuickActionComponent,
		SearchDefaultComponent,
		SearchDropdownComponent,
		UserProfileComponent,
		UserProfile2Component,
		UserProfile3Component,
		CartComponent,

		ErrorComponent,
		OnlyNumberDirective,
		OnlyTelNumberDirective,
		ClickCatcherDirective,
		CheckboxComponent,
		CheckboxGroupComponent,
		FileUploadComponent,
		ProgressComponent,
	],
	exports: [
		PortletModule,

		ScrollTopComponent,
		NoticeComponent,
		ActionNotificationComponent,
		DeleteEntityDialogComponent,
		FetchEntityDialogComponent,
		UpdateStatusDialogComponent,
		AlertComponent,

		// topbar components
		ContextMenu2Component,
		ContextMenuComponent,
		QuickPanelComponent,
		ScrollTopComponent,
		SearchResultComponent,
		SplashScreenComponent,
		StickyToolbarComponent,
		Subheader1Component,
		Subheader2Component,
		Subheader3Component,
		Subheader4Component,
		Subheader5Component,
		LanguageSelectorComponent,
		NotificationComponent,
		QuickActionComponent,
		SearchDefaultComponent,
		SearchDropdownComponent,
		UserProfileComponent,
		UserProfile2Component,
		UserProfile3Component,
		CartComponent,

		ErrorComponent,
		OnlyNumberDirective,
		OnlyTelNumberDirective,
		ClickCatcherDirective,
		CheckboxComponent,
		CheckboxGroupComponent,
		FileUploadComponent,
		ProgressComponent
	],
	imports: [
		CommonModule,
		RouterModule,
		FormsModule,
		ReactiveFormsModule,
		NgbModule,
		PerfectScrollbarModule,
		InlineSVGModule,
		CoreModule,
		PortletModule,
		MatButtonModule,
		MatMenuModule,
		MatSelectModule,
		MatInputModule,
		MatTableModule,
		MatAutocompleteModule,
		MatRadioModule,
		MatIconModule,
		MatNativeDateModule,
		MatProgressBarModule,
		MatDatepickerModule,
		MatCardModule,
		MatPaginatorModule,
		MatSortModule,
		MatCheckboxModule,
		MatProgressSpinnerModule,
		MatSnackBarModule,
		MatTabsModule,
		MatTooltipModule,
		MatDialogModule,
		TranslateModule.forChild(),
	]
})
export class PartialsModule {
}
