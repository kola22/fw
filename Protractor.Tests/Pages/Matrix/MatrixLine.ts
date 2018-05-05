import { Page } from "../Page";
import { Common } from "../../Common/Common";
import { DropDown } from "../Controls/DropDown";
import { MultiselectDropDown } from "../Controls/MultiselectDropDown";
import { Validation, DisplayState } from "../../Common/Enums";
import { MatrixConditionCell } from "./MatrixConditionCell";
import { MatrixAmountConditionCell } from "./MatrixAmountConditionCell";
import { MatrixAsyncConditionCell } from "./MatrixAsyncConditionCell";
import { MatrixLineBase } from "./MatrixLineBase";
import { MatrixLineAlternativeRule } from "./MatrixLineAlternativeRule";

export class MatrixLine extends MatrixLineBase {

    constructor(qaId: string, parentPath: string) {
        super(qaId, parentPath);
    }

    public static ById(qaId: string, parentPath: string) {
        return new MatrixLine(qaId, parentPath);
    }

    public RemoveUser() {
        Common.Log('Matrixline at "' + this.qaId + '": remove user');
        this.ClickUserMenu();

        let removeUserMenuItem = Common.ElementByDateQa(this.removerUserBtnQA);
        Page.Wait.ElementDisplayed(removeUserMenuItem, "matrixline remove item user menu");
        removeUserMenuItem.click();
    }

    public AddAlternativeRule() {
        Common.Log('Matrixline at "' + this.qaId + '": add alternative rule');
        this.ClickUserMenu();

        let addRuleMenuItem = Common.ElementByDateQa(this.addAlternativeRuleBtnQA);
        Page.Wait.ElementDisplayed(addRuleMenuItem, "matrixline add rule item user menu");
        addRuleMenuItem.click();
    }

    public ClickUserMenu() {
        Common.Log('Matrixline at "' + this.qaId + '": click user menu');
        let userMenu = this.GetChildByQA(this.userMenuBtnQA);
        browser.actions().mouseMove(userMenu, { x: 0, y: 0 }).perform();
        browser.sleep(500);
        userMenu.click();
    }

    private userMenuBtnQA = "wfc-first-user-cell__actions-menu";
    private removerUserBtnQA = "wfc-first-user-cell__remove-user";
    private addAlternativeRuleBtnQA = "wfc-first-user-cell__add-rule";
}
