import { Component, OnInit, ChangeDetectorRef, ViewChild , OnChanges, SimpleChanges ,  Input , EventEmitter , Output } from '@angular/core';

import {ActivatedRoute, Router} from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { OrderService } from './../../../../orders/order.service';
import { TranslationService } from '../../../../../../core/_base/layout';

import { DataTableDirective } from 'angular-datatables';


@Component({
  selector: 'kt-existing-order',
  templateUrl: './existing-order.component.html',
  styleUrls: ['./existing-order.component.scss']
})
export class ExistingOrderComponent implements OnInit {

    tourList: any = [];
    ordersIdList : any = [];
    dtOptions: DataTables.Settings = {};
    @ViewChild(DataTableDirective, { static: true })
    datatableElement: DataTableDirective;

    @Input() clientId;
    @Input() orderExistIds;

    oIdsExist : any =[];
    cid : any = '';

	@Output() orderIdsList = new EventEmitter();
	personIdList : any = [];

    constructor(private cd: ChangeDetectorRef, private orderService: OrderService,
        private translate: TranslateService, private transServ: TranslationService
        , private route: ActivatedRoute) {

            let current_lng = this.transServ.getSelectedLanguage();
            this.translate.use(current_lng);

            const allParams = this.route.snapshot.params;

            if(allParams && allParams.clientId !==""){
              this.clientId = allParams.clientId;
            }

        }


      ngOnInit() {

          this.dataTableCall();
          this.cd.markForCheck();

          this.cd.detectChanges();

      }

      ngOnChanges(changes: SimpleChanges ) : void {
        if(this.clientId && this.clientId!==undefined){

          this.cid = this.clientId;
        }

        if(this.orderExistIds && this.orderExistIds!==undefined){
            this.oIdsExist = this.orderExistIds;
        }

      }

      filterVal : any;

      filterData($event){
        this.filterVal = "";
        let value = $event.target.value;
        if(value){
          this.filterVal = value;
        }

        this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.draw();
        });
      }

      response : any ;
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
              dataTablesParameters.search.oIdsExist=this.oIdsExist;
              // dataTablesParameters.search.date_fin=this.dateRange_fin;
              // dataTablesParameters.search.date_cls = this.dateRange_cls;

              this.orderService.getOrderList(dataTablesParameters).subscribe(resp => {
                this.response = resp;
                if(this.response && this.response.data){
                  this.tourList = this.response.data;
                    this.cd.markForCheck();
                    callback({
                      recordsTotal: this.response.recordsTotal,
                      recordsFiltered: this.response.recordsFiltered,
                      data: []
                    });

                    // this.spinner.hide();
                }

              });
          }
        };
      }

      addOrderToClient(ordersId : any = 0){
        if(ordersId > 0){
			    // this.ordersIdList.push(ordersId);
			    this.orderIdsList.emit(ordersId);
        }
      }

}
