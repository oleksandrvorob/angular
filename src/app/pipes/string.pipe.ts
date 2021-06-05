import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'string'
})
export class StringPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}


@Pipe({name: 'removenull'})
export class RemovenullPipe implements PipeTransform {

  transform(value: string, defaultval: string = ''): string {
    
    value =(value!==null && value!==undefined)?value.trim():value;
    
    if(value==='null' || value===null || value===undefined || value==='undefined'){
      return defaultval;
    }
    else{
      return value;
    }
  }
}