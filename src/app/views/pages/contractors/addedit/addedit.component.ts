import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { first } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";

import { ContractorsService } from "./../contractors.service";
import { NavbarActionsService } from "./../../../../services/navbar-actions.service";

import { OverviewComponent } from "./overview/overview.component";
import { CommentsComponent } from "./comments/comments.component";
import { ContactPersonComponent } from "./contact-person/contact-person.component";
import { OrderComponent } from "./order/order.component";
import { SpecialTourComponent } from "./special-tour/special-tour.component";
import { DialogComponent } from "../../../../components/dialog/dialog.component";

import { ActivatedRoute, Router } from "@angular/router";

import { TranslationService } from "../../../../core/_base/layout";
import { TranslateService } from "@ngx-translate/core";

import { Location } from "@angular/common";
import { CommonService } from "../../../../services/common.service";

@Component({
	selector: "kt-addedit",
	templateUrl: "./addedit.component.html",
	styleUrls: ["./addedit.component.scss"]
})
export class AddeditComponent implements OnInit {
	@ViewChild(OverviewComponent, { static: true }) overview: OverviewComponent;
	@ViewChild(ContactPersonComponent, { static: true })
	persionComp: ContactPersonComponent;
	@ViewChild(CommentsComponent, { static: true })
	commentComp: CommentsComponent;
	@ViewChild(OrderComponent, { static: true }) orderComp: OrderComponent;
	@ViewChild(SpecialTourComponent, { static: true })
	specialtourComp: SpecialTourComponent;

	contractorId: any = 0;
	basicData: any;
	comments: any;
	tourList: any;
	specialtourData: any;
	personIdsList: any;
	isDisabled: boolean = true;
	isUpdating: boolean = false;
	uploadedFile: any;
	fileName: any;
	fileKeyName: any;
	navBarSubscription: any;
	isAddMode: boolean = true;

	constructor(
		private route: ActivatedRoute,
		private contractorsService: ContractorsService,
		public router: Router,
		private translate: TranslateService,
		private transServ: TranslationService,
		private _location: Location,
		public dialog: MatDialog,
		private cd: ChangeDetectorRef,
		private navBarActionService: NavbarActionsService,
		private commonService: CommonService
	) {
		let current_lng = this.transServ.getSelectedLanguage();
		this.translate.use(current_lng);
	}

	ngOnInit() {
		const allParams = this.route.snapshot.params;
		if (allParams && allParams.contractorId !== undefined)
			this.contractorId = allParams.contractorId;

		if (this.contractorId && this.contractorId > 0) {
			this.isAddMode = false;
			this.contractorDetails();
		}

		this.navBarActionService.changeActionName("");
		this.navBarSubscription = this.navBarActionService.action.subscribe(
			actionName => {
				if (actionName === "save") this.submitFrm();
				if (actionName === "cancel") this.cancel();
			}
		);

		this.navBarActionService.changeDisabledSaveStatus(this.isDisabled);
	}

	response: any;

	contractorDetails() {
		this.contractorsService
			.getContractorDetails({ contractorId: this.contractorId })
			.subscribe(result => {
				// this.router.navigate([`clients`]);
				this.response = result.data;
				this.basicData = this.response.basicData;
				this.comments = this.basicData.comment;
				this.personIdsList = this.response.personIdsList;
				this.tourList = this.response.tourList;
				this.specialtourData = this.response.specialtourData[0];
			});
	}

	submitFrm() {
		this.isUpdating = true;
		let basicData = this.overview.formData();
		let cotractorPersonData = this.persionComp.getContractorPersonData();

		let personList = [];
		let deleteContractorPersons = [];
		if (cotractorPersonData !== undefined) {
			personList = cotractorPersonData.newPersonIds;
			deleteContractorPersons =
				cotractorPersonData.deleteContractorPersons;
		}

		let comments = this.commentComp.getComment();
		let contractorOrderData = this.orderComp.getContractorOrderData();

		let orderDataList = [];
		let deleteContractorOrders = [];
		let priceHistoryList = [];
		if (contractorOrderData !== undefined) {
			orderDataList = contractorOrderData.newOrderIds;
			deleteContractorOrders = contractorOrderData.deleteContractorOrders;
			priceHistoryList = contractorOrderData.priceHistoryList;
		}

		let specialClientOrderData: any = this.specialtourComp.getContractorOrderData();

		let specialOrderDataList: any = [];
		let specialDeleteClientOrders: any = [];
		if (specialClientOrderData !== undefined) {
			specialOrderDataList = specialClientOrderData.newOrderIds;
			specialDeleteClientOrders =
				specialClientOrderData.deleteClientOrders;
		}

		let formData = new FormData();
		if (
			basicData !== false &&
			comments !== false &&
			specialClientOrderData !== false
		) {
			const file: File = basicData["contract_file"];
			if (file) {
				formData.append("contractFiles", file, file.name);
			}

			//convert date
			if (basicData["contract_start_date"]) {
				basicData[
					"contract_start_date"
				] = this.commonService.convertDateforISO(
					basicData["contract_start_date"]
				);
			}

			if (basicData["contract_end_date"]) {
				basicData[
					"contract_end_date"
				] = this.commonService.convertDateforISO(
					basicData["contract_end_date"]
				);
			}

			if (basicData["commercial_date"]) {
				basicData[
					"commercial_date"
				] = this.commonService.convertDateforISO(
					basicData["commercial_date"]
				);
			}

			formData.append("basicData", JSON.stringify(basicData));
			formData.append("personList", JSON.stringify(personList));
			formData.append(
				"deleteContractorPersons",
				JSON.stringify(deleteContractorPersons)
			);
			formData.append("comment", comments.comment);
			formData.append("orderDataList", JSON.stringify(orderDataList));
			formData.append(
				"deleteContractorOrders",
				JSON.stringify(deleteContractorOrders)
			);
			formData.append(
				"specialorderData",
				JSON.stringify(specialOrderDataList)
			);

			formData.append(
				"priceHistory",
				JSON.stringify(priceHistoryList)
			);

			this.contractorsService
				.addeditContractor(formData)
				.subscribe((res: any) => {
					this.uploadedFile = res.uploadedFile;
					this.fileName = res.fileName;
					this.fileKeyName = res.fileKeyName;
					this.cd.markForCheck();
					this.overview.ngOnInit();
					this.persionComp.ngOnInit();
					this.commentComp.ngOnInit();
					this.orderComp.ngOnInit();
					this.specialtourComp.ngOnInit();
					this.router.navigate([`contractors`]);
				});
		}
	}

	cancel() {
		this._location.back();
	}

	setDisableStatus(isDisabled: boolean) {
		this.isDisabled = isDisabled;
		this.navBarActionService.changeDisabledSaveStatus(this.isDisabled);
	}

	getNewContractorId(contractorId: any){
		this.contractorId = contractorId;
	}

	canDeactivate(): Observable<boolean> | boolean {
		if (!this.isUpdating && !this.isDisabled) {
			this.isUpdating = false;
			const dialogRef = this.dialog.open(DialogComponent, {
				panelClass: ['dark-theme', 'custom-modalbox']
			});

			return dialogRef.afterClosed().pipe(
				map(result => {
					if (result === "save") {
						this.submitFrm();
						return true;
					} else if (result === "discard") {
						return true;
					} else if (result === "cancel") {
						return false;
					}
				}),
				first()
			);
		}
		return true;
	}

	/**
	 * On destroy
	 */
	ngOnDestroy(): void {
		this.navBarActionService.changeActionName("");
		this.navBarSubscription.unsubscribe();
	}
}
