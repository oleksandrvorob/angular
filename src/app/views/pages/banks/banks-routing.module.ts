import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BanksComponent } from './banks.component';

const routes: Routes = [
	{
		path : '',
		component : BanksComponent
	},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BanksRoutingModule { }
