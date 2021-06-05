import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompaniesListComponent } from './companies-list/companies-list.component';
import { AddeditComponent } from './addedit/addedit.component';
import { CanDeactivateGuardService } from '../../../services/can-deactivate-guard.service';

const routes: Routes = [
  {
    path : '',
    component : CompaniesListComponent
  },
  {
    path : 'addedit',
	component : AddeditComponent,
	canDeactivate: [CanDeactivateGuardService]
  }
  ,
  {
    path : 'addedit/:companyId',
    component : AddeditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompaniesRoutingModule { }
