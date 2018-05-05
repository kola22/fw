import { Page } from "../Page";
import { Common } from "../../Common/Common";

export class DropDown {

    constructor(private pickerPath: string, private itemPath: string, private parentPath: string = "") {
    }

    public SelectValue(value: string) {
        this.ClickPicker();
        Common.Log('DropDown: click item "' + value + '"');
        let itemPath = this.parentPath + this.itemPath + "[contains(text(),'" + value + "')]";
        let item = element(by.xpath(itemPath));
        Page.Wait.ElementDisplayed(item, 'Drop down item "' + value + '"');
        item.click();
        browser.sleep(1000);
    }

    public ClickPicker() {
        Common.Log('DropDown: click picker');
        let mainElement = element(by.xpath(this.parentPath + this.pickerPath));
        Page.Wait.ElementDisplayed(mainElement, "Dropdown element");
        mainElement.click();
    }
}