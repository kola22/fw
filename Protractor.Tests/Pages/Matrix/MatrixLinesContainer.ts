import { Page } from "../Page";
import { Common } from "../../Common/Common";
import { MultiselectDropDown } from "../Controls/MultiselectDropDown";
import { MatrixLine } from "./MatrixLine";
import { MatrixLineAlternativeRule } from "./MatrixLineAlternativeRule";

export class MatrixLinesContainer {

    constructor(private qaName: string, private qaId: string) {
    }

    public GetAlternativeRuleLine(lineIndex: string): MatrixLineAlternativeRule {
        return MatrixLineAlternativeRule.ById(lineIndex, this.GetRootPath());
    }

    public GetFirstLine(): MatrixLine {
        return MatrixLine.ById("0", this.GetRootPath());
    }

    //static methods
    public static ById(qaId: string): MatrixLinesContainer {
        return new MatrixLinesContainer("", qaId);
    }

    public static ByName(qaName: string): MatrixLinesContainer {
        return new MatrixLinesContainer(qaName, "");
    }

    public static GetFirstLineByName(qaName: string): MatrixLine {
        let container = new MatrixLinesContainer(qaName, "");
        return container.GetFirstLine();
    }

    public static GetFirstLineById(qaId: string): MatrixLine {
        let container = new MatrixLinesContainer("", qaId);
        return container.GetFirstLine();
    }

    //protected and private
    protected GetRootPath(): string {
        if (this.qaName.length > 0) {
            return Common.DateQaPathAndName(this.rootElementQA, this.qaName);
        }

        if (this.qaId.length > 0) {
            return Common.DateQaPathAndId(this.rootElementQA, this.qaId);
        }

        return "";
    }

    private rootElementQA = "wfc-matrix-line";
}
