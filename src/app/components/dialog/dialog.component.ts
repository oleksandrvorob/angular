import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {

}

@Component({
  selector: 'kt-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})

export class DialogComponent implements OnInit {

  constructor(
	  public dialogRef: MatDialogRef<DialogComponent>,
	  @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit() {
  }

}
