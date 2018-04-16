
import {ResourcePage} from './resources.po';
import {browser, protractor, element, by} from 'protractor';

/*const origFn = browser.driver.controlFlow().execute;
browser.driver.controlFlow().execute = function () {
    let args = arguments;
    // queue 100ms wait between test
    // This delay is only put here so that you can watch the browser do its thing.
    origFn.call(browser.driver.controlFlow(), function () {
       return protractor.promise.delayed(100);
    });
    return origFn.apply(browser.driver.controlFlow(), args);
 };*/

describe('Resource list', () => {
    let page: ResourcePage;

    beforeEach(() => {
        page = new ResourcePage();
    });



    it('Should check that resource with name: \'Less Anger\' matches unique id', () => {
        page.navigateTo();
        expect(page.getUniqueResource('6ab41f14aafb083c32f58246')).toContain('Less Anger');
    });

    it('Total number of resources should be 1', () => {
        page.navigateTo();
        expect(page.getResources()).toEqual(1);
    });



    it('Should have an add resource button', () => {
        page.navigateTo();
        expect(page.buttonExists()).toBeTruthy();
    });



});
