import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MatDialogRef, MAT_DIALOG_DATA, MATERIAL_COMPATIBILITY_MODE} from '@angular/material';

import {EditCrisisComponent} from "./edit-crisis.component";

import {CustomModule} from '../custom.module';

describe('edit crisis component', () => {

    let editCrisisComponent: EditCrisisComponent;
    let calledClose: boolean;
    const mockMatDialogRef = {
        close() { calledClose = true; }
    };
    let fixture: ComponentFixture<EditCrisisComponent>;

    beforeEach(async( () => {
        TestBed.configureTestingModule({
            imports: [CustomModule],
            declarations: [EditCrisisComponent],
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
        fixture = TestBed.createComponent(EditCrisisComponent);
        editCrisisComponent = fixture.componentInstance;
    });

    it('closes properly', () => {
        editCrisisComponent.onNoClick();
        expect(calledClose).toBe(true);
    });
});
