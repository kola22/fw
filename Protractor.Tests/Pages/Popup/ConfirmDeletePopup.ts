import { Common } from "../../Common/Common";
import { Input } from "../Controls/Input";
import { Page, User } from "../Page";

export class ConfirmDeletePopup {
    constructor() {
        Common.Log("Confirm Delete Popup constructor");
    }

    public PassConfirm(sendTextInPopUp) {
        this.SetConfirmInput(sendTextInPopUp);
        if (sendTextInPopUp == 'delete'){
            this.DeleteClick();
        }else{
            expect(this.deleteBtn.getAttribute('class')).toContain('ui-text-button--disabled','Delete button: Disabled state')
            this.CancelClick();
        }
    }

    public SetConfirmInput(value: string) {
        Common.LogWithValue("ConfirmDeletePopup: SetConfirmInput value = ",value);
        this.deleteConfirmInput.SetValue(value,protractor.Key.TAB,true,false);
        browser.sleep(500);
    }

    public CancelClick() {
        Common.Log("ConfirmDeletePopup: CancelClick");
        this.cancelBtn.click();
        browser.sleep(500);
    }

    public DeleteClick() {
        Common.Log("ConfirmDeletePopup: DeleteClick");
        this.deleteBtn.click();
        browser.sleep(500);
    }

    private deleteXpath = "//*[contains(@class,'cps-delete-company-popup ui-empty-popup-content')]";
    private deleteConfirmInput: Input = Input.ByXpath(this.deleteXpath + Common.DateQaPath("cps-delete-company-popup__confirmation-input"));
    private cancelBtn = element(by.xpath(this.deleteXpath + Common.DateQaPath('cps-delete-company-popup__cancel-button')));
    private deleteBtn = element(by.xpath(this.deleteXpath + Common.DateQaPath('cps-delete-company-popup__delete-button')));
}