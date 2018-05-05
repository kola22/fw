import { Common } from "../../Common/Common";
import { MatrixBaseConditionCell } from "./MatrixBaseConditionCell";
import { Page } from "../Page";


export class MatrixAsyncConditionCell extends MatrixBaseConditionCell {

    constructor(rootPath: string, name: string) {
        super(rootPath, name, "wfc-exact-async-condition-cell", "wfc-exact-async-condition-cell__condition-type-menu", "wfc-exact-async-condition-cell__condition-type-dropdown-item");
    }
}
