/*

import {ResourcesPage} from './resources.po';
import {browser, protractor, element, by} from 'protractor';

/!*const origFn = browser.driver.controlFlow().execute;
browser.driver.controlFlow().execute = function () {
    let args = arguments;
    // queue 100ms wait between test
    // This delay is only put here so that you can watch the browser do its thing.
    origFn.call(browser.driver.controlFlow(), function () {
       return protractor.promise.delayed(100);
    });
    return origFn.apply(browser.driver.controlFlow(), args);
 };*!/

describe('Resource list', () => {
    let page: ResourcesPage;

    beforeEach(() => {
        page = new ResourcesPage();
    });

    it('Should get and highlight Resources title attribute ', () => {
        page.navigateTo();
        expect(page.getResourceManageTitle()).toEqual('Your Resources');
    });

    it('Should check that resource with name: \'Go to bed early\' matches unique id', () => {
        page.navigateTo();
        expect(page.getUniqueResource('5ab53a8944c7c6b223090477')).toContain('Go to bed early');
    });

    it('Total number of resources should be 15', () => {
        page.navigateTo();
        expect(page.getResources()).toEqual(15);
    });

    it('Should check that resource with purpose: \'To surprise Bobby\' matches unique id', () => {
        page.navigateTo();
        expect(page.getUniqueResource('5ab53a894b28008631e64eb6')).toContain('To surprise Bobby');
    });

    it('Should check that resource with status: \'Incomplete\' matches unique id', () => {
        page.navigateTo();
        expect(page.getUniqueResource('5ab53a89ea32d59c4e81d5f0')).toContain('Status: Incomplete');
    });

    it('Should check that resource with status: \'Complete\' matches unique id', () => {
        page.navigateTo();
        expect(page.getUniqueResource('5ab53a8907d923f68d03e1a3')).toContain('Status: Complete');
    });

    it('Should have an add resource button', () => {
        page.navigateTo();
        expect(page.buttonExists()).toBeTruthy();
    });

    it('Should open a dialog box when add resource button is clicked', () => {
        page.navigateTo();
        expect(element(by.className('add-resource')).isPresent()).toBeFalsy('There should not be a modal window yet');
        element(by.className('resource-button')).click();
        expect(element(by.className('add-resource')).isPresent()).toBeTruthy('There should be a modal window now');
    });

    it('Should actually add the resource with the information we put in the fields', () => {
        page.navigateTo();
        page.clickAddResourceButton();
        element(by.id('nameField')).sendKeys('Clean up computer lab');
        page.pickChoresOption();
        element(by.id('purposeField')).sendKeys('Get more people to come');
        page.actuallyAddResource();
    });

    it('Should click check button to change resource to complete', () => {
        page.navigateTo();
        expect(page.getUniqueResource('5ab53a89ea32d59c4e81d5f0')).toContain('Status: Incomplete');
        expect(element(by.id('completeResource')).isPresent()).toBeTruthy('There should be a \'complete resource\' green check button');
        element(by.id('completeResource')).click();
    });

});*/
