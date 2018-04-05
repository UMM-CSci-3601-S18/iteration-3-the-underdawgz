import {Component, OnInit} from '@angular/core';
import {Inject} from '@angular/core';
import {SummaryListService} from './summary-list.service';
import {Summary} from './summary';
import {Observable} from 'rxjs/Observable';
import {MatDialog} from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import * as Chart from 'chart.js';

@Component({
    selector: 'app-summary-list-component',
    templateUrl: 'summary-list.component.html',
    styleUrls: ['./summary-list.component.css'],
})

export class SummaryListComponent implements OnInit {
    startDate;
    endDate;
    getDate;

    canvas: any;
    ctx: any;
    myChart: any;

    // These are public so that tests can reference them (.spec.ts)
    public summarys: Summary[];
    public filteredSummarys: Summary[];

    // These are the target values used in searching.
    // We should rename them to make that clearer.
    public summaryMood: string;
    public summaryIntensity: number;
    public inputType = "Day";

    // The ID of the
    private highlightedID: {'$oid': string} = { '$oid': '' };

    // Inject the SummaryListService into this component.
    constructor(public summaryListService: SummaryListService, public dialog: MatDialog) {

    }

    isHighlighted(summary: Summary): boolean {
        return summary._id['$oid'] === this.highlightedID['$oid'];
    }

    public filterSummarys(searchMood: string, searchIntensity: number, searchStartDate: any, searchEndDate: any): Summary[] {

        this.filteredSummarys = this.summarys;

        // Filter by Mood
        if (searchMood != null) {
            if(searchMood =="All"){
                this.filteredSummarys = this.filteredSummarys.filter(summary => {
                    return true;
                });

            } else{
                searchMood = searchMood.toLocaleLowerCase();
                this.filteredSummarys = this.filteredSummarys.filter(summary => {
                    return !searchMood || summary.mood.toLowerCase().indexOf(searchMood) !== -1;
                })
            }



        }

        // Filter by Intensity
        if (searchIntensity != null) {
            if (searchIntensity.toString() == "All") {
                this.filteredSummarys = this.filteredSummarys.filter(summary => {
                    return true;
                });
            }
            else {
                this.filteredSummarys = this.filteredSummarys.filter(summary => {
                    return !searchIntensity || searchIntensity.toString() == summary.intensity.toString();
                });
            }
        }

        // Filter by startDate
        if (searchStartDate != null) {

            this.filteredSummarys = this.filteredSummarys.filter(summary => {
                this.getDate = new Date(summary.date);
                return this.getDate >= this.startDate;
            });
        }

        // Filter by endDate
        if (searchEndDate != null) {

            this.filteredSummarys = this.filteredSummarys.filter(summary => {
                this.getDate = new Date(summary.date);
                return this.getDate <= this.endDate;
            });
        }
        return this.filteredSummarys;
    }

    filterGraphWeekly(weekday, filterMood): number {
        console.log(this.filteredSummarys.length);
        var filterData = this.filteredSummarys;

        // Filter by weekday
        filterData = filterData.filter(summary => {
            this.getDate = new Date(summary.date);
            return this.getDate.getDay() == weekday;
        });

        // filter by mood
        filterMood = filterMood.toLocaleLowerCase();
        filterData = filterData.filter(summary => {
            return !filterMood || summary.mood.toLowerCase().indexOf(filterMood) !== -1;
        });

        return filterData.length;

    }

    filterGraphHourly(hour, filterMood): number {
        console.log(this.filteredSummarys.length);
        var filterData = this.filteredSummarys;

        filterData = filterData.filter(summary => {
            this.getDate = new Date(summary.date);
            return this.getDate.getHours() == weekday;
        });

        filterMood = filterMood.toLocaleLowerCase();
        filterData = filterData.filter(summary => {
            return !filterMood || summary.mood.toLowerCase().indexOf(filterMood) !== -1;
        });

        return filterData.length;
    }

    /**
     * Starts an asynchronous operation to update the emojis list
     *
     */

