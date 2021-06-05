import { NgxPermissionsModule } from 'ngx-permissions';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { InlineSVGModule } from 'ng-inline-svg';
import { CoreModule } from '../../../core/core.module';
import { HeaderComponent } from './header/header.component';
import { AsideLeftComponent } from './aside/aside-left.component';
import { FooterComponent } from './footer/footer.component';
import { SubheaderComponent } from './subheader/subheader.component';
import { BrandComponent } from './header/brand/brand.component';
import { TopbarComponent } from './header/topbar/topbar.component';
import { MenuHorizontalComponent } from './header/menu-horizontal/menu-horizontal.component';
import { PartialsModule } from '../../partials/partials.module';
import { BaseComponent } from './base/base.component';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesModule } from '../../pages/pages.module';
import { HtmlClassService } from './html-class.service';
import { HeaderMobileComponent } from './header/header-mobile/header-mobile.component';
import { ErrorPageComponent } from './content/error-page/error-page.component';
import { PermissionEffects, permissionsReducer, RoleEffects, rolesReducer } from '../../../core/auth';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
	declarations: [
		BaseComponent,
		FooterComponent,
		HeaderComponent,
		BrandComponent,
		HeaderMobileComponent,
		SubheaderComponent,
		TopbarComponent,
		AsideLeftComponent,
		MenuHorizontalComponent,
		ErrorPageComponent,
	],
	exports: [
		BaseComponent,
		FooterComponent,
		HeaderComponent,
		BrandComponent,
		HeaderMobileComponent,
		SubheaderComponent,
		TopbarComponent,
		AsideLeftComponent,
		MenuHorizontalComponent,
		ErrorPageComponent,
	],
	providers: [
		HtmlClassService,
	],
	imports: [
		CommonModule,
		RouterModule,
		NgxPermissionsModule.forChild(),
		StoreModule.forFeature('roles', rolesReducer),
		StoreModule.forFeature('permissions', permissionsReducer),
		EffectsModule.forFeature([PermissionEffects, RoleEffects]),
		PagesRoutingModule,
		PagesModule,
		PartialsModule,
		CoreModule,
		PerfectScrollbarModule,
		NgbModule,
		FormsModule,
		MatProgressBarModule,
		MatTabsModule,
		MatButtonModule,
		MatTooltipModule,
		TranslateModule.forChild(),
		LoadingBarModule,
		NgxDaterangepickerMd,
		InlineSVGModule,
		MatIconModule
	]
})
export class ThemeModule {
}
