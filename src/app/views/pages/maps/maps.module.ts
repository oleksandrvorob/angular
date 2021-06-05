import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MapsRoutingModule } from './maps-routing.module';
import { MatCardModule } from '@angular/material/card';
import { MapsComponent } from './maps.component';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';

@NgModule({
  declarations: [MapsComponent],
  imports: [
	CommonModule,
	FormsModule,
	ReactiveFormsModule,
	MapsRoutingModule,
	MatButtonModule,
	MatInputModule,
	MatSelectModule,
	MatCardModule,
	MatAutocompleteModule,
	AgmCoreModule.forRoot({
		apiKey: 'AIzaSyB4tqFq6eLwPZMF3ZFNsQswGPg0Q0czRpc',
		libraries: ['places','geometry']
	})
  ],
  providers: [
	  GoogleMapsAPIWrapper
  ]
})
export class MapsModule { }
