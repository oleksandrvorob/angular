import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentRunComponent } from './payment-run.component';
import { CanDeactivateGuardService } from '../../../services/can-deactivate-guard.service';

const routes: Routes = [
	{
		path: '',
		component: PaymentRunComponent,
		canDeactivate: [CanDeactivateGuardService]
	  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRunRoutingModule { }
