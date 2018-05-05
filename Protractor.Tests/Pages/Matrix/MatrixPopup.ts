import { Common } from "../../Common/Common";
import { AddAction } from "../../Common/Enums";
import { Input } from "../Controls/Input";
import { InputDropDown } from "../Controls/InputDropDown";
import { MatrixLine } from "./MatrixLine";
import { MatrixLinesContainer } from "./MatrixLinesContainer";
import { MatrixHeader } from "./MatrixHeader";
import { Page, User } from "../Page";

export class MatrixPopup {

    constructor() {
        Page.Wait.ElementDisplayed(this.popupElement, "Matrix popup");
    }

    public Close() {
        Common.Log("Matrix: Close");
        Page.Wait.ElementDisplayed(this.closeButton, "Matrix popup closeButton button click");
        this.closeButton.click();
        browser.sleep(1000);
    }

    public Done() {
        Common.Log("Matrix: Done");
        Page.Wait.ElementDisplayed(this.closeButton, "Matrix popup doneButton button click");
        this.doneButton.click();
        browser.sleep(1000);
    }

    public RemoveUserById(qaId: string) {
        let matrixLine = MatrixLinesContainer.GetFirstLineById(qaId);
        matrixLine.RemoveUser();
    }

    public RemoveUserByName(qaName: string) {
        let matrixLine = MatrixLinesContainer.GetFirstLineByName(qaName);
        matrixLine.RemoveUser();
    }

    public AddNewUser(userName: string) {
        Common.Log("Matrix: add new user \"" + userName + "\"");
        this.AddUserClick();
        let addUserDropDown = new InputDropDown(Common.DateQaPath(this.addUserPickerQA));
        addUserDropDown.SetValue(userName);
    }

    public AddExistingUser(userName: string) {
        Common.Log("Matrix: add existing user \"" + userName + "\"");
        this.AddUserClick();
        let addUserDropDown = new InputDropDown(Common.DateQaPath(this.addUserPickerQA));
        addUserDropDown.SelectItem(userName);
    }

    public AddUserClick() {
        Page.Wait.Element(this.addUserButton, "Matrix popup addUserButton button click");
        Common.ScrollIntoView(this.addUserButton);
        this.addUserButton.click();
    }

    public SyncClick() {
        Common.Log("Matrix: Sync");
        this.refreshButton.click();
    }

    private addUserPickerQA = "wfc-user-picker";
    
    private popupElement = element(by.css(".wfc-matrix-p"));
    private doneButton = Common.ElementByDateQa("wfc-matrix-p__popup-done-button");
    private refreshButton = Common.ElementByDateQa("wfc-matrix-p__popup-open-cache-panel-button");
    private closeButton = Common.ElementByDateQa("ui-default-popup-content__close-button");
    private addUserButton = Common.ElementByDateQa("wfc-matrix-p__add-user-button");    

}