import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MATERIAL_COMPATIBILITY_MODE } from '@angular/material';
import {HttpClientModule} from '@angular/common/http';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {Routing} from './app.routes';
import {APP_BASE_HREF} from '@angular/common';
import {CustomModule} from './custom.module';



import {EmotionService} from "./home/home.service";

import {GoalsComponent} from "./goals/goals.component";
import {GoalsService} from "./goals/goals.service";
import {EditGoalComponent} from "./goals/edit-goal.component";
import {AddGoalComponent} from "./goals/add-goal.component";

import {EmotionResponseComponent} from "./home/emotion-response.component";
import {EmotionResponseHappyComponent} from "./home/emotion-response-happy.component";
import {EmotionResponseSadComponent} from "./home/emotion-response-sad.component";
import {EmotionResponseMadComponent} from "./home/emotion-response-mad.component";
import {EmotionResponseScaredComponent} from "./home/emotion-response-scared.component";
import {EmotionResponseAnxiousComponent} from "./home/emotion-response-anxious.component";

import {SummaryListComponent} from "./summary/summary-list.component";
import {SummaryListService} from "./summary/summary-list.service";

import {JournalsComponent} from "./Journal/journals.component";
import {AddJournalComponent} from "./Journal/add-journal.component";
import {JournalsService} from "./Journal/journals.service";

import {CrisisComponent} from "./crisis/crisis.component";
import {CrisisService} from "./crisis/crisis.service";
import {AddCrisisComponent} from "./crisis/add-crisis.component";
import {CrisisButtonComponent} from "./crisis/crisis-button.component";
import {EditCrisisComponent} from "./crisis/edit-crisis.component";

import {AddResourceComponent} from "./resources/add-resource.component";
import {ResourcesService} from "./resources/resources.service";
import {ResourcesComponent} from "./resources/resources.component";


@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        Routing,
        CustomModule,
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        ResourcesComponent,
        AddResourceComponent,

        GoalsComponent,
        AddGoalComponent,

        JournalsComponent,
        AddJournalComponent,

        EditGoalComponent,
        SummaryListComponent,
        EmotionResponseComponent,
        EmotionResponseHappyComponent,

        CrisisComponent,
        AddCrisisComponent,
        CrisisButtonComponent,
        EditCrisisComponent,

        EmotionResponseHappyComponent,
        EmotionResponseSadComponent,
        EmotionResponseMadComponent,
        EmotionResponseScaredComponent,
        EmotionResponseAnxiousComponent,
    ],
    providers: [
    GoalsService,
    JournalsService,
    ResourcesService,
    EmotionService,
        CrisisService,
    SummaryListService,
    {provide: APP_BASE_HREF, useValue: '/'},
    {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}
],
    entryComponents: [

        AddGoalComponent,
        EditGoalComponent,
        EmotionResponseComponent,
        EmotionResponseHappyComponent,
        AddJournalComponent,
        AddCrisisComponent,
        EmotionResponseSadComponent,
        EmotionResponseMadComponent,
        EmotionResponseScaredComponent,
        EmotionResponseAnxiousComponent,
        AddJournalComponent,
        CrisisButtonComponent,
        EditCrisisComponent,
        AddJournalComponent,

        AddResourceComponent,
        EmotionResponseSadComponent,
        EmotionResponseMadComponent,
        EmotionResponseScaredComponent,
        EmotionResponseAnxiousComponent

    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}
