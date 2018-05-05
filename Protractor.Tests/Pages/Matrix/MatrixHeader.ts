import { Common } from "../../Common/Common";
import { Validation } from "../../Common/Enums";
import { Input } from "../Controls/Input";
import { Page } from "../Page";


export class MatrixHeader {

    constructor(private name: string) {
        Page.Wait.Element(this.GetRootElement(), 'Column header "' + this.name + '" not present');
    }

    public Remove() {
        Common.Log('Column header "' + this.name + '" click remove');
        this.ClickMenu();

        let removeMenuItem = Common.ElementByDateQa(this.removeMenuItemQA);
        removeMenuItem.click()
        Page.Wait.ElementNotPresent(this.GetRootElement(), 'Column header "' + this.name + '" is present');
    }

    public RenameByDropDown(newName: string, valid: Validation = Validation.Valid) {
        this.ClickMenu();

        let renameMenuItem = Common.ElementByDateQa(this.renameMenuItemQA);
        renameMenuItem.click()

        this.Rename(newName, valid);
    }

    public RenameByDirectClick(newName: string, valid: Validation = Validation.Valid) {
        Common.ScrollIntoView(this.GetRootElement());

        let titleElement = this.GetChildByQA(this.titeleQA);
        titleElement.click();

        this.Rename(newName, valid);
    }

    private rootQA = "wfc-condition-header-col";
    private titeleQA = "wfc-condition-header-col__title";
    private titleInputQA = "title-input";
    private actionMenuQA = "wfc-condition-header-col__action-menu";
    private renameMenuItemQA = "wfc-condition-header-col__rename";
    private removeMenuItemQA = "wfc-condition-header-col__remove";

    private ClickMenu() {
        Common.Log('Column header "' + this.name + '" click menu');
        Common.ScrollIntoView(this.GetRootElement());

        let menu = this.GetChildByQA(this.actionMenuQA);
        browser.actions().mouseMove(menu, { x: 0, y: 0 }).perform();
        browser.sleep(500);
        menu.click();
    }

    private Rename(newName: string, valid: Validation = Validation.Valid) {
        Common.Log('Column header "' + this.name + '" rename to ');

        let root = this.GetRootElement();
        root.click();

        let input = new Input(this.GetChildByQA(this.titleInputQA));
        input.SetValue(newName);               

        switch (valid) {
            case Validation.Valid:
                this.name = newName;
                Page.Wait.Element(this.GetRootElement(), 'Column header "' + this.name + '" not renamed');
                break;
            case Validation.NotValid:
                let alertContainer = element(by.css("#alertContainer .alert"));
                Page.Wait.ElementDisplayed(alertContainer, "Alert container after field rename");
                browser.sleep(5000);
                break;
        }
    }

    private GetChildByQA(qa: string): protractor.ElementFinder {
        return element(by.xpath(this.GetRootPath() + Common.DateQaPath(qa)));
    }

    private GetRootElement(): protractor.ElementFinder {
        return element(by.xpath(this.GetRootPath()));
    }

    private GetRootPath(): string {
        return Common.DateQaPathAndName(this.rootQA, this.name);
        //return "//*[@data-qa='" + this.titeleQA + "'][contains(text(),'" + this.name + "')]/ancestor::*[@data-qa='" + this.rootQA + "']";
    }
}
