import { Common } from "../../Common/Common";
import { Page } from "../Page";

export class WarningXeroCompanyChange {

    constructor() {
        Page.Wait.ElementDisplayed(this.popUpWarning, "popUpWarning",90000);
        browser.sleep(2000);
        this.CheckText(this.text);
        Page.Wait.ElementDisplayed(this.cancelButton, "cancelButton",90000);
        browser.sleep(1000);
        this.ClickCancel();
        browser.sleep(1000);
}

    private CheckText(text) {
        Common.Log("WarningXeroCompanyChange: CheckText ");
        expect(this.textBlock.getText()).toContain(text, "Warning text");
    }

    private ClickCancel() {
        Common.Log("WarningXeroCompanyChange: ClickCancel");
        this.cancelButton.click();
    }

    private popUpWarning = element(by.css(".am-popup_override_xero"));
    private companyName = "qa_qa_test";
    private text = 'You are trying to connect ApprovalMax company "'+this.companyName+'" to a different Xero company. Previously it was connected to Xero company "test". Such change can not be done due to technical reasons. Please create another ApprovalMax company for your new Xero company. Should you have any questions, please contact us at ';
    private textBlock = element(by.css(".override-xero-hint"));

    private cancelButton = element(by.css("#closeOverride"));
}