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

    filterGraphThisWeek(weekday, filterMood): number {
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

    filterGraphLastWeek(weekday, filterMood): number {
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

    /*getLastWeekDate(){
        return null;
    }*/

    getRightFormForDate(date: number, month: number, year: number){
        let mons = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
        let mon = mons[month]
        let rightForm = mon+' '+date+' '+year;
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

    filterGraphHourly(hour, filterMood): number {
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
    }

    /**
     * Starts an asynchronous operation to update the emojis list
     *
     */

    updateChart(): void{

        this.myChart.destroy();

        this.canvas = document.getElementById("myChart");
        this.ctx = this.canvas;

        var type;
        var summaryDays;
        var summary_happy_hours;

        var display_happy_Data;

        var hours = ['12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM',
            '8AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM',
            '5 PM', '6 PM', '7 PM', '8 PM','9 PM', '10 PM', '11 PM'];

        console.log(this.inputType);
        if(this.inputType == "Today"){
            type = hours;

            summary_happy_hours = {
                "label": "Total Number of Entries",
                "data": [
                    this.filterGraphHourly('0', 'happy'),
                    this.filterGraphHourly('1', 'happy'),
                    this.filterGraphHourly('2', 'happy'),
                    this.filterGraphHourly('3', 'happy'),
                    this.filterGraphHourly('4', 'happy'),
                    this.filterGraphHourly('5', 'happy'),
                    this.filterGraphHourly('6', 'happy'),
                    this.filterGraphHourly('7', 'happy'),
                    this.filterGraphHourly('8', 'happy'),
                    this.filterGraphHourly('9', 'happy'),
                    this.filterGraphHourly('10', 'happy'),
                    this.filterGraphHourly('11', 'happy'),
                    this.filterGraphHourly('12', 'happy'),
                    this.filterGraphHourly('13', 'happy'),
                    this.filterGraphHourly('14', 'happy'),
                    this.filterGraphHourly('15', 'happy'),
                    this.filterGraphHourly('16', 'happy'),
                    this.filterGraphHourly('17', 'happy'),
                    this.filterGraphHourly('18', 'happy'),
                    this.filterGraphHourly('19', 'happy'),
                    this.filterGraphHourly('20', 'happy'),
                    this.filterGraphHourly('21', 'happy'),
                    this.filterGraphHourly('22', 'happy'),
                    this.filterGraphHourly('23', 'happy'),
                    this.filterGraphHourly('24', 'happy')
                ],
                hidden: false,
                "fill": false,
                "backgroundColor": "blue",
                "borderColor":"rgb(150, 0, 100)",
                "lineTension": 0.1
            };
            display_happy_Data = summary_happy_hours;
        }
        else if (this.inputType == "Last week"){
            /*type = days;

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

            displayData = summaryDays;*/
        }


        this.myChart = new Chart(this.ctx, {
            type: 'line',
            data: {

                labels: type,
                datasets: [display_happy_Data,]
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



    }

    buildChart(): void {

        this.canvas = document.getElementById("myChart");
        this.ctx = this.canvas;

        let summaryDays;

        var currWeek = this.getThisWeekDate();
        var first = currWeek[0];
        let days = [first, currWeek[1], currWeek[2], currWeek[3], currWeek[4], currWeek[5], currWeek[6]];

        let happy_weekly_totals = {"label":"Happy",
            "data":[
                this.filterGraphThisWeek('0', 'happy'),
                this.filterGraphThisWeek('1', 'happy'),
                this.filterGraphThisWeek('2', 'happy'),
                this.filterGraphThisWeek('3', 'happy'),
                this.filterGraphThisWeek('4', 'happy'),
                this.filterGraphThisWeek('5', 'happy'),
                this.filterGraphThisWeek('6', 'happy')
            ],
            hidden: false,
            "fill":false,
            "borderColor":"rgb(150, 0, 100)",
            "lineTension":0.1};

        let sad_weekly_totals = {"label":"Sad",
            "data":[
                this.filterGraphThisWeek('0', 'sad'),
                this.filterGraphThisWeek('1', 'sad'),
                this.filterGraphThisWeek('2', 'sad'),
                this.filterGraphThisWeek('3', 'sad'),
                this.filterGraphThisWeek('4', 'sad'),
                this.filterGraphThisWeek('5', 'sad'),
                this.filterGraphThisWeek('6', 'sad')
            ],
            hidden: false,
            "fill":false,
            "borderColor":"rgb(150, 0, 100)",
            "lineTension":0.1};

        let meh_weekly_totals = {"label":"Meh",
            "data":[
                this.filterGraphThisWeek('0', 'meh'),
                this.filterGraphThisWeek('1', 'meh'),
                this.filterGraphThisWeek('2', 'meh'),
                this.filterGraphThisWeek('3', 'meh'),
                this.filterGraphThisWeek('4', 'meh'),
                this.filterGraphThisWeek('5', 'meh'),
                this.filterGraphThisWeek('6', 'meh')
            ],
            hidden: false,
            "fill":false,
            "borderColor":"rgb(150, 0, 100)",
            "lineTension":0.1};

        let mad_weekly_totals = {"label":"Mad",
            "data":[
                this.filterGraphThisWeek('0', 'mad'),
                this.filterGraphThisWeek('1', 'mad'),
                this.filterGraphThisWeek('2', 'mad'),
                this.filterGraphThisWeek('3', 'mad'),
                this.filterGraphThisWeek('4', 'mad'),
                this.filterGraphThisWeek('5', 'mad'),
                this.filterGraphThisWeek('6', 'mad')
            ],
            hidden: false,
            "fill":false,
            "borderColor":"rgb(150, 0, 100)",
            "lineTension":0.1};

        let scared_weekly_totals = {"label":"Scared",
            "data":[
                this.filterGraphThisWeek('0', 'scared'),
                this.filterGraphThisWeek('1', 'scared'),
                this.filterGraphThisWeek('2', 'scared'),
                this.filterGraphThisWeek('3', 'scared'),
                this.filterGraphThisWeek('4', 'scared'),
                this.filterGraphThisWeek('5', 'scared'),
                this.filterGraphThisWeek('6', 'scared')
            ],
            hidden: false,
            "fill":false,
            "borderColor":"rgb(150, 0, 100)",
            "lineTension":0.1};

        let anxious_weekly_totals = {"label":"Anxious",
            "data":[
                this.filterGraphThisWeek('0', 'anxious'),
                this.filterGraphThisWeek('1', 'anxious'),
                this.filterGraphThisWeek('2', 'anxious'),
                this.filterGraphThisWeek('3', 'anxious'),
                this.filterGraphThisWeek('4', 'anxious'),
                this.filterGraphThisWeek('5', 'anxious'),
                this.filterGraphThisWeek('6', 'anxious')
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

