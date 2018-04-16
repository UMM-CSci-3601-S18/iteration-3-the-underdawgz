
import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {Resource} from "./resource";
import {ResourcesComponent} from "./resources.component";
import {ResourcesService} from "./resources.service"
import {Observable} from 'rxjs/Observable';
import {FormsModule} from '@angular/forms';
import {CustomModule} from '../custom.module';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import {MatDialog} from '@angular/material';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';

describe('Resource ', () => {

    let Resource: ResourcesComponent;
    let fixture: ComponentFixture<ResourcesComponent>;

    let ResourceServiceStub: {
        getResources: () => Observable<Resource[]>
    };

    beforeEach(() => {
        // stub ResourceService for test purposes
        ResourceServiceStub = {
            getResources: () => Observable.of([
                {
                    _id: '1',
                    title: 'Youtube',
                    link: 'https://www.youtube.com/',

                },
                {
                    _id: '2',
                    title: 'Google',
                    link: 'https://www.google.com/',

                },
                {
                    _id: '3',
                    title: 'Instagram',
                    link: 'https://www.instagram.com/',

                }
            ])
        };

        TestBed.configureTestingModule({
            imports: [CustomModule],
            declarations: [ResourcesComponent],
            providers: [{provide: ResourcesService, useValue: ResourceServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(ResourcesComponent);
            Resource = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));





});






describe('Misbehaving Resource ', () => {
    let Resource: ResourcesComponent;
    let fixture: ComponentFixture<ResourcesComponent>;

    let ResourceServiceStub: {
        getResources: () => Observable<Resource[]>
    };

    beforeEach(() => {
        // stub ResourceService for test purposes
        ResourceServiceStub = {
            getResources: () => Observable.create(observer => {
                observer.error('Error-prone observable');
            })
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule],
            declarations: [ResourcesComponent],
            providers: [{provide: ResourcesService, useValue: ResourceServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(ResourcesComponent);
            Resource = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    /*it('generates an error if we don\'t set up a ResourceService', () => {
        // Since the observer throws an error, we don't expect Resources to be defined.
        expect(Resource.resources).toBeUndefined();
    });*/
});





describe('Adding a Resource', () => {
    let Resource: ResourcesComponent;
    let fixture: ComponentFixture<ResourcesComponent>;
    const newResource: Resource = {
        _id: '5',
        title: 'Facebook',
        link: 'https://www.facebook.com/',
    };
    const newId = '5';

    let calledResources: Resource;

    let ResourceServiceStub: {
        getResources: () => Observable<Resource[]>,
        addNewResource: (newResource: Resource) => Observable<{'$oid': string}>
    };
    let mockMatDialog: {
        open: (AddResourceComponent, any) => {
            afterClosed: () => Observable<Resource>
        };
    };

    beforeEach(() => {
        calledResources = null;
        // stub ResourceService for test purposes
        ResourceServiceStub = {
            getResources: () => Observable.of([]),
            addNewResource: (ResourceToAdd: Resource) => {
                calledResources = ResourceToAdd;
                return Observable.of({
                    '$oid': newId
                });
            }
        };
        mockMatDialog = {
            open: () => {
                return {
                    afterClosed: () => {
                        return Observable.of(newResource);
                    }
                };
            }
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule],
            declarations: [ResourcesComponent],
            providers: [
                {provide: ResourcesService, useValue: ResourceServiceStub},
                {provide: MatDialog, useValue: mockMatDialog},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(ResourcesComponent);
            Resource = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    /*it('calls ResourceService.addResource', () => {
        expect(calledResources).toBeNull();
        Resource.openDialog();
        expect(calledResources).toEqual(newResource);
    });*/
});


