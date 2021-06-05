import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
// NgBootstrap
import { NgbModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
// Core Module
import { CoreModule } from '../../../core/core.module';
import { PartialsModule } from '../../partials/partials.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
// import {HttpLoaderFactory} from '../../../app.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// import { MatDialogModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { FakeApiService } from '../../../core/_base/layout';
import { NgxPermissionsModule } from 'ngx-permissions';

export function HttpLoaderFactory(http: HttpClient) {
	return new TranslateHttpLoader(http);
}
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { environment } from '../../../../environments/environment';

import { DataTablesModule } from 'angular-datatables';

import { ContractorsComponent } from './contractors.component';
import { ListComponent } from './list/list.component';
import { ContractorsRoutingModule } from './contractors-routing.module';
import { OverviewComponent } from './addedit/overview/overview.component';
import { ContactPersonComponent } from './addedit/contact-person/contact-person.component';
import { OrderComponent } from './addedit/order/order.component';
import { SpecialTourComponent } from './addedit/special-tour/special-tour.component';
import { CommentsComponent } from './addedit/comments/comments.component';
import { ExistingPersonComponent } from './addedit/contact-person/existing-person/existing-person.component';
import { ExistingOrderComponent } from './addedit/order/existing-order/existing-order.component'
import { AddeditComponent } from './addedit/addedit.component';
import { ApplicationPipesModule } from './../application-pipes.module';
import { Daterangepicker } from 'ng2-daterangepicker';
import { HistoryComponent } from './addedit/history/history.component'

// import { OnlyNumberDirective } from './../../../directives/number.directive';

import { TourComponent } from './addedit/tour/tour.component';


import { NgxCurrencyModule } from "ngx-currency";

export const customCurrencyMaskConfig = {
	align: "right",
	allowNegative: true,
	allowZero: true,
	decimal: ",",
	precision: 2,
	prefix: "",
	suffix: "",
	thousands: ".",
	nullable: true
};

@NgModule({
	imports: [
		MatDialogModule,
		CommonModule,
		HttpClientModule,
		PartialsModule,
		NgxPermissionsModule.forChild(),
		FormsModule,
		ReactiveFormsModule,
		TranslateModule.forChild(),
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
		MatSlideToggleModule,
		MatChipsModule,
		NgbProgressbarModule,
		environment.isMockEnabled ? HttpClientInMemoryWebApiModule.forFeature(FakeApiService, {
			passThruUnknownUrl: true,
			dataEncapsulation: false
		}) : [],
		CommonModule,
		PartialsModule,
		CoreModule,
		HttpClientModule,
		TranslateModule.forRoot({
			loader: { provide: TranslateLoader, useFactory: HttpLoaderFactory, deps: [HttpClient] }
		}),
		NgbModule,
		ContractorsRoutingModule,
		DataTablesModule,
		Daterangepicker,
		ApplicationPipesModule,
		NgxCurrencyModule.forRoot(customCurrencyMaskConfig)
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	providers: [],
	declarations: [

		ContractorsComponent,
		ListComponent,
		OverviewComponent,
		ContactPersonComponent,
		OrderComponent,
		SpecialTourComponent,
		CommentsComponent,
		AddeditComponent,
		ExistingPersonComponent,
		ExistingOrderComponent,
		HistoryComponent,
		TourComponent

	]
})



export class ContractorsModule { }
