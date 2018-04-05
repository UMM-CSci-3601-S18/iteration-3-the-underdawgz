import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {MatDialog} from "@angular/material/dialog";
import {CrisisService} from "./crisis.service";
import {crisis} from "./crisis";
import {Observable} from "rxjs/Observable";



@Component({
    selector: 'app-crisis-button.component',
    templateUrl: 'crisis-button.component.html',
})
export class CrisisButtonComponent implements OnInit{
    public crisis: crisis[];

    // These are the target values used in searching.
    // We should rename them to make that clearer.
    public crisisName: string;
    public filteredCrisis: crisis[];

    constructor(
        public dialogRef: MatDialogRef<CrisisButtonComponent>, public crisisService: CrisisService, public dialog: MatDialog) {
    }

    public filterCrisis(searchName): crisis[] {

        this.filteredCrisis = this.crisis;

        // Filter by name (for future
        if (searchName != null) {
            searchName = searchName.toLocaleLowerCase();

            this.filteredCrisis = this.filteredCrisis.filter(crisis => {
                return !searchName || crisis.name.toLowerCase().indexOf(searchName) !== -1;
            });
        }
        return this.filteredCrisis;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

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
