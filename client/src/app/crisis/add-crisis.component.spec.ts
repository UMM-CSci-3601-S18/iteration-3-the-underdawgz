import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MatDialogRef, MAT_DIALOG_DATA, MATERIAL_COMPATIBILITY_MODE} from '@angular/material';

import {AddCrisisComponent} from "./add-crisis.component";
import {CustomModule} from '../custom.module';

describe('Add crisis component', () => {

    let addCrisisComponent: AddCrisisComponent;
    let calledClose: boolean;
    const mockMatDialogRef = {
        close() { calledClose = true; }
    };
    let fixture: ComponentFixture<AddCrisisComponent>;

    beforeEach(async( () => {
        TestBed.configureTestingModule({
            imports: [CustomModule],
            declarations: [AddCrisisComponent],
            providers: [
                { provide: MatDialogRef, useValue: mockMatDialogRef },
                { provide: MAT_DIALOG_DATA, useValue: null },
                { provide: MATERIAL_COMPATIBILITY_MODE, useValue: true }]
        }).compileComponents().catch(error => {
            expect(error).toBeNull();
        });
    }));

    beforeEach(() => {
        calledClose = false;
        fixture = TestBed.createComponent(AddCrisisComponent);
        addCrisisComponent = fixture.componentInstance;
    });

    it('closes properly', () => {
        addCrisisComponent.onNoClick();
        expect(calledClose).toBe(true);
    });
});
