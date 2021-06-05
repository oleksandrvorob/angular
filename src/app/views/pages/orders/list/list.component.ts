import { Component, OnDestroy, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { LayoutUtilsService } from '../../../../core/_base/crud';
import { Router } from '@angular/router';

import { OrderService } from './../order.service';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { DataTableDirective } from 'angular-datatables';
import { TranslationService, DatatableColumnModel } from '../../../../core/_base/layout';

class Tdata { }

@Component({
  selector: 'kt-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  dtOptions: any = {};

  filterVal: any;
  response: any;
  columns: DatatableColumnModel[];

  tourList = [];
  veiwInactive: boolean = false;
  totalAmount: number = 0;
  startRecord: number = 0;
  endRecord: number = 0;
  selectedRow: number = 0;
  istoggleViewChanged: boolean = true;
  @ViewChild(DataTableDirective, { static: true })
  datatableElement: DataTableDirective;

  constructor(public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private http: HttpClient,
    public router: Router, private cd: ChangeDetectorRef,
    private orderService: OrderService,
    private translate: TranslateService, private transServ: TranslationService) {

    let current_lng = this.transServ.getSelectedLanguage();
    this.translate.use(current_lng);

  }

  ngOnInit() {
    this.dataTableCall();
    this.columns = [
      {
        name: 'company_name',
        search: {
          value: ''
        }
      },
      {
        name: 'order_number',
        search: {
          value: ''
        }
      },
      {
        name: 'description',
        search: {
          value: ''
        }
      },
      {
        name: 'client_number',
        search: {
          value: ''
        }
      },
      {
        name: 'client_name',
        search: {
          value: ''
        }
      },
      {
        name: 'client_city',
        search: {
          value: ''
        }
      },
      {
        name: 'contractor_number',
        search: {
          value: ''
        }
      },
      {
        name: 'contractor_name',
        search: {
          value: ''
        }
      },
      {
        name: 'contractor_price',
        search: {
          value: ''
        }
      },
      {
        name: 'client_price',
        search: {
          value: ''
        }
      }
    ];
  }

  filterData($event) {
    this.filterVal = '';

    // global search

    if ($event.target.name === 'global_search') {
      this.filterVal = $event.target.value;
    } else {

      // individual column search

      this.columns.forEach(column => {
        if (column.name === $event.target.name) {
          column.search.value = $event.target.value;
        }
      });
    }

    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.page(1);
      dtInstance.draw();
    });
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
        boundaryScale: 1
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
        dataTablesParameters.columns = this.columns;

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
        this.orderService.getOrderList(dataTablesParameters).subscribe(resp => {
          this.response = resp;
          if (this.response && this.response.data) {
            this.tourList = this.response.data;
            this.cd.markForCheck();
            callback({
              recordsTotal: this.response.recordsTotal,
              recordsFiltered: this.response.recordsFiltered,
              data: []
            });
            this.totalAmount = this.response.recordsTotal;
            this.startRecord = dataTablesParameters.start;
            if (this.totalAmount === 0) {
              this.startRecord = 0;
              this.endRecord = 0;
            } else {
              if (this.response.draw === 1) {
                if (dataTablesParameters.length > this.totalAmount) {
                  this.endRecord = this.totalAmount;
                } else {
                  this.endRecord = dataTablesParameters.start + 20;
                }
              } else {
                this.endRecord = dataTablesParameters.start + dataTablesParameters.length;
              }
            }
            if (this.endRecord < this.totalAmount || this.totalAmount === 0 || dataTablesParameters.draw === 1) {
              $('.dataTables_scrollBody thead').css('visibility', 'collapse');
            } else {
              $('.dataTables_scrollBody thead').css('visibility', 'unset');
            }
            // this.spinner.hide();
          }

        });
      }
    };
  }

  addNewTour() {
    this.router.navigate(['orders/addedit']);
  }

  editTour(id) {
    this.router.navigate(['orders/addedit/' + id]);
  }


  deleteTour(tourId: any) {

    this.orderService.deleteOrder({ orderId: tourId }).subscribe((result) => {
      this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.draw();
      });
    },
      err => {

      });

  }

}
