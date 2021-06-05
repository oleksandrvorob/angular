import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillRunComponent } from './bill-run.component';

const routes: Routes = [
	{
		path: '',
		component: BillRunComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillRunRoutingModule { }
