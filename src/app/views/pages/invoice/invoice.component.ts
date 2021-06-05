import {Component, OnDestroy, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef , ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as html2pdf from 'html2pdf.js';
@Component({
  selector: 'kt-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})



export class InvoiceComponent implements OnInit {

	headerLogo: string;

public  formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2
})

public invoiceData = {
  dateRange:{
    from:'16.08.2019',
    to:'31.08.2019'
  },
  company:{
    name:'Company Name',
    street:'Our company Street',
    number:30,
    zip:45141,
    city:'Essen',
    taxNumber:'UI456GGGH6546Y'
  },

  ourCompany:{
   name:'Our company name',
   adress:'Adress our company',
   genPartner:'General partener name',
   commRegNumber:'KJHG4654',
   manPartner:'Managing Partner Name',
   taxNumber:'FJHG446',
   bankName:'Name of Bank',
   iban:'45FDF654',
   bic:'HJL455OET',
   website:'http://www.website.com'
  },

  subsidiary:{
   name:'Subsidary name',
   street:'Subsidary Street',
   number:19,
   zip:36043,
   city:'Fulda',
   taxNumber:'UI456GGGH6546Y'

  },

  bill:{
   number:18601,
   clientNum:2017725,
   date:'31.08.2019',
   user:'John Smith',
   phone:'051614885548',
   fax:'051614888956',
   email:'info@email.com',
   creditorNumber:''
  },

  items:[
   {
     name:'Item 1 Name',
     price:186.00,
     days:11
   },
   {
     name:'Item 2 Name',
     price:161.00,
     days:12
   },
   {
     name:'Item 3 Name',
     price:170.00,
     days:10
   }
  ]

 };


    @ViewChild('content', { static: true }) content: ElementRef;

	constructor(

	) {



	 }

	ngOnInit() {
        this.headerLogo = './assets/media/logos/logo.png';
    }

    getTotal(){
      let total = 0;
      this.invoiceData.items.forEach(
        (e)=>{
          total += e.price*e.days;
        }
      );
      return total;
    }

    savePdf(){
		let opt ={
			filename:"invoice.pdf",
			margin:[10,10,0,10],
			image:{ type: 'jpg',quality:1 },
			jsPDF:{
			orientation: 'p',
			unit: 'mm',
			format: 'a4',
			putOnlyUsedFonts:true
			},
			html2canvas:  { scale: 2 },
		}
    	html2pdf(this.content.nativeElement,opt);
	}

	printPage() {
		window.print();

	}


}
