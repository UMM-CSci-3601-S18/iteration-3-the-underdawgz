import {Component, Inject} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ResourceEmotion} from './resourceEmotion';
import {Observable} from 'rxjs/Observable';

import {environment} from '../../environments/environment';

@Component({
    selector: 'emotion-response-mad-component',
    templateUrl: 'emotion-response-mad.component.html',
    styleUrls: ['emotion-response-mad.component.css']
})

export class EmotionResponseMadComponent {
    giveResponse : boolean = false;
    resourceUrl : string = environment.API_URL + 'resources';


    constructor(public dialogRef: MatDialogRef<EmotionResponseMadComponent>,
                private http: HttpClient) {
    }


    onExitClick(): void {
        this.dialogRef.close();
    }

}
