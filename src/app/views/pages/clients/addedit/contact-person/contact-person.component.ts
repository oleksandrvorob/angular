import { Component, OnInit, ViewChild, Input, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { CustomerModel } from '../../../../../core/e-commerce';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientsService } from '../../clients.service';
import { TranslationService } from '../../../../../core/_base/layout';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../../../../../services/common.service';
import { TranslateService } from '@ngx-translate/core';
import * as $ from 'jquery';

@Component({
	selector: 'kt-contact-person',
	templateUrl: './contact-person.component.html',
	styleUrls: ['./contact-person.component.scss'],
	encapsulation: ViewEncapsulation.None,
})
export class ContactPersonComponent implements OnInit {
	@ViewChild("contactPersonForm", { static: false }) contperFrm: NgForm;
	clientPersonIdsList: any = [];
	personList: any = [];
	dtOptions: DataTables.Settings = {};
	@ViewChild(DataTableDirective, { static: true })
	datatableElement: DataTableDirective;

    clientId: any ;
	contactPersons: any;
	selection = new SelectionModel<CustomerModel>(true, []);
	name: string;
	modalReference: any;
    contactPersonId = '';
	public contactPerson: any = { };
	editindex: any = null;
	@Input() presonIdsList;
	contactPersonFrm: FormGroup;
	showForm: any = true;
	salutationList: any = [];
	person_type_list: any = [];
	deletedPersonIds: any = [];
	personIdsExist: any = [];
	selectedRow: number = 0;
	filterVal: any;
	response: any ;

	constructor(
		private cd: ChangeDetectorRef,
		public dialog: MatDialog,
		private route: ActivatedRoute,
		private router: Router, private fb: FormBuilder,
		private clientsService: ClientsService,
		private commonService: CommonService,
		private modalService: NgbModal, private transServ: TranslationService,
		private translate: TranslateService,
	) {

		// this.route.params.subscribe((params) => {
		// 	this.clientId = params.clientId;
		// });

		const allParams = this.route.snapshot.params;

		if (allParams && allParams.clientId !== "") {
			this.clientId = allParams.clientId;
		}

	}

	ngOnInit() {
		this.contactPersonFrm = new FormGroup({
			salutation: new FormControl(''),
			first_name: new FormControl(''),
			surname: new FormControl(''),
			position: new FormControl(''),
			department: new FormControl(''),
			phone: new FormControl(''),
			mobile_number: new FormControl(''),
			fax: new FormControl(''),
			email: new FormControl(''),
			type: new FormControl(''),
			comment: new FormControl(''),
			status: new FormControl(0),
		});

		this.salutationList = this.commonService.salutationList();
		this.person_type_list = this.commonService.personTypeList();
		this.dataTableCall();
	}

	ngOnChanges() {
		if (this.presonIdsList && this.presonIdsList !== undefined) {

			if (this.presonIdsList && this.presonIdsList.length > 0) {
				for (const pdid of this.presonIdsList) {
					this.personIdsExist.push(pdid.personId);
				}
			}
			// this.presonIds = this.presonIdsList;
		}

	}
	ngOnDestroy() { }

	submit(form: NgForm) {
		// this.contactPersonForm.onSubmit(null);
		// let data =  form.value;
		let frmdata = this.contactPersonFrm.value;
		if (this.contactPersonFrm.valid) {
			this.contactPersonFrm.reset();
			this.commonService.addeditPerson(frmdata).subscribe(resp => {
				if (resp) {
					this.clientPersonIdsList.push(resp.newPersonId);
					this.addedNewPerson();
				}
			});
			this.modalClose();
		} else {
			$("#contactPersonFrm").addClass("validateFrm");
		}
	}

	modalClose() {
		this.editindex = null;
		this.modalReference.close();
		this.contactPerson = {};
		this.showForm = true;
		// this.setFormData();
	}

	openModal(content) {
		this.modalReference = this.modalService.open(content, { centered: true, size: 'lg', backdrop: 'static', windowClass: 'dark-theme' });
	}

	deleteContactPerson(ccpid, pid) {
		let clientcPId = parseInt(ccpid);
		let clientPId = parseInt(pid);
		if (clientcPId > 0) {
			this.deletedPersonIds.push(clientPId);
			// this.clientsService.deleteClientPerson({clients_contact_personId : clientcPId }).subscribe(result => {
			// 	this.refeshTable();
			// });
			this.refeshTable();
		}
		else if (clientPId > 0) {
			var index = this.clientPersonIdsList.indexOf(clientPId);

			if (index > -1) {
				this.clientPersonIdsList.splice(index, 1);
				this.refeshTable();
			}
		}

	}

	getClientPersonData() {
		return { 'newPersonIds': this.clientPersonIdsList, 'deleteClientPersons': this.deletedPersonIds }
	}


	changeFrm($event) {
		let formName = $event.target.value;
		if (formName == 'add') {
			this.showForm = true;
		} else {
			this.showForm = false;
		}
	}

	refeshTable() {
		this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
			dtInstance.draw();
		});
	}


	receivePersonIdsList($event) {
		if ($event && $event > 0) {
			this.clientPersonIdsList.push($event);
			this.addedNewPerson();
		}
	}

	addedNewPerson() {
		if (this.clientPersonIdsList.length > 0) {
			this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
				dtInstance.draw();
				this.modalClose();
			});
		}
	}

	selectRow(index) {
		this.selectedRow = index;
	}

	filterData($event) {
	  this.filterVal = "";
	  let value = $event.target.value;
	  if (value) {
		this.filterVal = value;
	  }

	  this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
		dtInstance.draw();
	  });

	}

	public dataTableCall(){

	  this.dtOptions = {
		pagingType: 'full_numbers',
		pageLength: 10,
		responsive: true,
		searching: false,
		lengthChange: false,
		serverSide: true,
		processing: true,
		order:[],
		columnDefs: [
			{
			  "targets": 'nosort',
			  "orderable": false
			}
		],
		language: this.transServ.dataTableLang(),
		ajax: (dataTablesParameters: any, callback) => {

			dataTablesParameters.search.value=this.filterVal;
			dataTablesParameters.search.clientId= this.clientId;
			dataTablesParameters.search.newPersonIds= this.clientPersonIdsList;
			dataTablesParameters.search.deletedPersonIds =this.deletedPersonIds;
			this.clientsService.getPersonList(dataTablesParameters).subscribe(resp => {
			  this.response = resp;
			  if(this.response && this.response.data){
				this.personList = this.response.data;
				  this.cd.markForCheck();
				  callback({
					recordsTotal: this.response.recordsTotal,
					recordsFiltered: this.response.recordsFiltered,
					data: []
				  });

				  // this.spinner.hide();
			  }async: true

			});
		}
	  };
	}

	changePhoneNumber($event) {
		if ($event.target.name === 'phone' && $event.target.value === '') {
			this.contactPersonFrm.controls['phone'].setValue('+49');
		}
		if ($event.target.name === 'mobile_number' && $event.target.value === '') {
			this.contactPersonFrm.controls['mobile_number'].setValue('+49');
		}
	}

	emptyValue($event) {
		if ($event.target.name === 'phone' && $event.target.value === '+49') {
			this.contactPersonFrm.controls['phone'].setValue('');
			$event.target.value = '';
		}
		if ($event.target.name === 'mobile_number' && $event.target.value === '+49') {
			this.contactPersonFrm.controls['mobile_number'].setValue('');
			$event.target.value = '';
		}
	}

	goToPerson(id) {
		this.router.navigate([`/persons/addedit/${id}`]);
	}
}
