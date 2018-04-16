import {browser, element, by, promise, ElementFinder} from 'protractor';
import {Key} from 'selenium-webdriver';

export class ResourcePage {

    navigateTo(): promise.Promise<any> {
        return browser.get('/resources');
    }

    highlightElement(byObject) {
        function setStyle(element, style) {
            const previous = element.getAttribute('style');
            element.setAttribute('style', style);
            setTimeout(() => {
                element.setAttribute('style', previous);
            }, 100);
            return 'highlighted';
        }

        return browser.executeScript(setStyle, element(byObject).getWebElement(), 'color: red; background-color: yellow;');
    }

    getResourceManageTitle() {
        const title = element(by.id('resource-title')).getText();
        this.highlightElement(by.id('resource-title'));

        return title;
    }

    selectEnter() {
        browser.actions().sendKeys(Key.ENTER).perform();
    }

    getUniqueResource(anID: string) {
        const resource = element(by.id(anID)).getText();
        this.highlightElement(by.id(anID));

        return resource;
    }

    getResources() {
        return element.all(by.className('resources-card')).count();
    }

    buttonExists(): promise.Promise<boolean> {
        this.highlightElement(by.id('addNewResource'));
        return element(by.id('addNewResource')).isPresent();
    }

    clickAddResourceButton(): promise.Promise<void> {
        this.highlightElement(by.className('resource-button'));
        return element(by.className('resource-button')).click();
    }

    pickChoresOption(){
        const input = element(by.id('category-list'));
        input.click();
        this.selectEnter();
    }

    actuallyAddResource() {
        const input = element(by.id('confirmAddResourceButton'));
        input.click();
    }

}
