import { Component, OnDestroy, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { LayoutUtilsService } from '../../../../core/_base/crud';
import { Router } from '@angular/router';

import { ArticleService } from '../article.service';

import { DataTableDirective } from 'angular-datatables';
import { TranslationService } from '../../../../core/_base/layout';

class Tdata {

}

@Component({
  selector: 'kt-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  articleList: any = [];
  filterVal: any;
  response: any;

  dtOptions: any = {};
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
    public router: Router,
    private cd: ChangeDetectorRef,
    private articleService: ArticleService,
    private transServ: TranslationService,
    private translate: TranslateService
  ) {
    let current_lng = this.transServ.getSelectedLanguage();
    this.translate.use(current_lng);
  }

  ngOnInit() {
    this.cd.markForCheck();
    this.dataTableCall();
  }

  public getArticleList() {
    this.articleService.getArticleList({}).subscribe((result) => {
      this.articleList = result.data;
      this.cd.markForCheck();
    },
      err => {

      });
  }

  addNewArticle() {
    this.router.navigate(['article/addedit']);
    // this.dialog.open(DialogDataExampleDialog);
  }

  editArticle(articleId: any) {
    this.router.navigate(['article/addedit/' + articleId]);
  }

  deleteArticle(articleId: any) {

    this.articleService.deleteArticle({ articleId: articleId }).subscribe((result) => {
      this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.draw();
      });

    },
      err => {

      });
  }

  get_filterData($event) {
    this.filterVal = "";
    let value = $event.target.value;
    if (value) {
      this.filterVal = value;
    }
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
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
        boundaryScale: 0.5
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

        dataTablesParameters.status = this.veiwInactive ? 0 : 1;
        // dataTablesParameters.search.closed_files=this.dateRange;
        // dataTablesParameters.search.date_fin=this.dateRange_fin;
        // dataTablesParameters.search.date_cls = this.dateRange_cls;

        this.articleService.getArticleList(dataTablesParameters).subscribe(resp => {
          this.response = resp;
          if (this.response && this.response.data) {
            this.articleList = this.response.data;
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
              else {
                this.endRecord = dataTablesParameters.start + dataTablesParameters.length;
              }

            }

            // this.spinner.hide();
          } async: true
          if (this.endRecord < this.totalAmount || this.totalAmount == 0 || dataTablesParameters.draw == 1)
            $('.dataTables_scrollBody thead').css('visibility', 'collapse');
          else
            $('.dataTables_scrollBody thead').css('visibility', 'unset');
        });
      }
    };
  }


}
