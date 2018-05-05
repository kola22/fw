import { Page } from "../Page";
import { Common } from "../../Common/Common";
import { Validation, DisplayState, AddAction } from "../../Common/Enums";
import { BaseRootControl } from "./BaseRootControl";

export class InputDropDown extends BaseRootControl {

    constructor(rootPath: string) {
        super(rootPath);
    }

    public SetValue(value: string) {
        Common.Log("InputDropDown set value=\"" + value + "\"");
        let inputElement = this.GetChildByQA(this.inputQA);
        browser.sleep(1100);
        Page.Wait.ElementDisplayed(inputElement, "InputDropDown  input element");
        inputElement.clear();
        browser.sleep(1110);
        inputElement.sendKeys(value);
        Page.pressEnter();
        browser.sleep(1000);
    }

    public AddNewItem(itemName: string, addAction: AddAction = AddAction.ByEnter) {
        Common.Log('InputDropDown dropdown add new item "' + itemName + '"');

        let inputElement = this.GetAllChildsByQA(this.inputQA);
        inputElement.clear();
        inputElement.sendKeys(itemName);

        switch (addAction) {
            case AddAction.ByButton:
                let addBtn = Common.ElementByDateQa(this.addBtnQA);
                addBtn.click();
                break;
            case AddAction.ByEnter:
                Page.pressEnter();
                break;
        }

        browser.sleep(1000);
    }


    public SelectItem(value: string) {
        Common.Log("InputDropDown select item=\"" + value + "\"");

        let dropdownItem = value.indexOf("@") > 0 ? Common.ElementByDateQaAndId(this.itemQA, value) : Common.ElementByDateQaAndName(this.itemQA, value);
        Page.Wait.ElementDisplayed(dropdownItem, "Drop down item =\"" + value + "\"")
        dropdownItem.click();
        browser.sleep(1000);
    }


    public CheckInputValue(value: string,index:number=0) {
        Common.LogWithValue("Check Input Value == ",value);
        let inputElement = this.GetChildByQA(this.inputQA);
        // let inpunElement = Common.ElementByDateQa(this.inputQA,index);
        expect(inputElement.getAttribute('value')).toBe(value, "CheckInputValue");
    }

    private itemQA = "form-dropdown-editor-list-item";
    private inputQA = "form-dropdown-editor-button__input";
    private addBtnQA = "form-dropdown-editor-panel__add-new-button";
}
