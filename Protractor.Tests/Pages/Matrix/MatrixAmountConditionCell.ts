import { Common } from "../../Common/Common";
import { CellViewState, ConditionsType, Validation } from "../../Common/Enums";
import { Input } from "../Controls/Input";
import { DropDown } from "../Controls/DropDown";
import { BaseRootControl } from "../Controls/BaseRootControl";
import { Page } from "../Page";


export class MatrixAmountConditionCell extends BaseRootControl {

    constructor(rootPath: string) {
        super(rootPath);
        this.rootPath = this.rootPath + Common.DateQaPath(this.cellQA);
        Page.Wait.Element(this.GetRootElement(), 'Column header not present');
    }


    public SelectConditionType(conditionsType: ConditionsType, cellViewSate: CellViewState = CellViewState.Preview) {
        Common.Log('Select condition "' + ConditionsType[conditionsType] + '" for amount cell ');

        if (cellViewSate == CellViewState.Preview) {
            let conditionPreview = this.GetChildByQA(this.conditionDropDownPreviewwQA);
            conditionPreview.click();
            browser.sleep(1000);
        }

        let conditionDropDown = this.GetConditionDropDown();
        conditionDropDown.SelectValue(this.GetConditionTypeValue(conditionsType));
        browser.sleep(1000);
    }

    private GetConditionTypeValue(conditionsType: ConditionsType) {
        switch (conditionsType) {
            case ConditionsType.OverOrEqualTo: return "Over or equal to";
            case ConditionsType.Under: return "Under";
            case ConditionsType.Within: return "Within";
            case ConditionsType.Any: return "Any amount";
            default: return "";
        }
    }

    public GetConditionDropDown(): DropDown {
        let itemPath = Common.DateQaPath(this.dropDownItemQA);
        let mainElementPath = this.GetChildPathByQA(this.conditionDropDownQA);

        return new DropDown(mainElementPath, itemPath);
    }

    public SetValue1(value1: string, conditionsType: ConditionsType, validation: Validation = Validation.Valid, afterKey: any = protractor.Key.ENTER) {
        Common.Log('Amount set value1="' + value1 + '"');
        this.SetValue(this.value1Input, value1, conditionsType, validation, afterKey);
    }

    public SetValue2(value2: string, conditionsType: ConditionsType, validation: Validation = Validation.Valid, afterKey: any = protractor.Key.ENTER) {
        Common.Log('Amount set value2="' + value2 + '"');
        this.SetValue(this.value2Input, value2, conditionsType, validation, afterKey,true);
    }

    public CheckPreview(strongValue: string) {
        Common.Log('Check value in cell == '+ strongValue +' ');
        let preview = this.GetPreviewTextItem();
        expect(preview.getText()).toEqual(strongValue, 'Amount preview not equal "' + strongValue + '"');
    }

    public CheckPreviewContain(checkValue: string) {
        if (checkValue == '')return;
        let preview = this.GetPreviewTextItem();
        expect(preview.getText()).toContain(checkValue, 'Amount preview not contain "' + checkValue + '"');
    }

    private cellQA = "wfc-amt-condition-cell";
    private conditionDropDownPreviewwQA = "wfc-amt-condition-cell__preview";
    private conditionDropDownQA = "wfc-amt-condition-cell__range-menu";
    private dropDownItemQA = "wfc-amt-condition-cell__condition-type-dropdown-item";

    private value1Input: Input = Input.ByDataQa("wfc-amt-condition-cell__value1");
    private value2Input: Input = Input.ByDataQa("wfc-amt-condition-cell__value2");

    private validationIconQA = "wfc-error-icon";

    private SetValue(input: Input, value: string, conditionsType: ConditionsType, validation: Validation = Validation.Valid, afterKey: any = protractor.Key.ENTER,inputFocusClick=false) {

        // let inputFocusClick = false;
        input.SetValue(value, afterKey, inputFocusClick);
        browser.sleep(500);
        let condition = this.GetConditionTypeValue(conditionsType);

        if (validation == null) return;

        this.CheckPreviewContain(condition);
        // this.CheckPreviewContain(value);
        this.CheckPreviewValidation(validation);
    }

    private GetPreviewTextItem(): protractor.ElementFinder {
        let preview = element(by.xpath(this.GetChildPathByQA(this.conditionDropDownPreviewwQA) + "//*[contains(@class,'wfc-amt-condition-cell__preview-text')]"));
        Page.Wait.ElementDisplayed(preview, "Amount cell preview");
        return preview;
    }

    private CheckPreviewValidation(validation: Validation) {
        let validationIcon = this.GetChildByQA(this.validationIconQA);
        switch (validation) {
            case Validation.Valid:
                expect(validationIcon.isPresent()).toBe(false, "Amount validation is present");
                break;
            case Validation.NotValid:
                Page.Wait.Element(validationIcon, "Amount validation")
                expect(validationIcon.isDisplayed()).toBe(true, "Amount validation is not displayed");
                break;
            case Validation.Any:
                break;
        }
    }
}

