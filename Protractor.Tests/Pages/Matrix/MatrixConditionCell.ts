import { Common } from "../../Common/Common";
import { MatrixBaseConditionCell } from "./MatrixBaseConditionCell";
import { Page } from "../Page";


export class MatrixConditionCell extends MatrixBaseConditionCell {

    constructor(rootPath: string, name: string) {
        super(rootPath, name, "wfc-exact-condition-cell", "wfc-exact-condition-cell__condition-type-menu", "wfc-exact-condition-cell__condition-type-dropdown-item");
    }
}
