import { Common } from "../../Common/Common";
import { Page } from "../Page";

export class BaseWorkflowSettings {

    constructor() {
    }

    public CloseClick() {
        Common.Log("Workflow settings close click");
        Page.Wait.ElementDisplayed(this.closeBtn, "Workflow settings close click");

        this.closeBtn.click();
        browser.sleep(1000);
    }

    public SaveClick() {
        Common.Log("Workflow settings save click");
        Page.Wait.ElementDisplayed(this.saveBtn, "Workflow settings save click");

        this.saveBtn.click();
        browser.sleep(1000);
    }

    private closeBtn = Common.ElementByDateQa("ui-default-popup-content__close-button");
    private saveBtn = Common.ElementByDateQa("wfc-settings-popup__apply-and-close-button");
}
