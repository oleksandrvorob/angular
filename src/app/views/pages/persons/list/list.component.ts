import { Component, OnDestroy, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { LayoutUtilsService } from '../../../../core/_base/crud';
import { Router } from '@angular/router';

import { PersonsService } from './../persons.service';
import { TranslationService } from '../../../../core/_base/layout';

import { DataTableDirective } from 'angular-datatables';

class Tdata { }

@Component({
  selector: 'kt-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  personList: any = [];
  personId: any;
  response: any;
  filterVal: any;
  dtOptions: any = {};
  selectedRow: number = 0;

  veiwInactive: boolean = false;
  totalAmount: number = 0;
  startRecord: number = 0;
  endRecord: number = 0;
  istoggleViewChanged: boolean = true;
  @ViewChild(DataTableDirective, { static: true })
  datatableElement: DataTableDirective;

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public router: Router,
    private cd: ChangeDetectorRef,
    private personsService: PersonsService,
    private translate: TranslateService,
    private transServ: TranslationService
  ) {
    let current_lng = this.transServ.getSelectedLanguage();
    this.translate.use(current_lng);
  }

  ngOnInit() {
    this.dataTableCall();
  }

  addNewPerson() {
    this.router.navigate(['persons/addedit']);
  }

  editPerson(id) {
    this.router.navigate(['persons/addedit/' + id]);
  }

  deletePerson(personId: any) {

    this.personsService.deletePerson({ 'personId': personId }).subscribe((result) => {

      this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.draw();
        this.cd.markForCheck();
      });


    },
      err => {

      });

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
    // console.log($event);

  }

  onCheckViewAll(event) {
    this.istoggleViewChanged = true;
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  selectRow(index) {
	this.selectedRow = index;
  }

  public dataTableCall() {

    this.dtOptions = {
      serverSide: true,
      processing: true,
      scrollY: "50vh",
      scroller: {
        loadingIndicator: true,
        boundaryScale: 0.75
      },
      ordering: true,
      searching: false,
      order: [],
      columnDefs: [
        {
          "targets": 'nosort',
          "orderable": false,
        }
      ],
      dom: 'Bfrti',
      language: this.transServ.dataTableLang(),
      ajax: (dataTablesParameters: any, callback) => {

        dataTablesParameters.search.value = this.filterVal;

        // for deleting api
        if (dataTablesParameters.length <= 2) {
          dataTablesParameters.length = 12;
        }

        //check if toggleView
        if (this.istoggleViewChanged) {
          dataTablesParameters.draw = 1;
          this.istoggleViewChanged = false;
        }
        // dataTablesParameters.search.closed_files=this.dateRange;
        // dataTablesParameters.search.date_fin=this.dateRange_fin;
        // dataTablesParameters.search.date_cls = this.dateRange_cls;
        dataTablesParameters.status = this.veiwInactive ? 0 : 1;
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
            this.totalAmount = this.response.recordsTotal;
            this.startRecord = dataTablesParameters.start;
            if (this.totalAmount == 0) {
              this.startRecord = 0;
              this.endRecord = 0;
            }
            else {
              if (this.response.draw == 1) {
                if (dataTablesParameters.length > this.totalAmount)
                  this.endRecord = this.totalAmount;
                else
                  this.endRecord = dataTablesParameters.start + 20;
              }
              else
                this.endRecord = dataTablesParameters.start + dataTablesParameters.length;
            }
            $('.dataTables_scrollBody thead').css('visibility', 'collapse');

            // this.spinner.hide();
          }
        });
      }
    };
  }

}
