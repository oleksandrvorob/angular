import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SystemComponent } from './system.component';
import { CanDeactivateGuardService } from '../../../services/can-deactivate-guard.service';

const routes: Routes = [
	{
		path: '',
		component: SystemComponent,
		canDeactivate: [CanDeactivateGuardService]
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule { }
