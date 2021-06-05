import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BanksRoutingModule } from './banks-routing.module';
import { BanksComponent } from './banks.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [BanksComponent],
  imports: [
    CommonModule,
	BanksRoutingModule,
	MatAutocompleteModule,
	FormsModule,
	ReactiveFormsModule,
	MatInputModule,
	MatCardModule,
  ]
})
export class BanksModule { }
