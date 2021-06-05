import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MapsAPILoader, AgmMap, GoogleMapsAPIWrapper, MouseEvent } from '@agm/core';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { MapsService } from './maps.service';
declare const google: any;

interface Marker {
	lat: number;
	lng: number;
	label?: string;
	draggable: boolean;
}

interface Location {
	lat: number;
	lng: number;
	viewport?: Object;
	zoom: number;
	address?: string;
	marker?: Marker;
}

interface Person {
	name: string;
	location: Location;
}

@Component({
  selector: 'kt-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit {

	private geoCoder: any;
	public location: Location = {
		lat: 51.678418,
		lng: 7.809007,
		marker: {
			lat: 51.678418,
			lng: 7.809007,
			draggable: true
		},
		zoom: 6
	};
	mapType = "satellite";
	circleRadius: number = 5000;

	filteredPersons: Person[];
	persons: Person[];
	selected: string = "clients";
	filterValue: string = "";
	selectedMarker: any;
	dataParams: any;

	@ViewChild(AgmMap, { static: true }) map: AgmMap;

	constructor(
		public mapsAPILoader: MapsAPILoader,
		private zone: NgZone,
		private wrapper: GoogleMapsAPIWrapper,
		private mapService: MapsService,
	  ) {
		  this.mapsAPILoader = mapsAPILoader;
		  this.zone = zone;
		  this.wrapper = wrapper;
		  this.mapsAPILoader.load().then(() => {
				this.geoCoder = new google.maps.Geocoder();
		  });
	  }

	ngOnInit() {
		this.location.marker.draggable = true;
		this.switchClientsOrContractors();
	}

	markerDragEnd(m: any, $event: any){
		this.location.marker.lat = m.coords.lat;
		this.location.marker.lng = m.coords.lng;
	}

	milesToRadius(value) {
		this.circleRadius = value / 0.00062137;
	}

	circleRadiusInMiles() {
	   return this.circleRadius * 0.00062137;
	}

	switchClientsOrContractors(){
		this.dataParams = {
			start: 0,
			search: {
				value: this.filterValue,
				regex: false
			},
			status: 1
		};
		if(this.selected === "clients") {
			this.mapService.getClientsList(this.dataParams).subscribe(result => {
				this.persons = result.data;
				this.filteredPersons = this.persons;
			});
		}
		else if (this.selected === "contractors") {
			this.mapService.getContractorsList(this.dataParams).subscribe(result => {
				this.persons = result.data;
				this.filteredPersons = this.persons;
			});
		}
	}

	searchByAddress($event){
		this.filterValue = "";
		this.filterValue = $event.target.value.toLowerCase();
		this.switchClientsOrContractors();
		// this.filteredPersons = this.persons.filter(person => person.location.address.toLowerCase().includes(this.filterValue));
	}

	searchByName($event){
		this.filterValue = "";
		this.filterValue = $event.target.value.toLowerCase();
		this.switchClientsOrContractors();
		// this.filteredPersons = this.persons.filter(person => person.name.toLowerCase().includes(this.filterValue));
	}
}
