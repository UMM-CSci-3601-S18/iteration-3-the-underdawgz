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
    public inputType;

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

    filterGraph(weekday, filterMood): number {
        var filterData;

        var thisWeekDate = this.getThisWeekDate();
        var lastWeekDate = this.getLastWeekDate();

        if (this.inputType == "This week"){
            var today = new Date();
            var first = today.getDate() - today.getDay();
            this.startDate = new Date(today.setDate(first));
            this.endDate = new Date(today.setDate(today.getDate()+6));
            filterData = this.filterSummarys(this.summaryMood, this.summaryIntensity, this.startDate, this.endDate);
        } else if (this.inputType == "Last week"){
            var today = new Date();
            var first = today.getDate() - today.getDay() - 7;
            this.startDate = new Date(today.setDate(first));
            this.endDate = new Date(today.setDate(today.getDate()+6));
            filterData = this.filterSummarys(this.summaryMood, this.summaryIntensity, this.startDate, this.endDate);
        } else if (this.inputType == "Today"){
            var today = new Date();
            filterData = this.filterSummarys(this.summaryMood, this.summaryIntensity, today, today);
        } else {
            filterData = this.filterSummarys(this.summaryMood, this.summaryIntensity, this.startDate, this.endDate);
        }


        // Filter by weekday
        filterData = filterData.filter(summary => {
            this.getDate = new Date(summary.date);
            return this.getDate.getDay() == weekday;
        });

        // Filter by mood
        filterMood = filterMood.toLocaleLowerCase();
        filterData = filterData.filter(summary => {
            return !filterMood || summary.mood.toLowerCase().indexOf(filterMood) !== -1;
        });

        return filterData.length;

    }

    getRightFormForDate(date: number, month: number, year: number){
        let mons = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        let mon = mons[month];
        var rightForm = mon+' '+date+' '+year;
        return rightForm;
    }

    getThisWeekDate(){
        var days = [];
        var today = new Date();
        var first = today.getDate() - today.getDay();
        var firstDay = new Date(today.setDate(first));
        var theDay = this.getRightFormForDate(firstDay.getDate(), firstDay.getMonth(), firstDay.getFullYear());
        days.push(theDay);
        var i;
        var nextDay;
        for( i=1; i<7; i++){
            nextDay = new Date(today.setDate(today.getDate()+1));
            days.push(this.getRightFormForDate(nextDay.getDate(), nextDay.getMonth(), nextDay.getFullYear()));
        }
        return days;
    }

    getLastWeekDate(){
        var days = [];
        var today = new Date();
        var first = today.getDate() - today.getDay() - 7;
        var firstDay = new Date(today.setDate(first));
        var theDay = this.getRightFormForDate(firstDay.getDate(), firstDay.getMonth(), firstDay.getFullYear());
        days.push(theDay);
        var i;
        var nextDay;
        for( i=1; i<7; i++){
            nextDay = new Date(today.setDate(today.getDate()+1));
            days.push(this.getRightFormForDate(nextDay.getDate(), nextDay.getMonth(), nextDay.getFullYear()));
        }
        return days;
    }

    /*filterGraphHourly(hour, filterMood): number {
        console.log(this.filteredSummarys.length);
        var filterData = this.filteredSummarys;

        filterData = filterData.filter(summary => {
            this.getDate = new Date(summary.date);
            return this.getDate.getHours() == hour;
        });

        filterMood = filterMood.toLocaleLowerCase();
        filterData = filterData.filter(summary => {
            return !filterMood || summary.mood.toLowerCase().indexOf(filterMood) !== -1;
        });

        return filterData.length;
    }*/

    /**
     * Starts an asynchronous operation to update the emojis list
     *
     */

    updateChart(): void{

        this.myChart.destroy();

        this.canvas = document.getElementById("myChart");
        this.ctx = this.canvas;

        if(this.inputType == "Today"){
            this.buildChart();

        } else if (this.inputType == "This week"){
            var currWeek = this.getThisWeekDate();
            let days = [currWeek[0], currWeek[1], currWeek[2], currWeek[3], currWeek[4], currWeek[5], currWeek[6]];

            let happy_weekly_totals = {"label":"Happy",
                "data":[
                    this.filterGraph('0', 'happy'),
                    this.filterGraph('1', 'happy'),
                    this.filterGraph('2', 'happy'),
                    this.filterGraph('3', 'happy'),
                    this.filterGraph('4', 'happy'),
                    this.filterGraph('5', 'happy'),
                    this.filterGraph('6', 'happy')
                ],
                hidden: false,
                "fill":false,
                "borderColor":"rgb(150, 0, 100)",
                "lineTension":0.1};

            let sad_weekly_totals = {"label":"Sad",
                "data":[
                    this.filterGraph('0', 'sad'),
                    this.filterGraph('1', 'sad'),
                    this.filterGraph('2', 'sad'),
                    this.filterGraph('3', 'sad'),
                    this.filterGraph('4', 'sad'),
                    this.filterGraph('5', 'sad'),
                    this.filterGraph('6', 'sad')
                ],
                hidden: false,
                "fill":false,
                "borderColor":"rgb(150, 0, 100)",
                "lineTension":0.1};

            let meh_weekly_totals = {"label":"Meh",
                "data":[
                    this.filterGraph('0', 'meh'),
                    this.filterGraph('1', 'meh'),
                    this.filterGraph('2', 'meh'),
                    this.filterGraph('3', 'meh'),
                    this.filterGraph('4', 'meh'),
                    this.filterGraph('5', 'meh'),
                    this.filterGraph('6', 'meh')
                ],
                hidden: false,
                "fill":false,
                "borderColor":"rgb(150, 0, 100)",
                "lineTension":0.1};

            let mad_weekly_totals = {"label":"Mad",
                "data":[
                    this.filterGraph('0', 'mad'),
                    this.filterGraph('1', 'mad'),
                    this.filterGraph('2', 'mad'),
                    this.filterGraph('3', 'mad'),
                    this.filterGraph('4', 'mad'),
                    this.filterGraph('5', 'mad'),
                    this.filterGraph('6', 'mad')
                ],
                hidden: false,
                "fill":false,
                "borderColor":"rgb(150, 0, 100)",
                "lineTension":0.1};

            let scared_weekly_totals = {"label":"Scared",
                "data":[
                    this.filterGraph('0', 'scared'),
                    this.filterGraph('1', 'scared'),
                    this.filterGraph('2', 'scared'),
                    this.filterGraph('3', 'scared'),
                    this.filterGraph('4', 'scared'),
                    this.filterGraph('5', 'scared'),
                    this.filterGraph('6', 'scared')
                ],
                hidden: false,
                "fill":false,
                "borderColor":"rgb(150, 0, 100)",
                "lineTension":0.1};

            let anxious_weekly_totals = {"label":"Anxious",
                "data":[
                    this.filterGraph('0', 'anxious'),
                    this.filterGraph('1', 'anxious'),
                    this.filterGraph('2', 'anxious'),
                    this.filterGraph('3', 'anxious'),
                    this.filterGraph('4', 'anxious'),
                    this.filterGraph('5', 'anxious'),
                    this.filterGraph('6', 'anxious')
                ],
                hidden: false,
                "fill":false,
                "borderColor":"rgb(150, 0, 100)",
                "lineTension":0.1};

            this.myChart = new Chart(this.ctx, {
                type: 'line',
                data: {
                    labels: [currWeek[0], currWeek[1], currWeek[2], currWeek[3], currWeek[4], currWeek[5], currWeek[6]],
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
                        yAxes: [{
                            ticks: {
                                beginAtZero: true

                            }
                        }]
                    }
                }
            });

        } else if (this.inputType == "Last week"){
            var lastWeek = this.getLastWeekDate();
            let days = [lastWeek[0], lastWeek[1], lastWeek[2], lastWeek[3], lastWeek[4], lastWeek[5], lastWeek[6]];

            let happy_weekly_totals = {"label":"Happy",
                "data":[
                    this.filterGraph('0', 'happy'),
                    this.filterGraph('1', 'happy'),
                    this.filterGraph('2', 'happy'),
                    this.filterGraph('3', 'happy'),
                    this.filterGraph('4', 'happy'),
                    this.filterGraph('5', 'happy'),
                    this.filterGraph('6', 'happy')
                ],
                hidden: false,
                "fill":false,
                "borderColor":"rgb(150, 0, 100)",
                "lineTension":0.1};

            let sad_weekly_totals = {"label":"Sad",
                "data":[
                    this.filterGraph('0', 'sad'),
                    this.filterGraph('1', 'sad'),
                    this.filterGraph('2', 'sad'),
                    this.filterGraph('3', 'sad'),
                    this.filterGraph('4', 'sad'),
                    this.filterGraph('5', 'sad'),
                    this.filterGraph('6', 'sad')
                ],
                hidden: false,
                "fill":false,
                "borderColor":"rgb(150, 0, 100)",
                "lineTension":0.1};

            let meh_weekly_totals = {"label":"Meh",
                "data":[
                    this.filterGraph('0', 'meh'),
                    this.filterGraph('1', 'meh'),
                    this.filterGraph('2', 'meh'),
                    this.filterGraph('3', 'meh'),
                    this.filterGraph('4', 'meh'),
                    this.filterGraph('5', 'meh'),
                    this.filterGraph('6', 'meh')
                ],
                hidden: false,
                "fill":false,
                "borderColor":"rgb(150, 0, 100)",
                "lineTension":0.1};

            let mad_weekly_totals = {"label":"Mad",
                "data":[
                    this.filterGraph('0', 'mad'),
                    this.filterGraph('1', 'mad'),
                    this.filterGraph('2', 'mad'),
                    this.filterGraph('3', 'mad'),
                    this.filterGraph('4', 'mad'),
                    this.filterGraph('5', 'mad'),
                    this.filterGraph('6', 'mad')
                ],
                hidden: false,
                "fill":false,
                "borderColor":"rgb(150, 0, 100)",
                "lineTension":0.1};

            let scared_weekly_totals = {"label":"Scared",
                "data":[
                    this.filterGraph('0', 'scared'),
                    this.filterGraph('1', 'scared'),
                    this.filterGraph('2', 'scared'),
                    this.filterGraph('3', 'scared'),
                    this.filterGraph('4', 'scared'),
                    this.filterGraph('5', 'scared'),
                    this.filterGraph('6', 'scared')
                ],
                hidden: false,
                "fill":false,
                "borderColor":"rgb(150, 0, 100)",
                "lineTension":0.1};

            let anxious_weekly_totals = {"label":"Anxious",
                "data":[
                    this.filterGraph('0', 'anxious'),
                    this.filterGraph('1', 'anxious'),
                    this.filterGraph('2', 'anxious'),
                    this.filterGraph('3', 'anxious'),
                    this.filterGraph('4', 'anxious'),
                    this.filterGraph('5', 'anxious'),
                    this.filterGraph('6', 'anxious')
                ],
                hidden: false,
                "fill":false,
                "borderColor":"rgb(150, 0, 100)",
                "lineTension":0.1};

            this.myChart = new Chart(this.ctx, {
                type: 'line',
                data: {
                    labels: days,
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
                        yAxes: [{
                            ticks: {
                                beginAtZero: true

                            }
                        }]
                    }
                }
            });

        } else {

        }

    }

    buildChart(): void {

        this.canvas = document.getElementById("myChart");
        this.ctx = this.canvas;

        this.myChart = new Chart(this.ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Scatter Dataset',
                    data: [{
                        x: -10,
                        y: 0
                    }, {
                        x: 0,
                        y: 10
                    }, {
                        x: 10,
                        y: -10
                    }]
                }]
            },
            options: {
                scales: {
                    xAxes: [{
                        type: 'linear',
                        position: 'bottom'
                    }]
                }
            }
        });

    }
//
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

