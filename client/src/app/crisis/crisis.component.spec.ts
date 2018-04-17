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

    let crisisNumberList: CrisisComponent;
    let fixture: ComponentFixture<CrisisComponent>;

    let crisisListServiceStub: {
        getCrisis: () => Observable<crisis[]>
    };

    beforeEach(() => {
        // stub CrisisService for test purposes
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
            crisisNumberList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('contains all the crisis', () => {
        expect(crisisNumberList.crisis.length).toBe(3);
    });

    it('contains a crisis with name \'Robert Ward\'', () => {
        expect(crisisNumberList.crisis.some((crisisNumber: crisis) => crisisNumber.name === 'Robert Ward')).toBe(true);
    });

    it('doesn\'t contain a user named \'Santa\'', () => {
        expect(crisisNumberList.crisis.some((crisisNumber: crisis) => crisisNumber.name === 'Santa')).toBe(false);
    });

    it('has two crisis with email', () => {
        expect(crisisNumberList.crisis.filter((crisisNumber: crisis) => crisisNumber.email === 'Ladonna@ Benson.com').length).toBe(1);
    });

    it('crisis list filters by name', () => {
        expect(crisisNumberList.filteredCrisis.length).toBe(3);
        crisisNumberList.crisisName = 'T';
        crisisNumberList.refreshCrisis().subscribe(() => {
            expect(crisisNumberList.filteredCrisis.length).toBe(2);
        });
    });

});

describe('Misbehaving Crisis List', () => {
    let crisisNumberList: CrisisComponent;
    let fixture: ComponentFixture<CrisisComponent>;

    let crisisListServiceStub: {
        getCrisis: () => Observable<crisis[]>
    };

    beforeEach(() => {
        // stub UserService for test purposes
        crisisListServiceStub = {
            getCrisis: () => Observable.create(observer => {
                observer.error('Error-prone observable');
            })
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule],
            declarations: [CrisisComponent],
            providers: [{provide: CrisisService, useValue: crisisListServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(CrisisComponent);
            crisisNumberList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('generates an error if we don\'t set up a crisisListService', () => {
        // Since the observer throws an error, we don't expect users to be defined.
        expect(crisisNumberList.crisis).toBeUndefined();
    });
});


describe('Adding a crisisNumber', () => {
    let crisisNumberList: CrisisComponent;
    let fixture: ComponentFixture<CrisisComponent>;
    const newCrisis: crisis = {
        _id: '5ab2bc37e194ff1f2434eb46',
        name: 'test man',
        email: "fefwaefjj@gsfewf.com",
        phone: "1715611615161"
    };
    const newId = 'new_id';

    let calledCrisis: crisis;

    let crisisListServiceStub: {
        getCrisis: () => Observable<crisis[]>,
        addNewCrisis: (newCrisis: crisis) => Observable<{'$oid': string}>
    };
    let mockMatDialog: {
        open: (AddCrisisComponent, any) => {
            afterClosed: () => Observable<crisis>
        };
    };

    beforeEach(() => {
        calledCrisis = null;
        // stub ResourceService for test purposes
        crisisListServiceStub = {
            getCrisis: () => Observable.of([]),
            addNewCrisis: (crisisNumberToAdd: crisis) => {
                calledCrisis = crisisNumberToAdd;
                return Observable.of({
                    '$oid': newId
                });
            }
        };
        mockMatDialog = {
            open: () => {
                return {
                    afterClosed: () => {
                        return Observable.of(newCrisis);
                    }
                };
            }
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule],
            declarations: [CrisisComponent],
            providers: [
                {provide: CrisisService, useValue: crisisListServiceStub},
                {provide: MatDialog, useValue: mockMatDialog},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(CrisisComponent);
            crisisNumberList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));
});