    /*updateChart(): void{

        this.myChart.destroy();

        this.canvas = document.getElementById("myChart");
        this.ctx = this.canvas;

        var type;
        var summaryDays;
        var summaryHours;

        var displayData;

        var days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
        var hours = ['12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM',
            '8AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM',
            '5 PM', '6 PM', '7 PM', '8 PM','9 PM', '10 PM', '11 PM'];

        console.log(this.inputType);
        if(this.inputType == "Hour"){
            type = hours;

            summaryHours = {
                "label": "Total Number of Entries",
                "data": [
                    this.filterGraph('0'),
                    this.filterGraph('1'),
                    this.filterGraph('2'),
                    this.filterGraph('3'),
                    this.filterGraph('4'),
                    this.filterGraph('5'),
                    this.filterGraph('6'),
                    this.filterGraph('7'),
                    this.filterGraph('8'),
                    this.filterGraph('9'),
                    this.filterGraph('10'),
                    this.filterGraph('11'),
                    this.filterGraph('12'),
                    this.filterGraph('13'),
                    this.filterGraph('14'),
                    this.filterGraph('15'),
                    this.filterGraph('16'),
                    this.filterGraph('17'),
                    this.filterGraph('18'),
                    this.filterGraph('19'),
                    this.filterGraph('20'),
                    this.filterGraph('21'),
                    this.filterGraph('22'),
                    this.filterGraph('23'),
                    this.filterGraph('24')
                ],
                hidden: false,
                "fill": false,
                "backgroundColor": "blue",
                "borderColor": "black",
                "lineTension": 0.1
            };
            displayData = summaryHours;
        }
        else {
            console.log("here");
            type = days;

            summaryDays = {
                "label": "Total Number of Entries",
                "data": [
                    this.filterGraph('0'),
                    this.filterGraph('1'),
                    this.filterGraph('2'),
                    this.filterGraph('3'),
                    this.filterGraph('4'),
                    this.filterGraph('5'),
                    this.filterGraph('6'),

                ],
                "fill": false,
                "backgroundColor": "blue",
                "borderColor": "black",
                "lineTension": 0.1
            };

            displayData = summaryDays;
        }


        this.myChart = new Chart(this.ctx, {
            type: 'line',
            data: {

                labels: type,
                datasets: [displayData]
            },
            options: {
                responsive: true,
                maintainAspectRation: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true

                        }
                    }]
                }
            }
        });



    }*/

