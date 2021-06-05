// Angular
import { NgModule } from '@angular/core';
import { CommonModule , DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// NgBootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// Partials
import { PartialsModule } from '../partials/partials.module';
// Pages
import { CoreModule } from '../../core/core.module';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import {DataTableService} from '../../core/_base/layout';

@NgModule({
	declarations: [],
	exports: [],
	imports: [
		CommonModule,
		HttpClientModule,
		FormsModule,
		NgbModule,
		CoreModule,
		PartialsModule,
		MatSelectModule,
		MatListModule
	],
	providers: [DatePipe]
})
export class PagesModule {
}
