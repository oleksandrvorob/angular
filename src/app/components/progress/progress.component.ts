import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'kt-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit {

	@Input() progress;

  constructor() { }

  ngOnInit() {
  }

}
