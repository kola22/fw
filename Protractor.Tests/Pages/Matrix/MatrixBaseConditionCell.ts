import { Common } from "../../Common/Common";
import { ConditionsType } from "../../Common/Enums";
import { DropDown } from "../Controls/DropDown";
import { MultiselectDropDown } from "../Controls/MultiselectDropDown";
import { BaseRootControl } from "../Controls/BaseRootControl";
import { Page } from "../Page";


export class MatrixBaseConditionCell extends BaseRootControl {

    constructor(rootPath: string, protected name: string, private cellQA: string, private dropdownQA: string, private dropdownItemQA: string) {
        super(rootPath);
        this.rootPath = this.rootPath + Common.DateQaPathAndName(this.cellQA, this.name);

        Page.Wait.Element(this.GetRootElement(), 'Condition cell "' + this.name + '" not present');
    }

    public SelectConditionType(conditionsType: ConditionsType,requestersMatrix:boolean=false) {
        Common.Log('Select condition "' + ConditionsType[conditionsType] + '" for cell "' + this.name + '"');
        let conditionDropDown = this.GetConditionDropDown();
        let itemValue = "";
        if (requestersMatrix == false){
            switch (conditionsType) {
                case ConditionsType.Any:
                    itemValue = "Any " + this.name;
                    break;
                case ConditionsType.Matches:
                    itemValue = this.name + " matches";
                    break;
                case ConditionsType.DoesNotMatches:
                    itemValue = this.name + " does not match";
                    break;
            }
        }else {
            switch (conditionsType) {
                case ConditionsType.Any:
                    itemValue = "Any existing Contact";
                    break;
                case ConditionsType.Matches:
                    itemValue = "Contact that matches";
                    break;
                case ConditionsType.DoesNotMatches:
                    itemValue = "Any Contact except for";
                    break;
                case ConditionsType.AnyAsSupplier:
                    itemValue = "Any Contact marked as Supplier";
                    break;
                // дописать 4 значения для requesters Matrix
            }
        }
        conditionDropDown.SelectValue(itemValue);
        browser.sleep(2000);

    }

    public GetConditionDropDown(): DropDown {
        let mainElementPath = this.rootPath + Common.DateQaPath(this.dropdownQA);
        let itemPath = Common.DateQaPathContains(this.dropdownItemQA);

        return new DropDown(mainElementPath, itemPath);
    }

    public GetMultiSelectDropDown(): MultiselectDropDown {
        return new MultiselectDropDown(this.rootPath);
    }

    public AddNewConditonValue(value: string, selectedValues: string[] = null) {
        let multiSelect = this.GetMultiSelectDropDown();
        multiSelect.AddNewItem(value);
        multiSelect.CheckSelected(selectedValues);
    }

    public SelectConditionValue(value: string, selectedValues: string[] = null) {
        let multiSelect = this.GetMultiSelectDropDown();
        multiSelect.SelectItem(value, selectedValues);
    }

    public DeleteConditionValue(value: string, selectedValues: string[] = null) {
        let multiSelect = this.GetMultiSelectDropDown();
        multiSelect.RemoveItem(value, selectedValues);
    }

    public CheckSelected(selectedValues: string[]) {
        Common.Log('Check \x1b[37;43m Selected  \x1b[0m Matrix Value');
        let multiSelect = this.GetMultiSelectDropDown();        
        multiSelect.CheckSelected(selectedValues);
    }

    public CheckTextTitle(selectedValues) {
        let elementXpath = this.rootPath + Common.DateQaPath(this.dropdownQA);
        let preview = element(by.xpath(elementXpath));
        expect(preview.getText()).toEqual(selectedValues, 'Amount preview not equal "' + selectedValues + '"');
    }
}
