import { Component, OnInit, Input , ViewChild } from '@angular/core';

import {ActivatedRoute, Router} from '@angular/router';
import { ClientsService } from '../../../clients/clients.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import {NgForm} from '@angular/forms';
import { FormBuilder, FormGroup, FormControl , Validators } from '@angular/forms';

import { TranslationService } from '../../../../../core/_base/layout';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'kt-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.scss']
})
export class TourComponent implements OnInit {

	modalReference : any;

	public tour: any = { };
	editindex : any = null;

	// @ViewChild("createTourForm") tourFrm: NgForm;
	tourList : any = [];
	price_basis_data: any = [];

	@Input() tourLists;

	tourFrm  : FormGroup;

  	constructor(private userService: ClientsService,
				private route: ActivatedRoute,
			    public router: Router , private fb: FormBuilder,
				private modalService: NgbModal,
				private translate: TranslateService, private transServ : TranslationService
				)
	{

		let current_lng = this.transServ.getSelectedLanguage();
		this.translate.use(current_lng);

	}

	ngOnInit() {
		let current_lng = this.transServ.getSelectedLanguage();
		this.tourFrm = this.fb.group({
			'tour_no': ['' ],
			'description' : [''   ],
			'client_award': ['' ],
			'price_basis': ['' ],
			'day' : ['' ],
			'tour_type' : [''],
			'remarks' : [''],
			'valid_from' : [''],
			'date_of_expiry' : [''],
			'power_partners' : [''],
			'ltp_prize_week' : [''],
			'ltp_prize_we' : ['']
		});

		if(current_lng === "en"){
			this.price_basis_data = [
				{name: 'Per day', value: 0},
				{name: 'Per stop', value: 1},
				{name: 'Per hour', value: 2},
				{name: 'Per kilometer', value: 3},
			  ];
		}else if(current_lng === "ge"){
			this.price_basis_data = [
				{name: 'Pro Tag', value: 0},
				{name: 'Pro Stopp', value: 1},
				{name: 'Pro Stunde', value: 2},
				{name: 'Pro Kilometer', value: 3},
			  ];
		}
	}

	ngOnChanges() {
		// console.log(this.basicData);
		if(this.tourLists && this.tourLists!==undefined){
			this.tourList = this.tourLists;
		}
	}

    submit(form: NgForm){
		// this.contactPersonForm.onSubmit(null);
		// console.log(form.value);

		let frmdata = this.tourFrm.value;

		if(this.tourFrm.valid){
			// console.log(frmdata);

			if(this.editindex!==null){
				this.tourList[this.editindex] = frmdata;
			}else{

				this.tourList.push(frmdata);
			}

			this.modalClose();

		}else{
			$("#tourFrm").addClass("validateFrm");
		}


		// let data =  form.value;
		// form.reset();
		// if(this.editindex!==null){
		// 	this.tourList[this.editindex] = data;
		// }else{
		// 	this.tourList.push(data);
		// }

		// console.log(this.tourList);
		// this.modalClose();

	}

    modalClose(){
		this.editindex = null;
		this.modalReference.close();
		this.tour = {};
		this.setFormData();
	}


  addTour(content) {
    this.modalReference = this.modalService.open(content, { centered: true , size: 'lg' , backdrop : 'static' });
  }

    editTour(content , i){
		this.editindex = i;
		this.tour = JSON.parse(JSON.stringify(this.tourList[i]));
		this.addTour(content);
		this.setFormData();
	}

	deleteTour(i){
		let index = parseInt(i);
		if (index > -1) {
			this.tourList.splice(index, 1);
		}

	}

	gettourList(){
		return this.tourList;
	}

	setFormData(){

		this.tourFrm.controls[`tour_no`].setValue(this.tour.tour_no);
		this.tourFrm.controls[`description`].setValue(this.tour.description);
		this.tourFrm.controls[`client_award`].setValue(this.tour.client_award);
		this.tourFrm.controls[`price_basis`].setValue(this.tour.price_basis);
		this.tourFrm.controls[`day`].setValue(this.tour.day);
		this.tourFrm.controls[`tour_type`].setValue(this.tour.tour_type);
		this.tourFrm.controls[`remarks`].setValue(this.tour.remarks);
		this.tourFrm.controls[`valid_from`].setValue(this.tour.valid_from);
		this.tourFrm.controls[`date_of_expiry`].setValue(this.tour.date_of_expiry);
		this.tourFrm.controls[`power_partners`].setValue(this.tour.power_partners);
		this.tourFrm.controls[`ltp_prize_week`].setValue(this.tour.ltp_prize_week);
		this.tourFrm.controls[`ltp_prize_we`].setValue(this.tour.ltp_prize_we);

	}

}
