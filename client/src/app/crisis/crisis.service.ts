import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';

import {crisis} from './crisis';
import {environment} from '../../environments/environment';
import {CrisisComponent} from "./crisis.component";


@Injectable()
export class CrisisService {
    readonly baseUrl: string = environment.API_URL + 'crisis';
    private crisisUrl: string = this.baseUrl;

    constructor(private http: HttpClient) {
    }

    addCrisis(newCrisis: crisis): Observable<{'$oid': string}> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };

        return this.http.post<{'$oid': string}>(this.crisisUrl + '/new', newCrisis, httpOptions);
    }

    getCrisisById(id: string): Observable<crisis> {
        return this.http.get<crisis>(this.crisisUrl + '/' + id);
    }
    getCrisis(crisisName?: string): Observable<crisis[]> {
        if(crisisName) {
            return this.http.get<crisis[]>(this.crisisUrl + '?name=' + crisisName);
        }
        return this.http.get<crisis[]>(this.crisisUrl);
    }
    /*editCrisis(id : string): Observable<{'$oid': string}> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };

        console.log(id);
        // Send post request to add a new journal with the journal data as the body with specified headers.
        return this.http.post<{'$oid': string}>(this.crisisUrl + '/edit', id, httpOptions);
    }*/


}
