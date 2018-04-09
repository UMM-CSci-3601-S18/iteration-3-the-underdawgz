import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {crisis} from './crisis';
import {MatSnackBar} from '@angular/material';

@Component({
    selector: 'app-add-crisis.component',
    templateUrl: 'add-crisis.component.html',
})
export class AddCrisisComponent {
    constructor(
        public snackBar: MatSnackBar, public dialogRef: MatDialogRef<AddCrisisComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {crisis: crisis}) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2000,
        });
    }
}
