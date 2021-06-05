import { ErrorStateMatcher } from "@angular/material/core";
import { FormControl, FormGroupDirective, NgForm } from "@angular/forms";
import { Component } from "@angular/core";

export class PaymentStopValidator implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
          let isInValid = control.value != "";
          return !!(control && isInValid );
    }
}
