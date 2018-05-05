import { Common } from "../../Common/Common";
import { Validation, AddAction } from "../../Common/Enums";
import { Input } from "../Controls/Input";
import { Page } from "../Page";
import { MatrixHeader } from "./MatrixHeader";
import { MatrixPopup } from "./MatrixPopup";
import { InputDropDown } from "../Controls/InputDropDown";

export class StandAloneMatrix extends MatrixPopup {

    constructor() {
        super();
    }

    public AddNewField(fieldName: string, addAction: AddAction = AddAction.ByEnter): MatrixHeader {
        Common.Log("Matrix: add new field \"" + fieldName + "\"");
        this.AddFieldClick();

        let newFieldDropDown = new InputDropDown(Common.DateQaPath(this.addNewHeaderColQA));

        newFieldDropDown.AddNewItem(fieldName, addAction);

        return new MatrixHeader(fieldName);
    }

    public AddExistingField(fieldName: string): MatrixHeader {
        Common.Log("Matrix: add existing field \"" + fieldName + "\"");
        this.AddFieldClick();

        let newFieldDropDown = new InputDropDown(Common.DateQaPath(this.addNewHeaderColQA));

        newFieldDropDown.SelectItem(fieldName);

        return new MatrixHeader(fieldName);
    }

    public RemoveField(name: string) {
        let fieldHeader = new MatrixHeader(name);
        fieldHeader.Remove();
    }

    private AddFieldClick() {
        Page.Wait.Element(this.addFieldButton, "Matrix add field button");
        Common.ScrollIntoView(this.addFieldButton);
        this.addFieldButton.click();
    }

    private addFieldButton = Common.ElementByDateQa("wfc-add-new-header-col");
    private addNewHeaderColQA = "wfc-add-new-header-col";
   
}

