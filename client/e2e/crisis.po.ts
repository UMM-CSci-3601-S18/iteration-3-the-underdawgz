import {browser, element, by, promise} from 'protractor';
import {Key} from 'selenium-webdriver';

export class CrisisPage {
    static navigateTo(): promise.Promise<any> {
        return browser.get('/crisis');
    }

    static clickElement(elementId: string){
        const input = element(by.id(elementId));
        input.click();
    }

    // http://www.assertselenium.com/protractor/highlight-elements-during-your-protractor-test-run/
    highlightElement(byObject) {
        function setStyle(element, style) {
            const previous = element.getAttribute('style');
            element.setAttribute('style', style);
            setTimeout(() => {
                element.setAttribute('style', previous);
            }, 200);
            return 'highlighted';
        }
        return browser.executeScript(setStyle, element(byObject).getWebElement(), 'color: red; background-color: yellow;');
    }

    getCrisisTitle() {
        const title = element(by.id('crisisTitle')).getText();
        this.highlightElement(by.id('crisisTitle'));
        return title;
    }

    getUniqueContact(email: string) {
        const contact = element(by.id(email)).getText();
        this.highlightElement(by.id(email));

        return contact;
    }

    clickCrisisButton():promise.Promise<void> {
        this.highlightElement(by.id('crisisButton'));
        return element(by.id('crisisButton')).click();

    }

    buttonExists(): promise.Promise<boolean> {
        this.highlightElement(by.id('addNewResources'));
        return element(by.id('addNewResources')).isPresent();
    }

    clickAddContactButton(): promise.Promise<void> {
        this.highlightElement(by.id('addNewResources'));
        return element(by.id('addNewResources')).click();
    }
}
