import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserManagementRoutingModule } from './user-management-routing.module';
import { UserManagementComponent } from './user-management.component';
import { AddeditComponent } from './addedit/addedit.component';
import { ListComponent } from './list/list.component';

import { CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { DataTablesModule } from 'angular-datatables';
import { Daterangepicker } from 'ng2-daterangepicker';


// NgBootstrap
import { NgbModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
// Core Module
import { CoreModule } from '../../../core/core.module';
import { PartialsModule } from '../../partials/partials.module';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { NgxPermissionsModule } from 'ngx-permissions';
export function HttpLoaderFactory(http: HttpClient) {
	return new TranslateHttpLoader(http);
}

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
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

@NgModule({
  declarations: [UserManagementComponent, AddeditComponent, ListComponent],
  imports: [
    CommonModule,
    UserManagementRoutingModule,
	HttpClientModule,
	NgxPermissionsModule.forChild(),
	FormsModule,
	ReactiveFormsModule,
	TranslateModule.forChild(),
	MatDialogModule,
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
	NgbProgressbarModule,
	PartialsModule,
	CoreModule,
	TranslateModule.forRoot({
	loader: {provide: TranslateLoader, useFactory: HttpLoaderFactory, deps: [HttpClient]}
	}),
	NgbModule,
	DataTablesModule,
    Daterangepicker,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UserManagementModule { }
