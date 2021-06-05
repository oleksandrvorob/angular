import { Component, Input, Host, OnInit } from '@angular/core';
import { CheckboxGroupComponent } from '../checkbox-group/checkbox-group.component';

@Component({
  selector: 'kt-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent {

	@Input() value: any;
	//isChecked: boolean = false;
    constructor(@Host() private checkboxGroup: CheckboxGroupComponent) {
	}
	
	// ngOnInit(){
	// 	this.checkStatus();
	// }

	toggleCheck() {
		this.checkboxGroup.addOrRemove(this.value);
	}

	// checkStatus() {
	// 	console.log('containes', this.checkboxGroup.contains(this.value));
	// 	this.isChecked = this.checkboxGroup.contains(this.value);
	// }

	isChecked(){
		return this.checkboxGroup.contains(this.value);
	}

}
