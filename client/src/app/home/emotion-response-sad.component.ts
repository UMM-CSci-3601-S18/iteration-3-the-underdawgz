import {Component, Inject} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Resource} from './resource';
import {Observable} from 'rxjs/Observable';

import {environment} from '../../environments/environment';

@Component({
    selector: 'emotion-response-sad-component',
    templateUrl: 'emotion-response-sad.component.html',
    styleUrls: ['emotion-response-sad.component.css']
})

export class EmotionResponseSadComponent {
    giveResponse : boolean = false;
    resourceUrl : string = environment.API_URL + 'resources';


    constructor(public dialogRef: MatDialogRef<EmotionResponseSadComponent>,
                private http: HttpClient) {
    }


    onExitClick(): void {
        this.dialogRef.close();
    }

}