    buildChart(): void {

        this.canvas = document.getElementById("myChart");
        this.ctx = this.canvas;

        var summaryDays;

        let days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
        let happy_weekly_totals = {"label":"Happy",
            "data":[
                this.filterGraphWeekly('0', 'happy'),
                this.filterGraphWeekly('1', 'happy'),
                this.filterGraphWeekly('2', 'happy'),
                this.filterGraphWeekly('3', 'happy'),
                this.filterGraphWeekly('4', 'happy'),
                this.filterGraphWeekly('5', 'happy'),
                this.filterGraphWeekly('6', 'happy')
            ],
            hidden: false,
            "fill":false,
            "borderColor":"rgb(150, 0, 100)",
            "lineTension":0.1};

        let sad_weekly_totals = {"label":"Sad",
            "data":[
                this.filterGraphWeekly('0', 'sad'),
                this.filterGraphWeekly('1', 'sad'),
                this.filterGraphWeekly('2', 'sad'),
                this.filterGraphWeekly('3', 'sad'),
                this.filterGraphWeekly('4', 'sad'),
                this.filterGraphWeekly('5', 'sad'),
                this.filterGraphWeekly('6', 'sad')
            ],
            hidden: false,
            "fill":false,
            "borderColor":"rgb(150, 0, 100)",
            "lineTension":0.1};

        let meh_weekly_totals = {"label":"Meh",
            "data":[
                this.filterGraphWeekly('0', 'meh'),
                this.filterGraphWeekly('1', 'meh'),
                this.filterGraphWeekly('2', 'meh'),
                this.filterGraphWeekly('3', 'meh'),
                this.filterGraphWeekly('4', 'meh'),
                this.filterGraphWeekly('5', 'meh'),
                this.filterGraphWeekly('6', 'meh')
            ],
            hidden: false,
            "fill":false,
            "borderColor":"rgb(150, 0, 100)",
            "lineTension":0.1};

        let mad_weekly_totals = {"label":"Mad",
            "data":[
                this.filterGraphWeekly('0', 'mad'),
                this.filterGraphWeekly('1', 'mad'),
                this.filterGraphWeekly('2', 'mad'),
                this.filterGraphWeekly('3', 'mad'),
                this.filterGraphWeekly('4', 'mad'),
                this.filterGraphWeekly('5', 'mad'),
                this.filterGraphWeekly('6', 'mad')
            ],
            hidden: false,
            "fill":false,
            "borderColor":"rgb(150, 0, 100)",
            "lineTension":0.1};

        let scared_weekly_totals = {"label":"Scared",
            "data":[
                this.filterGraphWeekly('0', 'scared'),
                this.filterGraphWeekly('1', 'scared'),
                this.filterGraphWeekly('2', 'scared'),
                this.filterGraphWeekly('3', 'scared'),
                this.filterGraphWeekly('4', 'scared'),
                this.filterGraphWeekly('5', 'scared'),
                this.filterGraphWeekly('6', 'scared')
            ],
            hidden: false,
            "fill":false,
            "borderColor":"rgb(150, 0, 100)",
            "lineTension":0.1};

        let anxious_weekly_totals = {"label":"Anxious",
            "data":[
                this.filterGraphWeekly('0', 'anxious'),
                this.filterGraphWeekly('1', 'anxious'),
                this.filterGraphWeekly('2', 'anxious'),
                this.filterGraphWeekly('3', 'anxious'),
                this.filterGraphWeekly('4', 'anxious'),
                this.filterGraphWeekly('5', 'anxious'),
                this.filterGraphWeekly('6', 'anxious')
            ],
            hidden: false,
            "fill":false,
            "borderColor":"rgb(150, 0, 100)",
            "lineTension":0.1};

        this.myChart = new Chart(this.ctx, {
            type: 'line',
            data: {
                datasets: [
                    happy_weekly_totals,
                    sad_weekly_totals,
                    meh_weekly_totals,
                    scared_weekly_totals,
                    mad_weekly_totals,
                    anxious_weekly_totals,
                    ]
            },
            options: {
                responsive: true,
                maintainAspectRation: false,
                scales: {
                    xAxes: [{
                        type: 'time',
                        position: 'bottom',
                        time: {
                            unit: "day",
                        },
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true

                        }
                    }]
                }
            }
        });

    }

    ngAfterViewInit(): void {
        this.buildChart();
    }

    /*
     * Starts an asynchronous operation to update the users list
     *
     */
    refreshSummarys(): Observable<Summary[]> {
        // Get Users returns an Observable, basically a "promise" that
        // we will get the data from the server.
        //
        // Subscribe waits until the data is fully downloaded, then
        // performs an action on it (the first lambda)
        const summaryListObservable: Observable<Summary[]> = this.summaryListService.getSummarys();
        summaryListObservable.subscribe(
            summarys => {
                this.summarys = summarys;
                this.filterSummarys(this.summaryMood, this.summaryIntensity, this.startDate, this.endDate);
            },
            err => {
                console.log(err);
            });
        return summaryListObservable;
    }


    loadService(): void {
        this.summaryListService.getSummarys(this.summaryMood).subscribe(
            summarys => {
                this.summarys = summarys;
                this.filteredSummarys = this.summarys;
            },
            err => {
                console.log(err);
            }
        );
    }

    totalNumberEntries(): number{
        return this.summarys.length;
    }

    totalNumberMoods(): number{
        return this.filteredSummarys.length;
    }

    returnTime(mood: string): string{
        return "";
    }

    ngOnInit(): void {
        this.refreshSummarys();
        this.loadService();
    }

    stringToDate(date: string): any {
        return new Date(date);
    }

}

