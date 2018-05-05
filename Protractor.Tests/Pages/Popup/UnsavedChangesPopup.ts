import { Common } from "../../Common/Common";
import { Page } from "../Page";

export class UnsavedChangesPopup {

    constructor() {
        Page.Wait.ElementDisplayed(this.contentElement, "UnsavedChangesPopup");
    }

    public DiscardClick() {
        Common.Log("UnsavedChangesPopup discard click");
        Page.Wait.ElementDisplayed(this.discardBtn, "UnsavedChangesPopup discard button");
        this.discardBtn.click();

        browser.sleep(1000);
    }

    public ContinueEditClick() {
        Common.Log("UnsavedChangesPopup continue edit click");
        Page.Wait.ElementDisplayed(this.continueEditBtn, "UnsavedChangesPopup continue edit button");
        this.continueEditBtn.click();

        browser.sleep(1000);
    }

    private contentElement = element(by.css(".ui-unsaved-changes-popup-content"));
    private discardBtn = Common.ElementByDateQa("ui-unsaved-changes-popup-content__discard-button");
    private continueEditBtn = Common.ElementByDateQa("ui-unsaved-changes-popup-content__continue-button");
}