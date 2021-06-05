// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { BaseComponent } from './base/base.component';
import { ErrorPageComponent } from './content/error-page/error-page.component';
// Auth
import { AuthGuard } from '../../../core/auth';
import { NgxPermissionsGuard } from 'ngx-permissions';

const routes: Routes = [
	{
		path: '',
		component: BaseComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: 'clients',
				loadChildren: () => import('app/views/pages/clients/clients.module').then(m => m.ClientsModule)
			},

			{
				path: 'invoice',
				loadChildren: () => import('app/views/pages/invoice/invoice.module').then(m => m.InvoiceModule)
			},

			{
				path: 'contractors',
				loadChildren: () => import('app/views/pages/contractors/contractors.module').then(m => m.ContractorsModule)
			},

			{
				path: 'companies',
				loadChildren: () => import('app/views/pages/companies/companies.module').then(m => m.CompaniesModule)
			},
			{
				path: 'article',
				loadChildren: () => import('app/views/pages/article/article.module').then(m => m.ArticleModule)
			},
			{
				path: 'persons',
				loadChildren: () => import('app/views/pages/persons/persons.module').then(m => m.PersonsModule)
			},
			{
				path: 'orders',
				loadChildren: () => import('app/views/pages/orders/orders.module').then(m => m.OrdersRoutesModule)
			},

			{
				path: 'account-books',
				loadChildren: () => import('app/views/pages/account-books/account-books.module').then(m => m.AccountBooksRoutesModule)
			},
			{
				path: 'system',
				loadChildren: () => import('app/views/pages/system/system.module').then(m => m.SystemModule)
			},
			{
				path: 'open-positions',
				loadChildren: () => import('app/views/pages/open-positions/open-positions.module').then(m => m.OpenPositionsModule)
			},
			{
				path: 'user-manage',
				loadChildren: () => import('app/views/pages/user-management/user-management.module').then(m => m.UserManagementModule)
			},
			{
				path: 'banks',
				loadChildren: () => import('app/views/pages/banks/banks.module').then(m => m.BanksModule)
			},

			{
				path: 'payment-run',
				loadChildren: () => import('app/views/pages/payment-run/payment-run.module').then(m => m.PaymentRunModule)
			},
			{
				path: 'bill-run',
				loadChildren: () => import('app/views/pages/bill-run/bill-run.module').then(m => m.BillRunModule)
			},
			{
				path: 'maps',
				loadChildren: () => import('app/views/pages/maps/maps.module').then(m => m.MapsModule)
			},

			{path: 'error/:type', component: ErrorPageComponent},
			{path: '', redirectTo: 'clients', pathMatch: 'full'},
		]
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PagesRoutingModule {
}
