import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {crisis} from './crisis';
import {CrisisService} from "./crisis.service";
import {MatDialog} from "@angular/material/dialog";
import {AddCrisisComponent} from "./add-crisis.component";

@Component({
    selector: 'crisis-component',
    templateUrl: 'crisis.component.html',
    styleUrls: ['./crisis.component.css'],
})
export class CrisisComponent implements OnInit{
    // These are public so that tests can reference them (.spec.ts)
    public crisis: crisis[];
    public filteredCrisis: crisis[];

    // These are the target values used in searching.
    // We should rename them to make that clearer.
    public crisisName: string;


    // Inject the ResourcesListService into this component.
    constructor(public crisisService: CrisisService, public dialog: MatDialog) {

    }

    openDialog(): void {
        const newCrisis: crisis = {_id: '', name: '', email: '', phone: ''};
        const dialogRef = this.dialog.open(AddCrisisComponent, {
            width: '500px',
            data: { crisis: newCrisis }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.crisisService.addCrisis(result).subscribe(
                addCrisisResult => {
                    this.refreshCrisis();
                },
                err => {
                    // This should probably be turned into some sort of meaningful response.
                    console.log('There was an error adding the crisisNumber.');
                    console.log('The error was ' + JSON.stringify(err));
                });
        });
    }


    public filterCrisis(searchName): crisis[] {

        this.filteredCrisis = this.crisis;

        // Filter by name
        if (searchName != null) {
            searchName = searchName.toLocaleLowerCase();

            this.filteredCrisis = this.filteredCrisis.filter(crisis => {
                return !searchName || crisis.name.toLowerCase().indexOf(searchName) !== -1;
            });
        }
        return this.filteredCrisis;
    }

    /**
     * Starts an asynchronous operation to update the resources list
     *
     */
    refreshCrisis(): Observable<crisis[]> {
        // Get Resources returns an Observable, basically a "promise" that
        // we will get the data from the server.
        //
        // Subscribe waits until the data is fully downloaded, then
        // performs an action on it (the first lambda)

        const crisisListObservable: Observable<crisis[]> = this.crisisService.getCrisis();
        crisisListObservable.subscribe(
            crisis => {
                this.crisis = crisis;
                this.filterCrisis(this.crisisName);
            },
            err => {
                console.log(err);
            });
        return crisisListObservable;
    }


    ngOnInit(): void {
        this.refreshCrisis();
    }
}
