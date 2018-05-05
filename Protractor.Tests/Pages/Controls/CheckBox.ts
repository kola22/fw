import { Page } from "../Page";
import { Common } from "../../Common/Common";
import { CheckBoxState, EnabledState } from "../../Common/Enums";

export class CheckBox {

    constructor(private qaValue: string, enabledState: EnabledState = EnabledState.Enabled) {
        this.CheckEnabled(enabledState)
    }

    public Click(state: CheckBoxState = null) {
        Common.Log("Click to CheckBox");
        let cbElement = this.GetClickElement();
        cbElement.click();
        browser.sleep(500);
        if (state != null){this.CheckState(state);}
    }

    public CheckEnabled(enabledState: EnabledState) {
        let cbElement = this.GetClickElement();
        switch (enabledState) {
            case EnabledState.Enabled:
                expect(Common.HasClass(cbElement, this.disbledClass)).toBe(false, "Checkbox enabled state wrong");
                break;
            case EnabledState.Disabled:
                expect(Common.HasClass(cbElement, this.disbledClass)).toBe(true, "Checkbox disabled state wrong");
                break;
        }
    }

    public CheckState(state: CheckBoxState) {
        let cbElement = this.GetClickElement();
        switch (state) {
            case CheckBoxState.Checked:
                expect(Common.HasClass(cbElement, this.checkedClass)).toBe(true, "Checkbox checked state wrong");
                break;
            case CheckBoxState.Unchecked:
                expect(Common.HasClass(cbElement, this.checkedClass)).toBe(false, "Checkbox uncheked state wrong");
                break;
        }
    }

    private disbledClass = "form-checkbox-editor--t-form--disabled";
    //private clickElementClass = "ui-checkbox";
    private clickElementClass = "form-checkbox-editor--t-form__checkbox";
    private checkedClass = "ui-checkbox--checked";

    private GetClickElement(): protractor.ElementFinder {
        return element(by.xpath(Common.DateQaPath(this.qaValue) + "//*[contains(@class,'" + this.clickElementClass + "')]"));
    }
}