import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DateformatePipe, DateformatewithouttzonePipe,DateformatewithtzonePipe } from  './../../pipes/datepipe.pipe';
import { RemovenullPipe } from  './../../pipes/string.pipe';
@NgModule({
  imports: [
    // dep modules
  ],
  declarations: [
    DateformatePipe, DateformatewithouttzonePipe,DateformatewithtzonePipe,  RemovenullPipe
  ],
  exports: [DateformatePipe, DateformatewithouttzonePipe, DateformatewithtzonePipe,RemovenullPipe],
  providers: [DatePipe]
})
export class ApplicationPipesModule {}
