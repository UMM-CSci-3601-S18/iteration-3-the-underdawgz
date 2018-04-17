import {Component, Inject} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ResourceEmotion} from './resourceEmotion';
import {Observable} from 'rxjs/Observable';

import {environment} from '../../environments/environment';

@Component({
    selector: 'emotion-response-happy-component',
    templateUrl: 'emotion-response-happy.component.html',
    styleUrls: ['emotion-response-happy.component.css']
})

export class EmotionResponseHappyComponent {
    giveResponse : boolean = false;
    resourceUrl : string = environment.API_URL + 'resources';


    constructor(public dialogRef: MatDialogRef<EmotionResponseHappyComponent>,
                private http: HttpClient) {
    }


    onExitClick(): void {
        this.dialogRef.close();
    }

}
