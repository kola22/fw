import { Page } from "../Page";
import { Common } from "../../Common/Common";
import { AddAction } from "../../Common/Enums";
import { BaseRootControl } from "./BaseRootControl";

export class MultiselectDropDown extends BaseRootControl {

    //rootPath - container XPATH
    constructor(rootPath: string) {
        super(rootPath);
    }

    // selectedItems - items selected after remove 
    // dropdownItem - items in drow down list after remove
    public RemoveItem(itemName: string, selectedItems: string[] = null, dropdownItems: string[] = null) {                
        Common.Log('MultiselectDropDown: remove item "' + itemName+'"');
        let item = this.GetSelectedItem(itemName);
        Page.Wait.Element(item, 'Multiselect dropdown item "' + itemName + '"');
        Common.ScrollIntoView(item);

        Common.Log('MultiselectDropDown: mouse move to item');
        browser.actions().mouseMove(item, { x: 0, y: 0 }).perform();
        browser.actions().mouseMove(item, { x: 5, y: 5 }).perform();

        let removeBtn = this.GetSelectedItemRemoveBtn(itemName);
        Common.Log('MultiselectDropDown: move and sleep');        
        browser.actions().mouseMove(removeBtn, { x: 2, y: 2 }).perform();
        browser.sleep(1000);

        //TO DO
        // click on remove button for some reasone not accepted need to research                
        Page.Wait.ElementDisplayed(removeBtn, 'Multiselect dropdown rewmove button for "' + itemName + '"');
        browser.actions().click(removeBtn).perform();
        //removeBtn.click();

        browser.sleep(2000);
        this.CheckSelected(selectedItems);
        this.CheckDropDownItems(dropdownItems);
    }

    public SelectItem(itemName: string, selectedItems: string[] = null, dropdownItems: string[] = null) {
        Common.Log('Multiselect dropdown select item "' + itemName + '"');
        this.OpenDropDown();

        let item = Common.ElementByDateQaAndName(this.listItemQA, itemName);
        Page.Wait.Element(item, 'Multiselect dropdown item "' + itemName + '"');
        browser.sleep(500);
        Common.ScrollIntoView(item);
        item.click();

        browser.sleep(1000);
        this.CheckSelected(selectedItems);
        this.CheckDropDownItems(dropdownItems);
        Page.pressEsc();
        browser.sleep(500);
    }

    public AddNewItem(itemName: string, addAction: AddAction = AddAction.ByEnter,needOpen=true) {
        Common.Log('Multiselect dropdown add new item "' + itemName + '"');
        needOpen ? this.OpenDropDown() : browser.sleep(100);

        let inputElement = this.GetAllChildsByQA(this.inputQA);
        inputElement.clear();
        inputElement.sendKeys(itemName);

        switch (addAction) {
            case AddAction.ByButton:
                let addBtn = Common.ElementByDateQa(this.listAddNewItemQA);
                addBtn.click();
                break;
            case AddAction.ByEnter:
                Page.pressEnter();
                break;
        }

        let addedItem = this.GetSelectedItem(itemName);
        Page.Wait.Element(addedItem, 'Multiselect dropdown new item "' + itemName + '"')
    }

    public FilterDropDown(filterValue: string, dropdownItems: string[],sleep = false) {
        Common.Log('Multiselect dropdown filter == "' + filterValue + '"');
        this.OpenDropDown();

        let inputElement = this.GetAllChildsByQA(this.inputQA);
        inputElement.clear();
        inputElement.sendKeys(filterValue);
        browser.sleep(2000);
        sleep == true ? browser.sleep(20002): browser.sleep(22);
        this.CheckDropDownItems(dropdownItems);
    }

    private OpenDropDown() {
        Common.Log("Open dropdown");
        // let valueButton = this.GetChildByQA(this.valueButtonQA);
        let valueButton = this.GetChildByQA(this.inputQA);
        Page.Wait.Element(valueButton, 'Multiselect dropdown value buttoun');
        Common.ScrollIntoView(valueButton);
        valueButton.click();
    }

    //strong order comparison
    public CheckSelected(selectedItems: string[] = null) {
        if (selectedItems == null) return;

        let selectedItemsList = this.GetAllChildsByQA(this.selectedItemQA);

        for (var i = 0; i < selectedItems.length; i++) {
            expect(selectedItemsList.get(i).getAttribute("data-qa-name")).toBe(selectedItems[i], 'The item "' + selectedItems[i] + '" is not found at selected items');
        }
    }

    //strong order comparison
    public CheckDropDownItems(dropDownItems: string[] = null) {
        Common.Log('Check DropDown Items');
        if (dropDownItems == null) return;
        let dropdownItemsList;

        let stratIndex = 0;
        browser.sleep(1500);
        if (dropDownItems.indexOf('Empty')>=0) {
            dropdownItemsList = element(by.css(".form-dropdown-editor-panel__empty-list"));
            expect(dropdownItemsList.getText()).toContain('Empty', "");
            stratIndex =1;
        }else if (dropDownItems.indexOf('EmptyItem')>=0){
            dropDownItems[0] = 'Empty';
        }

        dropdownItemsList = element.all(by.xpath(Common.DateQaPath(this.listItemQA)));
        let x=0;
        for (var i = stratIndex; i < dropDownItems.length; i++) {
            expect(dropdownItemsList.get(x).getAttribute("data-qa-name")).toBe(dropDownItems[i], 'The item "' + dropDownItems[i] + '" is not found at dropdown items');
            x=x+1;
        }
    }

    private valueButtonQA = "form-dropdown-editor-multi-value-button";
    private selectedItemQA = "form-dropdown-editor-multi-value-item";
    private selectedItemRemoveBtnQA = "form-dropdown-editor-multi-value-item__remove-button";   
    private inputQA = "form-dropdown-editor-multi-value-button__input";
    private listItemQA = "form-dropdown-editor-list-item";
    private listAddNewItemQA = "form-dropdown-editor-panel__add-new-button";

    private GetSelectedItem(itemName: string): protractor.ElementFinder {
        return element(by.xpath(this.rootPath + Common.DateQaPathAndName(this.selectedItemQA, itemName)));
    }

    private GetSelectedItemRemoveBtn(itemName: string): protractor.ElementFinder {
        return element(by.xpath(this.rootPath + Common.DateQaPathAndName(this.selectedItemQA, itemName) + Common.DateQaPath(this.selectedItemRemoveBtnQA)));
    }
}