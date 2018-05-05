/// <autosync enabled="true" />
/// <reference path="../Scripts/typings/angular-protractor/angular-protractor.d.ts" />
/// <reference path="../conf.ts" />
import Promise = protractor.promise.Promise;
import Locator = webdriver.Locator;
import { Common } from "../Common/Common";

export class User {
    constructor(public Email: string, public Password: string) {
    }
}

export module Page {

    export module Config {

        export module Urls {

            export const Main: string = "https://www.approvalmax.com/";
            //export const TestApp: string = "http://devapp02.approvalmax.com";
            export const TestApp: string = "http://testapp.approvalmax.com/";

        }

        export const testUser = new User("approvalmaxtests2203@aktivsystems.ru", "AMfullacO1AM_");
        // export const testUser = new User("QB_approvalmax@aktivsystems.ru", "AMfullacO1AM_");
        // export const qbUser = new User("amqbtest@yandex.ru", "AMfullacO1AM_");
        export const qbUser = new User("QB_approvalmax2@aktivsystems.ru", "AMfullacO1AM_");
        export const secondXeroCompany = new User("eoj03izh.rv2@20mail.eu", "AMfullacO1AM_");

        export const spieSleepFactor = 1;
        export const defaultStepName = 'Approval step';

        export const secondXeroCompanyName = 'SCND_2_II';
    }


    export module Wait {
        export function Url(url: string, timeout: number = 30000, message: string = "url has not changed") {
            Common.Log('Wait for url "' + url + '"');
            return browser.wait(function () {
                return browser.getCurrentUrl().then(function (currentUrl: string) {
                    return currentUrl.trim() === url.trim();
                });
            }, timeout, message);
        }

        export function UrlContains(url: string, timeout: number = 30000, message: string = "url has not changed") {
            Common.Log('Wait for url "' + url + '"');
            return browser.wait(function () {
                return browser.getCurrentUrl().then(function (currentUrl: string) {
                    return currentUrl.trim().indexOf(url.trim())>=0;
                });
            }, timeout, message);
        }

        export function Element(target: protractor.ElementFinder, name: string, timeout: number = 30000) {
            return browser.driver.wait(() => { return target.isPresent(); }, timeout, 'Element "' + name + '" not present.');
        }

        export function ElementDisplayed(target: protractor.ElementFinder, elementName: string, timeout: number = 30000) {
            return browser.driver.wait(() => { return Common.PresentAndDisplayed(target); }, timeout, elementName + " not displayed");
        }

        export function ElementNotDisplayed(target: protractor.ElementFinder, elementName: string, timeout: number = 30000) {

            return browser.driver.wait(() => { return Common.PresentAndDisplayed(target).then((r) => { return !r; }); }, timeout, elementName + " is displayed");
        }

        export function ElementNotPresent(target: protractor.ElementFinder, elementName: string, timeout: number = 30000) {

            return browser.driver.wait(() => { return target.isPresent().then((r) => { return !r; }); }, timeout, elementName + " is present");
        }

        export function pageWait(stategy: Locator, timeout: number = 30000, errorMsg?: string) {
            return browser.driver.wait(() => { return element(stategy).isPresent(); }, timeout, errorMsg + "  Element not present: " + stategy.toString());
        }

        export function Condition(condition: webdriver.promise.Promise<boolean>, timeout: number = 30000, errorMsg?: string) {
            return browser.driver.wait(() => { return condition; }, timeout, errorMsg);
        }

        export function pageWaitNotPresent(stategy: Locator, timeout: number = 30000) {
            return browser.driver.wait(() => { return element(stategy).isPresent().then((r) => { return !r; }); }, timeout, "Element still present: " + stategy.toString());
        }

        export function pageWaitNotDisplayed(stategy: Locator, timeout: number = 30000) {
            return browser.driver.wait(() => { return Common.PresentAndDisplayed(element(stategy)).then((r) => { return !r; }); }, timeout, "Element still dispayed: " + stategy.toString());
        }


        export function CssCreation(cssSelector: string, timeout?: number) {
            return Page.Wait.pageWait(by.css(cssSelector), timeout);
        }

        export function CssNotPresent(cssSelector: string, timeout?: number) {
            return Page.Wait.pageWaitNotPresent(by.css(cssSelector), timeout);
        }

        export function TextNotPresent(elementText: string, timeout?: number) {
            return Page.Wait.pageWaitNotPresent(by.xpath("//*[contains(text(),'" + elementText + "')]"), timeout);
        }

        export function IdCreation(id: string, timeout?: number) {
            return Page.Wait.pageWait(by.id(id), timeout);
        }

        export function XpathCreation(xpathSelector: string, timeout?: number, errorMsg?: string) {
            return Page.Wait.pageWait(by.xpath(xpathSelector), timeout, errorMsg);
        }

        export function XpathNotPresent(xpathSelector: string, timeout?: number) {
            return Page.Wait.pageWaitNotPresent(by.xpath(xpathSelector), timeout);
        }

        export function XpathNotDisplayed(xpathSelector: string, timeout?: number) {
            return Page.Wait.pageWaitNotDisplayed(by.xpath(xpathSelector), timeout);
        }

        export function IdNotPresent(id: string, timeout?: number) {
            return Page.Wait.pageWaitNotPresent(by.id(id), timeout);
        }

        export function TextCreation(elementText: string, timeout?: number) {
            return Page.Wait.pageWait(by.xpath("//*[contains(text(),'" + elementText + "')]"), timeout);
        }

        export function ClassWithTextCreation(elementClass: string, elementText: string, timeout?: number) {
            return Page.Wait.pageWait(by.xpath("//*[contains(@class, '" + elementClass + "') and contains(text(),'" + elementText + "')]"), timeout);
        }

    }

    export module Navigate {
        export function ByUrl(url: string, ignoreSynchronization: boolean = true) {
            Common.LogWithValue("Prepare Browser by url: ",url);

            browser.ignoreSynchronization = ignoreSynchronization;
            //thenCatch is depricated
            //https://github.com/SeleniumHQ/selenium/blob/master/javascript/node/selenium-webdriver/CHANGES.md
            //but in d.ts not removed
            (<any>browser.driver.get(url)).catch(function (err) {
                Common.LogBug('browser get on catch "' + err + '"');
            });
            browser.switchTo().alert().then(function () {
                browser.switchTo().alert().accept();
            }, function () { });
        }

        export function Main() {
            ByUrl(Page.Config.Urls.Main);
        }

        export function TestApp() {
            ByUrl(Page.Config.Urls.TestApp);
            browser.executeScript("changeApiUrl('testapi.approvalmax.com', true)");
            browser.sleep(1000);
        }
    }

    export function pressEnter() {
        browser.driver.actions().sendKeys(protractor.Key.ENTER).perform();
    }

    export function pressTab() {
        browser.driver.actions().sendKeys(protractor.Key.TAB).perform();
    }

    export function pressEsc() {
        browser.driver.actions().sendKeys(protractor.Key.ESCAPE).perform();
    }

}