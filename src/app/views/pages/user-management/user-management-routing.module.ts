import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserManagementComponent } from './user-management.component';
import { CanDeactivateGuardService } from '../../../services/can-deactivate-guard.service';

const routes: Routes = [
	{
		path: '',
		component: UserManagementComponent,
		canDeactivate: [CanDeactivateGuardService]
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule { }
