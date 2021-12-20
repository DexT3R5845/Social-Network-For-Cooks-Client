import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.scss']
})
export class DeleteConfirmationComponent implements OnInit {
  
    constructor(public dialogRef: MatDialogRef<DeleteConfirmationComponent>) {
    }
  
    ngOnInit() {
    }
  
    onConfirm(): void {
      this.dialogRef.close(true);
    }
  
    onDismiss(): void {
      this.dialogRef.close(false);
    }
  }
  
