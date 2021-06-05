import {Component, OnDestroy, OnInit, ChangeDetectionStrategy, ChangeDetectorRef , ViewChild} from '@angular/core';

@Component({
  selector: 'kt-clients',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnDestroy , OnInit {


	constructor() { }

	ngOnInit() {
		
	}


	ngOnDestroy() {
	}


}
