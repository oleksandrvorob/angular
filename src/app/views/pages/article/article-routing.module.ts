import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { AddeditComponent } from './addedit/addedit.component';
import { CanDeactivateGuardService } from '../../../services/can-deactivate-guard.service';

const routes: Routes = [
  {
    path : '',
    component : ListComponent
  },
  {
    path : 'addedit',
	component : AddeditComponent,
	canDeactivate: [CanDeactivateGuardService]
  }
  ,
  {
    path : 'addedit/:articleId',
    component : AddeditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticleRoutingModule { }
