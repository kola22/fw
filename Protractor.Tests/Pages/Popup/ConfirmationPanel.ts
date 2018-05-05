import { Common } from "../../Common/Common";
import { Page } from "../Page";

export class ConfirmationPanel {

    constructor() {
        Common.Log("ConfirmationPanel");
        Page.Wait.ElementDisplayed(this.panel, "ConfirmationPanel");
    }

    public ClickYes() {
        Common.Log("ConfirmationPanel: click yes");
        this.yesBtn.click();
        Page.Wait.ElementNotDisplayed(this.panel, "ConfirmationPanel");
    }

    public ClickNo() {
        Common.Log("ConfirmationPanel: click no");
        this.noBtn.click();
        Page.Wait.ElementNotDisplayed(this.panel, "ConfirmationPanel");
    }

    private panel = element(by.css(".ui-action-menu-item__confirmation-panel"));
    private yesBtn = Common.ElementByDateQa("ui-action-menu-item__confirmation-yes-button");

    private noBtn = Common.ElementByDateQa("ui-action-menu-item__confirmation-no-button");
}