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

    filterGraphForHour(){
        var filterData;
        var today = new Date();
        // var hour = [];
        var intensity = [];

        filterData = this.filterSummarys(this.summaryMood, this.summaryIntensity, today, today);

        /*filterMood = filterMood.toLocaleLowerCase();
        filterData = filterData.filter(summary => {
            return !filterMood || summary.mood.toLowerCase().indexOf(filterMood) !== -1;
        });*/

        for (var i = 0; i < filterData.length; i++){
            // hour.push(filterData[i].date.getHours());
            intensity.push(filterData[i].intensity);
        }

        // return hour;
        return intensity;

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
        } else if (this.inputType == "Last month"){
            var today = new Date();
            var firstdayCurr = new Date(today.setDate(1));
            this.endDate = new Date(today.setDate(today.getDate()-1));
            var count = today.getDate()-1;
            this.startDate = new Date(today.setDate(today.getDate()-count));
            filterData = this.filterSummarys(this.summaryMood, this.summaryIntensity, this.startDate, this.endDate);
        } else {
            filterData = this.filterSummarys(this.summaryMood, this.summaryIntensity, this.startDate, this.endDate);
        }

        // Filter by weekday
        if (this.inputType == "Last month"){
            filterData = filterData.filter(summary => {
                this.getDate = new Date(summary.date);
                return this.getDate.getDate() == weekday;
            });
        } else {


            filterData = filterData.filter(summary => {
                this.getDate = new Date(summary.date);
                return this.getDate.getDay() == weekday;
            });
        }

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
        var nextDay;
        for(var i=1; i<7; i++){
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
        var nextDay;
        for(var i=1; i<7; i++){
            nextDay = new Date(today.setDate(today.getDate()+1));
            days.push(this.getRightFormForDate(nextDay.getDate(), nextDay.getMonth(), nextDay.getFullYear()));
        }
        return days;
    }

    getLastMonthDate(){
        var days = [];
        var today = new Date();
        var firstdayCurr = new Date(today.setDate(1));
        var lastday = new Date(today.setDate(today.getDate()-1));
        var theDay = this.getRightFormForDate(lastday.getDate(), lastday.getMonth(), lastday.getFullYear())
        days.push(theDay);
        var preDay;
        var count = today.getDate();
        for (var i = 1; i < count; i++){
            preDay = new Date(today.setDate(today.getDate()-1));
            days.push(this.getRightFormForDate(preDay.getDate(), preDay.getMonth(), preDay.getFullYear()));
        }
        days.reverse();
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
                "borderColor":"rgb(0, 204, 0)",
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
                "borderColor":"rgb(0, 102, 204)",
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
                "borderColor":"rgb(96, 96, 96)",
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
                "borderColor":"rgb(204, 0, 0)",
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
                "borderColor":"rgb(204, 0, 204)",
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
                    labels: this.getThisWeekDate(),
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
                "borderColor":"rgb(0, 204, 0)",
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
                "borderColor":"rgb(0, 102, 204)",
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
                "borderColor":"rgb(96, 96, 96)",
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
                "borderColor":"rgb(204, 0, 0)",
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
                "borderColor":"rgb(204, 0, 204)",
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
                    labels: this.getLastWeekDate(),
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

        } else if (this.inputType == "Last month"){
            let happy_weekly_totals = {"label":"Happy",
                "data":[
                    this.filterGraph('1', 'happy'),
                    this.filterGraph('2', 'happy'),
                    this.filterGraph('3', 'happy'),
                    this.filterGraph('4', 'happy'),
                    this.filterGraph('5', 'happy'),
                    this.filterGraph('6', 'happy'),
                    this.filterGraph('7', 'happy'),
                    this.filterGraph('8', 'happy'),
                    this.filterGraph('9', 'happy'),
                    this.filterGraph('10', 'happy'),
                    this.filterGraph('11', 'happy'),
                    this.filterGraph('12', 'happy'),
                    this.filterGraph('13', 'happy'),
                    this.filterGraph('14', 'happy'),
                    this.filterGraph('15', 'happy'),
                    this.filterGraph('16', 'happy'),
                    this.filterGraph('17', 'happy'),
                    this.filterGraph('18', 'happy'),
                    this.filterGraph('19', 'happy'),
                    this.filterGraph('20', 'happy'),
                    this.filterGraph('21', 'happy'),
                    this.filterGraph('22', 'happy'),
                    this.filterGraph('23', 'happy'),
                    this.filterGraph('24', 'happy'),
                    this.filterGraph('25', 'happy'),
                    this.filterGraph('26', 'happy'),
                    this.filterGraph('27', 'happy'),
                    this.filterGraph('28', 'happy'),
                    this.filterGraph('29', 'happy'),
                    this.filterGraph('30', 'happy'),
                    this.filterGraph('31', 'happy'),
                ],
                hidden: false,
                "fill":false,
                "borderColor":"rgb(0, 204, 0)",
                "lineTension":0.1};

            let sad_weekly_totals = {"label":"Sad",
                "data":[
                    this.filterGraph('1', 'sad'),
                    this.filterGraph('2', 'sad'),
                    this.filterGraph('3', 'sad'),
                    this.filterGraph('4', 'sad'),
                    this.filterGraph('5', 'sad'),
                    this.filterGraph('6', 'sad'),
                    this.filterGraph('7', 'sad'),
                    this.filterGraph('8', 'sad'),
                    this.filterGraph('9', 'sad'),
                    this.filterGraph('10', 'sad'),
                    this.filterGraph('11', 'sad'),
                    this.filterGraph('12', 'sad'),
                    this.filterGraph('13', 'sad'),
                    this.filterGraph('14', 'sad'),
                    this.filterGraph('15', 'sad'),
                    this.filterGraph('16', 'sad'),
                    this.filterGraph('17', 'sad'),
                    this.filterGraph('18', 'sad'),
                    this.filterGraph('19', 'sad'),
                    this.filterGraph('20', 'sad'),
                    this.filterGraph('21', 'sad'),
                    this.filterGraph('22', 'sad'),
                    this.filterGraph('23', 'sad'),
                    this.filterGraph('24', 'sad'),
                    this.filterGraph('25', 'sad'),
                    this.filterGraph('26', 'sad'),
                    this.filterGraph('27', 'sad'),
                    this.filterGraph('28', 'sad'),
                    this.filterGraph('29', 'sad'),
                    this.filterGraph('30', 'sad'),
                    this.filterGraph('31', 'sad'),
                ],
                hidden: false,
                "fill":false,
                "borderColor":"rgb(0, 102, 204)",
                "lineTension":0.1};

            let meh_weekly_totals = {"label":"Meh",
                "data":[
                    this.filterGraph('1', 'meh'),
                    this.filterGraph('2', 'meh'),
                    this.filterGraph('3', 'meh'),
                    this.filterGraph('4', 'meh'),
                    this.filterGraph('5', 'meh'),
                    this.filterGraph('6', 'meh'),
                    this.filterGraph('7', 'meh'),
                    this.filterGraph('8', 'meh'),
                    this.filterGraph('9', 'meh'),
                    this.filterGraph('10', 'meh'),
                    this.filterGraph('11', 'meh'),
                    this.filterGraph('12', 'meh'),
                    this.filterGraph('13', 'meh'),
                    this.filterGraph('14', 'meh'),
                    this.filterGraph('15', 'meh'),
                    this.filterGraph('16', 'meh'),
                    this.filterGraph('17', 'meh'),
                    this.filterGraph('18', 'meh'),
                    this.filterGraph('19', 'meh'),
                    this.filterGraph('20', 'meh'),
                    this.filterGraph('21', 'meh'),
                    this.filterGraph('22', 'meh'),
                    this.filterGraph('23', 'meh'),
                    this.filterGraph('24', 'meh'),
                    this.filterGraph('25', 'meh'),
                    this.filterGraph('26', 'meh'),
                    this.filterGraph('27', 'meh'),
                    this.filterGraph('28', 'meh'),
                    this.filterGraph('29', 'meh'),
                    this.filterGraph('30', 'meh'),
                    this.filterGraph('31', 'meh'),
                ],
                hidden: false,
                "fill":false,
                "borderColor":"rgb(96, 96, 96)",
                "lineTension":0.1};

            let mad_weekly_totals = {"label":"Mad",
                "data":[
                    this.filterGraph('1', 'mad'),
                    this.filterGraph('2', 'mad'),
                    this.filterGraph('3', 'mad'),
                    this.filterGraph('4', 'mad'),
                    this.filterGraph('5', 'mad'),
                    this.filterGraph('6', 'mad'),
                    this.filterGraph('7', 'mad'),
                    this.filterGraph('8', 'mad'),
                    this.filterGraph('9', 'mad'),
                    this.filterGraph('10', 'mad'),
                    this.filterGraph('11', 'mad'),
                    this.filterGraph('12', 'mad'),
                    this.filterGraph('13', 'mad'),
                    this.filterGraph('14', 'mad'),
                    this.filterGraph('15', 'mad'),
                    this.filterGraph('16', 'mad'),
                    this.filterGraph('17', 'mad'),
                    this.filterGraph('18', 'mad'),
                    this.filterGraph('19', 'mad'),
                    this.filterGraph('20', 'mad'),
                    this.filterGraph('21', 'mad'),
                    this.filterGraph('22', 'mad'),
                    this.filterGraph('23', 'mad'),
                    this.filterGraph('24', 'mad'),
                    this.filterGraph('25', 'mad'),
                    this.filterGraph('26', 'mad'),
                    this.filterGraph('27', 'mad'),
                    this.filterGraph('28', 'mad'),
                    this.filterGraph('29', 'mad'),
                    this.filterGraph('30', 'mad'),
                    this.filterGraph('31', 'mad'),
                ],
                hidden: false,
                "fill":false,
                "borderColor":"rgb(204, 0, 0)",
                "lineTension":0.1};

            let scared_weekly_totals = {"label":"Scared",
                "data":[
                    this.filterGraph('1', 'scared'),
                    this.filterGraph('2', 'scared'),
                    this.filterGraph('3', 'scared'),
                    this.filterGraph('4', 'scared'),
                    this.filterGraph('5', 'scared'),
                    this.filterGraph('6', 'scared'),
                    this.filterGraph('7', 'scared'),
                    this.filterGraph('8', 'scared'),
                    this.filterGraph('9', 'scared'),
                    this.filterGraph('10', 'scared'),
                    this.filterGraph('11', 'scared'),
                    this.filterGraph('12', 'scared'),
                    this.filterGraph('13', 'scared'),
                    this.filterGraph('14', 'scared'),
                    this.filterGraph('15', 'scared'),
                    this.filterGraph('16', 'scared'),
                    this.filterGraph('17', 'scared'),
                    this.filterGraph('18', 'scared'),
                    this.filterGraph('19', 'scared'),
                    this.filterGraph('20', 'scared'),
                    this.filterGraph('21', 'scared'),
                    this.filterGraph('22', 'scared'),
                    this.filterGraph('23', 'scared'),
                    this.filterGraph('24', 'scared'),
                    this.filterGraph('25', 'scared'),
                    this.filterGraph('26', 'scared'),
                    this.filterGraph('27', 'scared'),
                    this.filterGraph('28', 'scared'),
                    this.filterGraph('29', 'scared'),
                    this.filterGraph('30', 'scared'),
                    this.filterGraph('31', 'scared'),
                ],
                hidden: false,
                "fill":false,
                "borderColor":"rgb(204, 0, 204)",
                "lineTension":0.1};

            let anxious_weekly_totals = {"label":"Anxious",
                "data":[
                    this.filterGraph('1', 'anxious'),
                    this.filterGraph('2', 'anxious'),
                    this.filterGraph('3', 'anxious'),
                    this.filterGraph('4', 'anxious'),
                    this.filterGraph('5', 'anxious'),
                    this.filterGraph('6', 'anxious'),
                    this.filterGraph('7', 'anxious'),
                    this.filterGraph('8', 'anxious'),
                    this.filterGraph('9', 'anxious'),
                    this.filterGraph('10', 'anxious'),
                    this.filterGraph('11', 'anxious'),
                    this.filterGraph('12', 'anxious'),
                    this.filterGraph('13', 'anxious'),
                    this.filterGraph('14', 'anxious'),
                    this.filterGraph('15', 'anxious'),
                    this.filterGraph('16', 'anxious'),
                    this.filterGraph('17', 'anxious'),
                    this.filterGraph('18', 'anxious'),
                    this.filterGraph('19', 'anxious'),
                    this.filterGraph('20', 'anxious'),
                    this.filterGraph('21', 'anxious'),
                    this.filterGraph('22', 'anxious'),
                    this.filterGraph('23', 'anxious'),
                    this.filterGraph('24', 'anxious'),
                    this.filterGraph('25', 'anxious'),
                    this.filterGraph('26', 'anxious'),
                    this.filterGraph('27', 'anxious'),
                    this.filterGraph('28', 'anxious'),
                    this.filterGraph('29', 'anxious'),
                    this.filterGraph('30', 'anxious'),
                    this.filterGraph('31', 'anxious'),
                ],
                hidden: false,
                "fill":false,
                "borderColor":"rgb(150, 0, 100)",
                "lineTension":0.1};

            this.myChart = new Chart(this.ctx, {
                type: 'line',
                data: {
                    labels: this.getLastMonthDate(),
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

    }

    buildChart(): void {

        this.canvas = document.getElementById("myChart");
        this.ctx = this.canvas;

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
            "borderColor":"rgb(0, 204, 0)",
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
            "borderColor":"rgb(0, 102, 204)",
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
            "borderColor":"rgb(96, 96, 96)",
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
            "borderColor":"rgb(204, 0, 0)",
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
            "borderColor":"rgb(204, 0, 204)",
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
                labels: this.getThisWeekDate(),
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

        /*var xlabel = this.filterGraphForHour();

        this.myChart = new Chart(this.ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Scatter Dataset',
                    data: [{
                        x: xlabel[0],
                        y: 0
                    }, {
                        x: xlabel[1],
                        y: 10
                    }, {
                        x: xlabel[2],
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
*/
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

