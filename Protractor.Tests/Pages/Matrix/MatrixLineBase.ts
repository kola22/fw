import { Page } from "../Page";
import { Common } from "../../Common/Common";
import { DropDown } from "../Controls/DropDown";
import { MultiselectDropDown } from "../Controls/MultiselectDropDown";
import { Validation, DisplayState } from "../../Common/Enums";
import { MatrixConditionCell } from "./MatrixConditionCell";
import { MatrixAmountConditionCell } from "./MatrixAmountConditionCell";
import { MatrixAsyncConditionCell } from "./MatrixAsyncConditionCell";
import { MatrixRequestersConditionCell } from "./MatrixRequestersConditionCell";


export class MatrixLineBase {

    //parentPath - parent matrix lines container path 
    constructor(protected qaId: string, protected parentPath) {
        Common.Log('Matrixline rootpath:"' + this.GetRootPath() + '"');
        Page.Wait.ElementDisplayed(this.GetRootElement(), 'Matrixl line element at "' + qaId + '" ' + parentPath);
    }

    public GetConditionCell(name: string): MatrixConditionCell {
        Common.Log('GetConditionCell "' + name + '"');
        return new MatrixConditionCell(this.GetRootPath(), name);
    }

    public GetAsyncConditionCell(name: string): MatrixAsyncConditionCell {
        Common.Log('GetAsyncConditionCell "' + name + '"');
        return new MatrixAsyncConditionCell(this.GetRootPath(), name);
    }

    public GetAmountConditionCell(): MatrixAmountConditionCell {
        Common.Log('GetAmountConditionCell "');
        return new MatrixAmountConditionCell(this.GetRootPath());
    }

    public GetMultiselectDropDownAtCell(columnIndex: number): MultiselectDropDown {
        return new MultiselectDropDown(this.GetCellRootPath(columnIndex));
    }

    public GetSupplierCreationConditionCell(name: string): MatrixRequestersConditionCell {
        Common.Log('GetConditionCell "' + name + '"');
        return new MatrixRequestersConditionCell(this.GetRootPath(), name);
    }

    private rootElementQA = "wfc-matrix-line__line";

    protected GetRootPath(): string {
        return this.parentPath + Common.DateQaPathAndId(this.rootElementQA, this.qaId);
    }

    protected GetRootElement(): protractor.ElementFinder {
        return element(by.xpath(this.GetRootPath()));
    }

    protected GetChildByQA(qaValue: string): protractor.ElementFinder {
        return element(by.xpath(this.GetRootPath() + Common.DateQaPath(qaValue)));
    }

    protected GetCellRootPath(columnIndex: number) {
        let position = (columnIndex + 1).toString();
        return "(" + this.GetRootPath() + "[@class='wfc-exact-condition-cell'])[position()=" + position + "]";
    }
}
