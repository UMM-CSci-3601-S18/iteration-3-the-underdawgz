import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';

import {environment} from '../../environments/environment';
import {Resource} from "./resource";

@Injectable()
export class ResourcesService {
    readonly baseUrl: string = environment.API_URL + 'resources';
    private resourceUrl: string = this.baseUrl;

    constructor(private http: HttpClient) {
    }

    getResource(resourceCategory?: string): Observable<Resource[]> {
        this.filterByCategory(resourceCategory);
        return this.http.get<Resource[]>(this.resourceUrl);
    }

    // This isn't used, but may be useful for future iterations.
    getResourceByID(id: string): Observable<Resource> {
        return this.http.get<Resource>(this.resourceUrl + '/' + id);
    }

    // Unfortunately we did not get to implementing specific filters,
    // but this may useful in the future.
    filterByCategory(resourceCategory?: string): void {
        if (!(resourceCategory == null || resourceCategory === '')) {
            if (this.parameterPresent('category=') ) {
                // there was a previous search by category that we need to clear
                this.removeParameter('category=');
            }
            if (this.resourceUrl.indexOf('?') !== -1) {
                // there was already some information passed in this url
                this.resourceUrl += 'category=' + resourceCategory + '&';
            } else {
                // this was the first bit of information to pass in the url
                this.resourceUrl += '?category=' + resourceCategory + '&';
            }
        } else {
            // there was nothing in the box to put onto the URL... reset
            if (this.parameterPresent('category=')) {
                let start = this.resourceUrl.indexOf('category=');
                const end = this.resourceUrl.indexOf('&', start);
                if (this.resourceUrl.substring(start - 1, start) === '?') {
                    start = start - 1;
                }
                this.resourceUrl = this.resourceUrl.substring(0, start) + this.resourceUrl.substring(end + 1);
            }

        }
    }

    private parameterPresent(searchParam: string) {
        return this.resourceUrl.indexOf(searchParam) !== -1;
    }

    // remove the parameter and, if present, the &
    private removeParameter(searchParam: string) {
        const start = this.resourceUrl.indexOf(searchParam);
        let end = 0;
        if (this.resourceUrl.indexOf('&') !== -1) {
            end = this.resourceUrl.indexOf('&', start) + 1;
        } else {
            end = this.resourceUrl.indexOf('&', start);
        }
        this.resourceUrl = this.resourceUrl.substring(0, start) + this.resourceUrl.substring(end);
    }

    addNewResource(newResource: Resource): Observable<{'$oid': string}> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };

        // Send post request to add a new resource with the user data as the body with specified headers.
        return this.http.post<{'$oid': string}>(this.resourceUrl + '/new', newResource, httpOptions);
    }
}

