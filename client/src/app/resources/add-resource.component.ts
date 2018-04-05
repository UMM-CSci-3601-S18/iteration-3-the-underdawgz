import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Resource} from './resource';

@Component({
    selector: 'app-add-resource.component',
    templateUrl: 'add-resource.component.html',
})
export class AddResourceComponent {
    constructor(
        public dialogRef: MatDialogRef<AddResourceComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {resource: Resource}) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}

