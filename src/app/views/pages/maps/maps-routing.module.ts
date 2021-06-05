import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapsComponent } from './maps.component';

const routes: Routes = [
	{
		path : '',
		component : MapsComponent
	},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapsRoutingModule { }
