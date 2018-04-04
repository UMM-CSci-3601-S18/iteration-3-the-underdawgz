import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {crisis} from './crisis';

@Component({
    selector: 'app-add-crisis.component',
    templateUrl: 'add-crisis.component.html',
})
export class AddCrisisComponent {
    constructor(
        public dialogRef: MatDialogRef<AddCrisisComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {crisis: crisis}) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
