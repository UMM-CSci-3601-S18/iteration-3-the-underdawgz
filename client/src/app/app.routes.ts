// Imports
import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {ResourcesComponent} from "./resources/resources.component";
import {GoalsComponent} from "./goals/goals.component";
import {JournalsComponent} from "./Journal/journals.component";

import {MatSliderModule} from '@angular/material/slider';
import {SummaryListComponent} from "./summary/summary-list.component";
import {CrisisComponent} from "./crisis/crisis.component";
// Route Configuration
export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'resources', component: ResourcesComponent},
    {path: 'goals', component: GoalsComponent},
    {path: 'journals', component: JournalsComponent},

    {path: 'summary', component: SummaryListComponent},
    {path: 'crisis', component: CrisisComponent},

];

export const Routing: ModuleWithProviders = RouterModule.forRoot(routes);
