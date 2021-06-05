import { Component, OnInit, Input, ViewChild, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientsService } from '../../../clients/clients.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { NgForm } from '@angular/forms';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { TranslationService } from '../../../../../core/_base/layout';
import { TranslateService } from '@ngx-translate/core';

import { CommonService } from './../../../../../services/common.service';
import { CompaniesService } from '../../../companies/companies.service';
import { DaterangePickerComponent } from 'ng2-daterangepicker';
import { DataTableDirective } from 'angular-datatables';
import { PersonsService } from '../../../persons/persons.service';
import { OrderService } from '../../../orders/order.service';

import { PriceHistoryComponent } from '../../../../../components/price-history/price-history.component';

@Component({
	selector: 'kt-special-tour',
	templateUrl: './special-tour.component.html',
	styleUrls: ['./special-tour.component.scss']
})
export class SpecialTourComponent implements OnInit {

	@Input() orderIdsList;
	@Input() isAddMode;
	@Input() clientId;

	modalReference: any;
	tourFrm: FormGroup;

	@ViewChild(DataTableDirective, { static: false })
	datatableElement: DataTableDirective;

	@ViewChild(DaterangePickerComponent, { static: false })
	public date_of_expiryPicker: DaterangePickerComponent;
	public valid_from: DaterangePickerComponent;
	public dayPicker: DaterangePickerComponent;

	public tour: any = {};
	editindex: any = null;
	orderId: any;
	tourList: any = [];

	clientOrderIdsList: any = [];
	orderExistIds: any = [];
	deletedOrderIds: any = [];
	priceBasisList: any = [];
	daysOfWeek: any = [];
	personList: any = [];
	billed_CompanyList: any = [];
	specialOrderTypeList: any = [];

	dtOptions: DataTables.Settings = {};
	dtContractorOptions: DataTables.Settings = {};
	response: any;
	filterVal: any;

	priceList: any;
	priceType: string;

	cli_pri: any;
	selectedRow: number = 0;

	constructor(private clientService: ClientsService,
		private route: ActivatedRoute,
		public router: Router, private fb: FormBuilder,
		private modalService: NgbModal,
		private translate: TranslateService, private transServ: TranslationService,
		private commonService: CommonService,
		private companiesService: CompaniesService,
		private orderService: OrderService,
		private cd: ChangeDetectorRef,
		private personsService: PersonsService,
		private dialog: MatDialog
	) {

		let current_lng = this.transServ.getSelectedLanguage();
		this.translate.use(current_lng);

		const allParams = this.route.snapshot.params;

		if (allParams && allParams.clientId !== "") {
			this.clientId = allParams.clientId;
		}

	}

	ngOnInit() {
		this.tourFrm = new FormGroup({
			order_number: new FormControl(''),
			description: new FormControl(''),
			client_price: new FormControl(''),
			day: new FormControl(''),
			once_per_billing: new FormControl(''),
			no_customer_invoice: new FormControl(''),
			order_type: new FormControl(''),
			contractor: new FormControl(''),
			comment: new FormControl(''),
			status: new FormControl(0),
			billed_company: new FormControl(''),
			fuel_surcharge: new FormControl('')
		});

		this.priceBasisList = this.commonService.priceBasis();
		this.specialOrderTypeList = this.commonService.specialOrderTypeList();
		this.valid_from = this.commonService.dateRancePickerOptions();
		this.dayPicker = this.commonService.dateRancePickerOptions();
		this.date_of_expiryPicker = this.commonService.dateRancePickerOptions();
		this.daysOfWeek = this.commonService.weekDays();

		this.dataTableCall();
		this.contractorsDatatable();
		this.getCompanyList();
	}

	ngOnChanges() {

		if (this.orderIdsList && this.orderIdsList !== undefined) {
			if (this.orderIdsList && this.orderIdsList.length > 0) {
				for (const pdid of this.orderIdsList) {
					this.orderExistIds.push(pdid.orderId);
				}
			}
		}

	}

