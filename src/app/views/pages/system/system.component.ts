import { HttpClient, HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';

import { Component, OnInit , ViewChild, ChangeDetectorRef } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { ActivatedRoute, Router } from '@angular/router';

import { TranslationService } from '../../../core/_base/layout';
import { Location } from '@angular/common';

@Component({
	selector: 'kt-system',
	templateUrl: './system.component.html',
	styleUrls: ['./system.component.scss']
  })
export class SystemComponent implements OnInit {

	constructor(private route: ActivatedRoute,
		private translate: TranslateService, private transServ : TranslationService,
		public router: Router,private _location: Location, private http: HttpClient, private cd: ChangeDetectorRef) {
		  let current_lng = this.transServ.getSelectedLanguage();
		  this.translate.use(current_lng);
	  }

  ngOnInit() {
  }

}
