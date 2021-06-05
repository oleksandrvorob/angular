import { ErrorStateMatcher } from "@angular/material/core";
import { FormControl, FormGroupDirective, NgForm } from "@angular/forms";
import { Component } from "@angular/core";

export class CalendarValidator implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
          let regEx = /^([0-2][0-9]|(3)[0-1])(\.)(((0)[0-9])|((1)[0-2]))(\.)\d{4}$/i;
          let isInValid = control.value == "" || !regEx.test(control.value);
          return !!(control && (control.dirty || control.touched) && isInValid );
    }
}
