import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';



@Pipe({
  name: 'dateformate'
})
export class DateformatePipe extends DatePipe  implements PipeTransform {
  defaultFormate = "dd/MMM/yyyy";
  transform(value: any, args?: any): any {
    if(value>0){
      var d = new Date( value * 1000 );
      var formate = (args!==null && args!=="")?args:this.defaultFormate;
      return ( value != 0 && value!==null)?super.transform(d,formate):'';
    }else{
      return '';
    }

  }

}



@Pipe({
  name: 'dateformatewithouttzone'
})
export class DateformatewithouttzonePipe extends DatePipe  implements PipeTransform {
  defaultFormate = "dd/MMM/yyyy";
  transform(value: any, args?: any): any {

    var now = new Date();
    var timezoneoffset  = now.getTimezoneOffset();

    value = (value !=="" && value!==null)?parseInt(value):0;
    if(value>0){
      value  = value + (timezoneoffset*60);
      var d = new Date( value * 1000 );
      var formate = (args!==null && args!=="")?args:this.defaultFormate;
      return ( value != 0  && value!==null)?super.transform(d,formate):'';
    }else{
      return '';
    }

  }

}

@Pipe({
  name: 'dateformatewithtzone'
})
export class DateformatewithtzonePipe extends DatePipe  implements PipeTransform {
  defaultFormate = "dd/MMM/yyyy";
  transform(value: any, args?: any): any {

    var now = new Date();
    var timezoneoffset  = now.getTimezoneOffset();

    value = (value !=="" && value!==null)?parseInt(value):0;
    if(value>0){
      value  = value - (timezoneoffset*60);
      var d = new Date( value * 1000 );
      var formate = (args!==null && args!=="")?args:this.defaultFormate;
      return ( value != 0  && value!==null)?super.transform(d,formate):'';
    }else{
      return '';
    }

  }

}
