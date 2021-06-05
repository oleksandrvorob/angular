import { Component, OnInit, ChangeDetectorRef, ViewChild, OnChanges, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { PersonsService } from './../../../../persons/persons.service';
import { TranslationService } from '../../../../../../core/_base/layout';

import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'kt-existing-person',
  templateUrl: './existing-person.component.html',
  styleUrls: ['./existing-person.component.scss']
})
export class ExistingPersonComponent implements OnInit, OnChanges {

  personList: any = [];

  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective, { static: true })
  datatableElement: DataTableDirective;

  @Input() clientId;
  @Input() personExistIds;

  pIdsExist: any = [];
  cid: any = '';

  @Output() personIdsList = new EventEmitter();
  personIdList: any = [];

  constructor(
    private cd: ChangeDetectorRef,
    private personsService: PersonsService,
    private translate: TranslateService,
    private transServ: TranslationService,
    private route: ActivatedRoute,
    public router: Router,
  ) {
    let current_lng = this.transServ.getSelectedLanguage();
    this.translate.use(current_lng);
    const allParams = this.route.snapshot.params;
    if (allParams && allParams.clientId !== "") {
      this.clientId = allParams.clientId;
    }

  }

  ngOnInit() {
    this.dataTableCall();
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.clientId && this.clientId !== undefined) {
      this.cid = this.clientId;
    }
    if (this.personExistIds && this.personExistIds !== undefined) {
      this.pIdsExist = this.personExistIds;
    }
  }

  filterVal: any;

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

  addPersonToClient(personId: any = 0) {
    if (personId > 0) {
      // this.personIdList.push(personId);
      this.personIdsList.emit(personId);
    }
  }

  response: any;
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
        dataTablesParameters.search.pIdsExist = this.pIdsExist;
        // dataTablesParameters.search.date_fin=this.dateRange_fin;
        // dataTablesParameters.search.date_cls = this.dateRange_cls;

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
            // this.spinner.hide();
          } async: true
        });
      }
    };
  }
}
