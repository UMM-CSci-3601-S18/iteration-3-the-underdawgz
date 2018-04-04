import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {crisis} from './crisis';
import {CrisisComponent} from "./crisis.component";
import {CrisisService} from "./crisis.service";
import {Observable} from 'rxjs/Observable';
import {FormsModule} from '@angular/forms';
import {CustomModule} from '../custom.module';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import {MatDialog} from '@angular/material';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';

describe('Crisis list', () => {

    let crisisList: CrisisComponent;
    let fixture: ComponentFixture<CrisisComponent>;

    let crisisListServiceStub: {
        getCrisis: () => Observable<crisis[]>
    };

    beforeEach(() => {
        // stub ResourceService for test purposes
        crisisListServiceStub = {
            getCrisis: () => Observable.of([
                {
                    _id: '5ab2bc3742f5a7b6f0f48626',
                    name: 'Robert Ward',
                    email: 'Ladonna@ Benson.com',
                    phone: '(891) 411-3124',

                },
                {
                    _id: '5ab2bc37bc8681f8f0ddf797',
                    name: 'Thomas Franco',
                    email: 'Lila@ Browning.com',
                    phone: '(803) 525-2495',
                },
                {
                    _id: '5ab2bc370290adc56f8065fc',
                    name: 'Wood Aguirre',
                    email: 'Alford@ Beard.com',
                    phone: '(862) 433-3136',
                }
            ])
        };

        TestBed.configureTestingModule({
            imports: [CustomModule],
            declarations: [CrisisComponent],
            // providers:    [ UserListService ]  // NO! Don't provide the real service!
            // Provide a test-double instead
            providers: [{provide: CrisisService, useValue: crisisListServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(CrisisComponent);
            crisisList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('contains all the crisis', () => {
        expect(crisisList.crisis.length).toBe(3);
    });

    it('contains a crisis with name \'Robert Ward\'', () => {
        expect(crisisList.crisis.some((crisis: crisis) => crisis.name === 'Robert Ward')).toBe(true);
    });

    it('doesn\'t contain a user named \'Santa\'', () => {
        expect(crisisList.crisis.some((crisis: crisis) => crisis.name === 'Santa')).toBe(false);
    });

    it('has two crisis with email', () => {
        expect(crisisList.crisis.filter((crisis: crisis) => crisis.email === 'Ladonna@ Benson.com').length).toBe(1);
    });

});
