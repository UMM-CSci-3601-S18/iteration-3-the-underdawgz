import {Component, OnInit} from '@angular/core';
import {ResourcesService} from "./resources.service";
import {Resource} from "./resource";
import {Observable} from 'rxjs/Observable';
import {MatDialog} from '@angular/material';
import {AddResourceComponent} from './add-resource.component';


@Component({
    selector: 'app-resources-component',
    templateUrl: 'resources.component.html',
    styleUrls: ['./resources.component.css'],
})

export class ResourcesComponent implements OnInit {
    // These are public so that tests can reference them (.spec.ts)
    public resources: Resource[];
    public filteredResources: Resource[];

    // These are the target values used in searching.
    // We should rename them to make that clearer.

    public resourceTitle: string;
    public resourceLink: string;

    // The ID of the resource
    private highlightedID: {'$oid': string} = { '$oid': '' };

    // Inject the ResourcesService into this component.
    constructor(public resourceService: ResourcesService, public dialog: MatDialog) {

    }

    isHighlighted(resource: Resource): boolean {
        return resource._id['$oid'] === this.highlightedID['$oid'];
    }

    openDialog(): void {

        const newResource: Resource = {_id: '', title:'', link:''};
        const dialogRef = this.dialog.open(AddResourceComponent, {
            width: '500px',
            data: { resource : newResource }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.resourceService.addNewResource(result).subscribe(
                addResourceResult => {
                    console.log("It completed the addNewResource function");
                    this.highlightedID = addResourceResult;
                    this.refreshResources();
                },
                err => {
                    // This should probably be turned into some sort of meaningful response.
                    console.log('There was an error adding the resource.');
                    console.log('The error was ' + JSON.stringify(err));
                });
        });
    }

    public filterResources(searchTitle: string, searchLink: string): Resource[] {

        this.filteredResources = this.resources;


        // Filter by title
        if (searchTitle != null) {
            searchTitle = searchTitle.toLocaleLowerCase();

            this.filteredResources = this.filteredResources.filter(resource => {
                return !searchTitle || resource.title.toLowerCase().indexOf(searchTitle) !== -1;
            });
        }

        // Filter by link
        if (searchLink != null) {
            searchLink = searchLink.toLocaleLowerCase();

            this.filteredResources = this.filteredResources.filter(resource => {
                return !searchLink || resource.link.toLowerCase().indexOf(searchLink) !== -1;
            });
        }
        return this.filteredResources;
    }


    refreshResources(): Observable<Resource[]> {
        // Get Resources returns an Observable, basically a "promise" that
        // we will get the data from the server.
        //
        // Subscribe waits until the data is fully downloaded, then
        // performs an action on it (the first lambda)

        const resourceObservable: Observable<Resource[]> = this.resourceService.getResource();
        resourceObservable.subscribe(
            resources => {
                this.resources = resources;
                this.filterResources(this.resourceTitle, this.resourceLink);
            },
            err => {
                console.log(err);
            });
        return resourceObservable;
    }


    loadService(): void {
        this.resourceService.getResource(this.resourceLink).subscribe(
            resources => {
                this.resources = resources;
                this.filteredResources = this.resources;
            },
            err => {
                console.log(err);
            }
        );
    }


    ngOnInit(): void {
        this.refreshResources();
        this.loadService();
    }

}


