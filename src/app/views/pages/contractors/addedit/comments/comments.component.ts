import {Component, EventEmitter, OnInit, Input, Output} from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { TranslationService } from '../../../../../core/_base/layout';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'kt-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent  {

	commentFrm : FormGroup;

	@Input() comments;
	@Output() changeFormData = new EventEmitter<boolean>();

  	constructor(private fb: FormBuilder,  private translate: TranslateService, private transServ : TranslationService) {

		let current_lng = this.transServ.getSelectedLanguage();
		this.translate.use(current_lng);
	}

	ngOnInit() {

		this.changeFormData.emit(true);
		this.commentFrm = this.fb.group({
			'comment': ['']
		});

		this.commentFrm.valueChanges.subscribe(val => {
			if(val.comment !== ""){
				this.changeFormData.emit(false);
			}else {
				this.changeFormData.emit(true);
			}
		});

	  }

	ngOnChanges() {
		if(this.comments && this.comments!==undefined){
			this.commentFrm.controls['comment'].setValue(this.comments);
		}
	  }

	getComment(){
		return this.commentFrm.value;
	}

}
