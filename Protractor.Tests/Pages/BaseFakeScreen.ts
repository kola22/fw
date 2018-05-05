import { Page } from "./Page";
import { Common } from "../Common/Common";

export class BaseFakeScreen {

    constructor() {
        Common.Log("BaseFakeScreen constructor");
        // browser.sleep(2000);
        Page.Wait.Element(this.fakeScreenElement, "Fake screen");
        Page.Wait.ElementNotPresent(this.fakeScreenDisplayedElement, "Fake screen",60000);
        browser.sleep(1000);
    }

    private fakeScreenElement: protractor.ElementFinder = element(by.id("fakeScreen"));
    private fakeScreenDisplayedElement: protractor.ElementFinder = element(by.xpath("//*[@id='fakeScreen'][contains(@style,'display: block')]"));
}