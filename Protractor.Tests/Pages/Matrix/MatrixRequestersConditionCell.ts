import { Common } from "../../Common/Common";
import { MatrixBaseConditionCell } from "./MatrixBaseConditionCell";
import { Page } from "../Page";
import { CheckBoxState, EnabledState } from "../../Common/Enums";


export class MatrixRequestersConditionCell extends MatrixBaseConditionCell {

    constructor(rootPath: string, name: string) {
        super(rootPath, name, "wfc-supplier-creation-condition-cell", "wfc-supplier-creation-condition-cell__condition-type-menu", "wfc-supplier-creation-condition-cell__condition-type-dropdown-item");
    }

    private checkedClass = 'ui-checkbox--checked';
    private checkBox = "//*[contains(@class,'wfc-supplier-creation-condition-cell__checkbox-box')]";

    // не совпадает с методом ЧекБокс из Controls
    public CheckCreateCheckBox(checkState:CheckBoxState = CheckBoxState.Checked) {
        Common.Log('Matrix Requesters: CheckBox Check');
        let cbElement = element(by.xpath(this.checkBox));
        switch (checkState) {
            case CheckBoxState.Checked:
                expect(Common.HasClass(cbElement, this.checkedClass)).toBe(true, "Checkbox checked state wrong");
                break;
            case CheckBoxState.Unchecked:
                expect(Common.HasClass(cbElement, this.checkedClass)).toBe(false, "Checkbox uncheked state wrong");
                break;
        }
    }

    public CheckBoxClick(checkState:CheckBoxState = CheckBoxState.Checked) {
        Common.Log('Matrix Requesters: CheckBox Click');
        let cbElement = element(by.xpath(this.checkBox));
        cbElement.click();
        this.CheckCreateCheckBox(checkState);
    }
}
