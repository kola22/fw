import { Page } from "../Page";
import { Common } from "../../Common/Common";
import { DropDown } from "../Controls/DropDown";
import { MultiselectDropDown } from "../Controls/MultiselectDropDown";
import { Validation, DisplayState } from "../../Common/Enums";
import { MatrixConditionCell } from "./MatrixConditionCell";
import { MatrixAmountConditionCell } from "./MatrixAmountConditionCell";
import { MatrixAsyncConditionCell } from "./MatrixAsyncConditionCell";
import { MatrixLineBase } from "./MatrixLineBase";

export class MatrixLineAlternativeRule extends MatrixLineBase {

    //parentPath - parent matrix lines container path 
    constructor(qaId: string, parentPath: string) {
        super(qaId, parentPath);
    }

    public static ById(qaId: string, parentPath: string) {
        return new MatrixLineAlternativeRule(qaId, parentPath);
    }

    public Remove() {
        Common.Log('MatrixLineAlternativeRule at "' + this.qaId + '": remove');
        let removeBtn = this.GetChildByQA(this.deleteLineBtnQA);
        browser.actions().mouseMove(removeBtn, { x: 0, y: 0 }).perform();
        browser.sleep(500);
        removeBtn.click();
    }

    private deleteLineBtnQA = "wfc-or-user-cell__delete-button";
}
