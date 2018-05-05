import { Page } from "../Page";
import { Common } from "../../Common/Common";
import { Input } from "./Input";

export class SearcheControl {
    constructor(private input: Input, closeBtnLocator: webdriver.Locator) {
        this.closeBtn = element(closeBtnLocator);
    }

    public SetValue(value: string) {
        Common.Log("SearcheControl filter");
        this.input.SetValue(value);
        browser.sleep(1000);
    }
    public CloseClick() {
        Common.Log("SearcheControl close");
        this.closeBtn.click();
        browser.sleep(1000);
    }

    private closeBtn: protractor.ElementFinder;
}