	selectRow(index) {
		this.selectedRow = index;
	}

	getSpecialtour() {
		if (this.tourFrm.valid) {
			return this.tourFrm.value;
		} else {
			$("#tourFrm").addClass("validateFrm");
		}
	}

	submit(form: NgForm) {

		let frmdata = this.tourFrm.value;

		if (this.tourFrm.valid) {

			this.commonService.addeditOrder(frmdata).subscribe(resp => {
				if (resp) {
					this.clientOrderIdsList.push(resp.newOrderId);
					this.addedNewOrder();
				}
			});

			this.modalClose();

		} else {
			$("#tourFrm").addClass("validateFrm");
		}
	}

	receiveOrderIdsList($event) {
		if ($event && $event > 0) {
			this.clientOrderIdsList.push($event);
			this.addedNewOrder();
		}
	}


	addedNewOrder() {
		if (this.clientOrderIdsList.length > 0) {
			this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
				dtInstance.draw();
				this.modalClose();
			});
		}

	}

	modalClose() {
		this.editindex = null;
		this.modalReference.close();
		this.tourFrm.controls['order_number'].setValue('');
		this.tourFrm.controls['description'].setValue('');
		this.tourFrm.controls['client_price'].setValue('');
		this.tourFrm.controls['day'].setValue('');
		this.tourFrm.controls['once_per_billing'].setValue('');
		this.tourFrm.controls['no_customer_invoice'].setValue('');
		this.tourFrm.controls['order_type'].setValue('');
		this.tourFrm.controls['contractor'].setValue('');
		this.cli_pri = null;
	}


	addOrder(content) {
		this.newNumber();
		this.modalReference = this.modalService.open(content, { centered: true, size: 'lg', backdrop: 'static', windowClass: 'dark-theme' });
	}

	editClientOrder(orderId: any, content){
		this.orderId = orderId;
		this.clientOrderDetails();
		this.modalReference = this.modalService.open(content, { centered: true, size: 'lg', backdrop: 'static', windowClass: 'dark-theme' });
	}

	clientOrderDetails() {
		this.orderService.getOrderDetails({ orderId: this.orderId }).subscribe(result => {
			this.response = result.data;
			if (this.response) {
				this.tourFrm.controls['order_number'].setValue(this.response.order_number);
				this.tourFrm.controls['description'].setValue(this.response.description);
				this.tourFrm.controls['client_price'].setValue(this.response.client_price);
				this.tourFrm.controls['day'].setValue(this.response.day.split(","));
				this.tourFrm.controls['once_per_billing'].setValue(this.response.once_per_billing);
				this.tourFrm.controls['no_customer_invoice'].setValue(this.response.no_customer_invoice);
				this.tourFrm.controls['order_type'].setValue(this.response.order_type);
				this.tourFrm.controls['contractor'].setValue(this.response.contractor_name);
			}
		});
	}

	newNumber() {
		this.commonService.getNewOrderNo().subscribe(result => {
			this.orderId = result.neworderId;
			this.tourFrm.controls[`order_number`].setValue(result.neworderId);
		});
	}

	deleteTour(i) {
		let index = parseInt(i);
		if (index > -1) {
			this.tourList.splice(index, 1);
		}

	}

	deleteClientOrder(ccpid, pid) {

		let clientCOId = parseInt(ccpid);
		let clientOId = parseInt(pid);

		if (clientCOId > 0) {

			this.deletedOrderIds.push(clientOId);
			this.refeshTable();

		}
		else if (clientOId > 0) {
			var index = this.clientOrderIdsList.indexOf(clientOId);
			if (index > -1) {
				this.clientOrderIdsList.splice(index, 1);
				this.refeshTable();
			}
		}


	}

	getClientOrderData() {
		return { 'newOrderIds': this.clientOrderIdsList, 'deleteClientOrders': this.deletedOrderIds }
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

	async openDialog(event) {
		this.priceType = event.currentTarget.name;
		this.priceList = [];
		const dialogConfig = new MatDialogConfig();
		dialogConfig.disableClose = false;
		dialogConfig.autoFocus = false;
		dialogConfig.width = "auto";
		dialogConfig.height = "auto";
		dialogConfig.maxHeight = "80vh";
		dialogConfig.panelClass = ['dark-theme', 'custom-modalbox'];

		let params = {
			orderId: this.orderId,
			priceType: this.priceType
		};
		this.priceList = await this.commonService.getPriceList(params).toPromise();
		this.priceList = this.priceList.data.map(item => (
			{
			...item,
			valid_from: item.valid_from,
			date_of_expiry: item.date_of_expiry
			})
		);
		dialogConfig.data = {
			priceList: this.priceList
		};

		let dialogRef = this.dialog.open(PriceHistoryComponent, dialogConfig);

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				let priceHistoryData = {
					orderId: this.orderId,
					entityId: this.clientId,
					priceType: this.priceType,
					insert: result,
					update: [],
					deletedIds: []
				};

				this.commonService.addNewPriceHistory(priceHistoryData)
					.subscribe((res: any) => {
					console.log("priceHistory result: ", res);
				});
			}
		});
	}

	public dataTableCall() {

		this.dtOptions = {
			pagingType: 'full_numbers',
			pageLength: 10,
			responsive: true,
			searching: false,
			lengthChange: false,
			serverSide: true,
			processing: true,
			order: [],
			columnDefs: [
				{
					"targets": 'nosort',
					"orderable": false
				}
			],
			language: this.transServ.dataTableLang(),
			ajax: (dataTablesParameters: any, callback) => {

				dataTablesParameters.search.value = this.filterVal;
				dataTablesParameters.search.clientId = this.clientId;
				dataTablesParameters.search.newOrderIds = this.clientOrderIdsList;
				dataTablesParameters.search.deletedOrderIds = this.deletedOrderIds;
				this.clientService.getOrderList(dataTablesParameters).subscribe(resp => {
					this.response = resp;
					if (this.response && this.response.data) {
						this.tourList = this.response.data;
						this.cd.markForCheck();
						callback({
							recordsTotal: this.response.recordsTotal,
							recordsFiltered: this.response.recordsFiltered,
							data: []
						});

					}

				});
			}
		};
	}


	public contractorsDatatable() {
		this.dtContractorOptions = {
			pagingType: 'full_numbers',
			pageLength: 10,
			responsive: true,
			searching: false,
			lengthChange: false,
			serverSide: true,
			processing: true,
			order: [],
			columnDefs: [
				{
					"targets": 'nosort',
					"orderable": false
				}
			],
			language: this.transServ.dataTableLang(),
			ajax: (dataTablesParameters: any, callback) => {

				dataTablesParameters.search.value = this.filterVal;
				dataTablesParameters.search.clientId = this.clientId;
				dataTablesParameters.search.newOrderIds = this.clientOrderIdsList;
				dataTablesParameters.search.deletedOrderIds = this.deletedOrderIds;

				this.personsService.getPersonList(dataTablesParameters).subscribe(resp => {
					this.response = resp;
					if (this.response && this.response.data) {
						this.personList = this.response.data;
						this.cd.markForCheck();
						callback({
							recordsTotal: this.response.recordsTotal,
							recordsFiltered: this.response.recordsFiltered,
							data: []
						});
					} async: true

				});
			}
		};
	}

	refeshTable() {
		this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
			dtInstance.draw();
		});
	}

	selectPerson(item) {
		this.tourFrm.controls['contractor'].setValue(item.first_name);
	}

	onClickTable(evt) {
		const parentId = evt.target.parentNode.id;
		if (parentId !== 'contractor_person_Item') evt.stopPropagation();
	}

	public getCompanyList() {
		this.companiesService.getCompaniessList({}).subscribe(response => {
			this.billed_CompanyList = response.data;
		});
	}
}
