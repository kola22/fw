import { Common } from "../../Common/Common";
import { Page } from "../Page";
import {WorkFlowType, EnabledState, DisplayState} from "../../Common/Enums";
import { Input } from "../Controls/Input";
import { InputDropDown } from "../Controls/InputDropDown";
import { DurationEditor } from "../Popup/DurationEditor";



export class WorkflowStep {

    constructor(private stepName: string, approvers: string[] = new Array(), private index: number = 0) {
        Common.LogWithValue('constructor: Workflow Step. Step name = ',stepName);
        this.Init();
        browser.sleep(1000);
        this.CheckApprovers(approvers);
    }

    public RenameStep(newName: string) {
        Common.LogWithValue('Workflow step "' + this.stepName + '" :  rename to = ',newName);

        let stepNameElement = this.GetStepChildByQA(this.stepBubbleTextQA);
        stepNameElement.click();
        browser.sleep(500);

        let stepNameElementInput = this.GetStepChildByQA(this.stepBubbleInputQA);
        let stepName: Input = new Input(stepNameElementInput);
        browser.sleep(500);

        stepName.SetValue(newName,protractor.Key.TAB,true,false);
        browser.sleep(500);

        this.stepName = newName;
    }

    public DeleteStep() {
        let additionText = '';
        this.index == 0 ?  additionText = ' ' : additionText = ', index=' + this.index + ' ';
        Common.Log('Wf step:  Delete step ' + this.stepName + additionText);
        let stepBubble = this.GetStepChildByQA(this.stepBubbleTextQA);
        //TO check maybe change to mouse move
        // stepBubble.click();
        browser.sleep(500);
        let stepBubbleCloseBtn = this.GetStepChildByQA(this.stepBubbleCloseBtnQA);
        stepBubbleCloseBtn.click();
    }

    public MoveStep(moveToStepName) {
        Common.Log('Move step "'+this.stepName+'" to "'+moveToStepName+'" step');
        let moveElementXpath = Common.DateQaName(this.stepName) + Common.DateQaPath(this.dragHandle);
        let moveElement = element(by.xpath(moveElementXpath));

        let destinationXpath = Common.DateQaName(moveToStepName) + Common.DateQaPath(this.dragHandle);
        let destination = element(by.xpath(destinationXpath));
        browser.driver.actions().mouseDown(moveElement)
            .mouseMove(destination)
            .mouseUp(destination).perform();
        // browser.driver.actions().dragAndDrop(tvItem.itemElement, this.itemElement).perform();

        browser.sleep(1000);//wait for update layout
    }

    public CheckAllStep(steps : string[] ) {
        Common.Log('Check All Step');
        //TO DO add index to selector
        let stesListPath = Common.DateQaPath(this.stepRootQA);
        let stesList = element.all(by.xpath(stesListPath));

        // expect(stepApproversList.count()).toBe(approvers.length, "List count not equal"); //допилить потом 1.9.17
        //user strong order comparison
        for (var i = 0; i < steps.length; i++) {
            var stepInList = stesList.get(i);
            expect(stepInList.getAttribute("data-qa-name")).toBe(steps[i], 'The approver "' + steps[i] + '" is not found in the step  "' + this.stepName + '"');
        }

    }

    public SetDeadLine(daysUp: number, daysDown: number, hoursUp: number, hoursDown: number, dyasValue: number, hoursValue: number) {
        Common.Log('Wf step "' + this.stepName + '" : Set DeadLine');
        this.DeadLineClick();

        let durationEditor = new DurationEditor();
        durationEditor.DaysUpClick(daysUp);
        durationEditor.DaysDownClick(daysDown);
        durationEditor.HoursUpClick(hoursUp);
        durationEditor.HoursDownClick(hoursDown, dyasValue, hoursValue);
    }

    public DeleteDeadLine() {
        Common.Log('Wf step "' + this.stepName + '" : Delete DeadLine');
        let deadLineBtn = this.GetStepChildByQA(this.deadLineBtnQA);
        browser.actions().mouseMove(deadLineBtn, { x: 0, y: 0 }).perform();
        browser.sleep(1000);

        let deadLineClose = this.GetStepChildByQA(this.deleteDeadLineBtnQA);
        deadLineClose.click();

    }

    public DeadLineClick() {
        Common.Log('Wf step "' + this.stepName + '" : DeadLine button click');
        let deadLineBtn = this.GetStepChildByQA(this.deadLineBtnQA);
        deadLineBtn.click();

        //после клика по иконке появляется окно для ввода временеи
        let durationEditor = new DurationEditor();

    }

    public DeadLineIconCheck(state:EnabledState) {
        Common.Log('Wf step "' + this.stepName + '" : DeadLine check icon state');
        let icon = this.GetStepChildByQA(this.deadLineIcon);
        expect(Common.ContainClass(icon, "wfc-duration-editor--empty")).toBe(state == EnabledState.Disabled, "Wrong Deadline Icon state");
    }

    public CheckDeadlineValue(daysValue: number, hoursValue: number) {
        let deadLineValue = this.GetStepChildByQA(this.deadLineValue);

        let hoursText = hoursValue.toString() + " " + (hoursValue > 1 ? "hours" : "hour");
        if (hoursValue != 0 && daysValue == 0) {
            expect(deadLineValue.getText()).toBe(hoursText, "Deadline value: hours value wrong");
        } else {
            //TO DO
            //проверить, что значение часов не показывается
        }

        let daysText = daysValue.toString() + " " + (daysValue > 1 ? "days" : "day");
        if (daysValue != 0 && hoursValue == 0) {
            expect(deadLineValue.getText()).toBe(daysText, "Deadline value:  day wrong");
        } else {
            //TO DO
            //проверить, что не показываются дни
        }

        if (daysValue != 0 && hoursValue != 0) {
            expect(deadLineValue.getText()).toBe(daysText+" "+hoursText, "Deadline value: hours and day wrong");
        } else {
            //TO DO
            //проверить, что не показываются дни
        }

    }

    public ApproversTabClick(approvers: string[] = new Array()) {
        Common.Log("Workflow step:  approver tab click");
        let approversTab = this.GetStepChildByQA(this.approversTabQA);
        approversTab.click();
        browser.sleep(1000);
        this.CheckApprovers(approvers);
    }

    public ReviwersTabClick(reviwers: string[] = new Array()) {
        Common.Log("Workflow step: reviwer tab click");
        let reviwersTab = this.GetStepChildByQA(this.reviwersTabQA);
        reviwersTab.click();
        browser.sleep(1000);
        this.CheckReviwers(reviwers);
    }

    /*---------------------------------------Approvers----------------------------------------------*/
    public DeleteApprover(userNameOrId: string, approvers: string[] = new Array()) {
        Common.Log('Wf step "' + this.stepName + '" : Delete approver button "' + userNameOrId + '"');
        this.DeleteUser(this.approversListQA, userNameOrId);
        this.CheckApprovers(approvers);
    }

    public AddNewApprover(userName: string, users: string[] = new Array(),warning:DisplayState=DisplayState.Hide) {
        this.AddApproverClick();
        this.AddNewUser(userName);
        if(warning==DisplayState.Hide){
            this.CheckApprovers(users);
        }else{
            this.CheckWarningText();
        }
    }

    public AddExistingApprover(userName: string, users: string[] = new Array()) {
        Common.Log("Workflow step: Add Existing Approver");
        this.AddApproverClick();
        this.SelectUser(userName);
        this.CheckApprovers(users);
    }

      public AddApproverClick() {
        Common.Log("Workflow step: click visible add approver button");
        browser.sleep(1000);
        var addFirsButton = this.GetStepChildByQA(this.addFirstApproverBtnQA);
        var self = this;
        browser.wait(addFirsButton.isPresent().then(function (result) {
            result ? self.AddFirstApproverBtnClick() : self.AddApproverToolBarBtnClick();
        }));
    }

    public AddFirstApproverBtnClick() {
        Common.Log("Workflow step: add first approver button click ");
        let addFirsButton = this.GetStepChildByQA(this.addFirstApproverBtnQA);

        browser.sleep(500);
        addFirsButton.click();
    }

    public AddApproverToolBarBtnClick() {
        Common.Log("Workflow step: add approver toolbar button click ");
        let addButton = this.GetStepChildByQA(this.addApproverToolBarBtnQA);

        Page.Wait.ElementDisplayed(addButton, "add approver tool bar button");
        addButton.click();
    }

    public ApproverMatrixClick() {
        Common.Log("Workflow step: approver matrix click ");
        let matrixBtn = this.GetStepChildByQA(this.approverMatrixToolBarBtnQA);
        Page.Wait.ElementDisplayed(matrixBtn, "approver matrix button");
        matrixBtn.click();
        browser.sleep(1500);
    }

    /*---------------------------------------Default Approvers----------------------------------------------*/
    public DeleteDefaultApprover(userNameOrId: string, approvers: string[] = new Array()) {
        Common.Log('Wf step "' + this.stepName + '" : Delete approver button "' + userNameOrId + '"');
        this.DeleteUser(this.defaultApproversAllListQA, userNameOrId,this.defaultListItemDeleteBtnQA);
        this.CheckDefaultApprovers(approvers);
    }

    public AddNewDefaultApprover(userName: string, users: string[] = new Array()) {
        this.AddDefaultApproverClick();
        this.AddNewUser(userName);
        this.CheckDefaultApprovers(users);
    }

    public AddExistingDefaultApprover(userName: string, users: string[] = new Array()) {
        this.AddDefaultApproverClick();
        this.SelectUser(userName);
        this.CheckDefaultApprovers(users);
    }

    public AddDefaultApproverClick() {
        Common.Log("Workflow step: click visible add approver button");
        browser.sleep(1000);
        var addDefaultButton = this.GetStepChildByQA(this.addDefaultApproverBtnQA);
        browser.sleep(500);
        addDefaultButton.click();

    }

    public CheckDefaultAprroverForm(ispresent:DisplayState = DisplayState.Shown,users: string[] = new Array()) {
        Common.Log("Workflow step: Check Default Aprrover Form");
        browser.sleep(1000);
        let defaultApproverText = 'A Default Approver is added to a step in case there is no designated Approver specified for it.';
        if (ispresent == DisplayState.Shown){
            Page.Wait.TextCreation(defaultApproverText);
            this.CheckDefaultApprovers(users);}
        else {
            Page.Wait.TextNotPresent(defaultApproverText);
        }
    }

    // public AddFirstDefaultApproverBtnClick() {
    //     Common.Log("Workflow step: add first approver button click ");
    //     let addFirsButton = this.GetStepChildByQA(this.addFirstApproverBtnQA);
    //
    //     browser.sleep(500);
    //     addFirsButton.click();
    // }

    // public AddDefaultApproverToolBarBtnClick() {
    //     Common.Log("Workflow step: add approver toolbar button click ");
    //     let addButton = this.GetStepChildByQA(this.addApproverToolBarBtnQA);
    //
    //     Page.Wait.ElementDisplayed(addButton, "add approver tool bar button");
    //     addButton.click();
    // }

    /*---------------------------------------Reviwers----------------------------------------------*/
    public DeleteReviwer(userNameOrId: string, reviwers: string[] = new Array()) {
        Common.Log('Wf step "' + this.stepName + '" : Delete reviwer button "' + userNameOrId + '"');
        this.DeleteUser(this.reviwersListQA, userNameOrId);
        this.CheckReviwers(reviwers);
    }

    public AddNewReviwer(userName: string, users: string[] = new Array()) {
        this.AddReviwerClick();
        this.AddNewUser(userName);
        this.CheckApprovers(users);
    }

    public AddExistingReviwer(userName: string, users: string[] = new Array()) {
        this.AddReviwerClick();
        this.SelectUser(userName);
        this.CheckApprovers(users);
    }

    public AddReviwerClick() {
        Common.Log("Workflow step: click visible add reviwer button");
        browser.sleep(1000);
        var addFirsButton = this.GetStepChildByQA(this.addFirstReviwerBtnQA);
        var self = this;
        browser.wait(addFirsButton.isPresent().then(function (result) {
            result ? self.AddFirstReviwerBtnClick() : self.AddReviwerToolBarBtnClick();
        }));
    }

    public AddFirstReviwerBtnClick() {
        Common.Log("Workflow step: add first reviwer button click ");
        let addFirsButton = this.GetStepChildByQA(this.addFirstReviwerBtnQA);
        browser.sleep(500);
        addFirsButton.click();
    }

    public AddReviwerToolBarBtnClick() {
        Common.Log("Workflow step: add reviwer toolbar button click ");
        let addButton = this.GetStepChildByQA(this.addReviwerToolBarBtnQA);

        Page.Wait.ElementDisplayed(addButton, "add reviwer tool bar button");
        addButton.click();
    }

    public ReviwerMatrixClick() {
        Common.Log("Workflow step: reviwer matrix click ");
        let matrixBtn = this.GetStepChildByQA(this.reviwerMatrixToolBarBtnQA);
        Page.Wait.ElementDisplayed(matrixBtn, "reviwer matrix button");
        matrixBtn.click();
    }
    /*-----------------------------------ptivate---------------------------------*/
    private DeleteUser(listQA: string, userNameOrID: string,buttonPath = this.userListItemDeleteBtnQA) {
        Common.Log('Wf step "' + this.stepName + '" : Delete reviwer button "' + userNameOrID + '"');
        let closeUserBtnPath = '';
        if (buttonPath == this.userListItemDeleteBtnQA){
         closeUserBtnPath = this.GetUserItemPath(listQA, userNameOrID) + Common.DateQaPath(buttonPath);}
        else {
         closeUserBtnPath = this.GetUserItemPath(listQA, userNameOrID,true) + Common.DateQaPath(buttonPath);}

        let closeBtn = element(by.xpath(closeUserBtnPath));

        browser.actions().mouseMove(closeBtn, { x: 0, y: 0 }).perform();
        browser.sleep(500);

        closeBtn.click();
        browser.sleep(1000);
    }

    private GetUserItemPath(listQA: string, userNameOrID: string, defaultApprover : boolean = false): string {
        var result = Common.DateQaPathAndName(this.stepRootQA, this.stepName) + Common.DateQaPath(listQA);
        let userList = '';
        if (defaultApprover == true){
            userList = this.defaultApproversListQA;}
        else{
            userList = this.userListItemQA;}

        if (userNameOrID.indexOf("@") > 0) {
            result += Common.DateQaPathAndId(userList, userNameOrID);
        } else {
            result += Common.DateQaPathAndName(userList, userNameOrID);
        }
        return result;
    }

    private AddNewUser(userName: string) {
        Common.Log('Wf step "' + this.stepName + '" : AddNewUser "' + userName + '"');
        let addUserDropDown = this.GetAddUserDropDown();
        addUserDropDown.SetValue(userName);
    }

    private SelectUser(userName: string) {
        Common.Log('Wf step "' + this.stepName + '" : Select user"' + userName + '"');
        let addUserDropDown = this.GetAddUserDropDown();
        addUserDropDown.SelectItem(userName);
    }

    private GetAddUserDropDown(): InputDropDown {
        let inputDropDownPath = this.GetRootPath() + Common.DateQaPath(this.userPickerQA);
        return new InputDropDown(inputDropDownPath);
    }

    private GetRootPath(): string {
        let rootPath = Common.DateQaPathAndName(this.stepRootQA, this.stepName);
        if (this.index > 0) {
            let position = this.index + 1;
            rootPath = "(" + rootPath + ")[position()=" + position + "]";
        }
        return rootPath;
    }

    private GetStepChildByQA(dataQaValue: string): protractor.ElementFinder {
        return element.all(by.xpath(this.GetRootPath() + Common.DateQaPath(dataQaValue))).get(this.index)
    }

    private Init() {
        let stepBlockElement = element.all(by.xpath(this.GetRootPath())).get(this.index);
        Page.Wait.Element(stepBlockElement, 'Worflow step="' + this.stepName + '"');
    }

    public CheckApprovers(approvers: string[],noApprovers = false) {
        //TO DO add index to selector
        let stepPath = Common.DateQaPathAndName(this.stepRootQA, this.stepName);
        let stepApproversListPath = stepPath + Common.DateQaPath(this.approversListQA) + Common.DateQaPath(this.userListItemQA);
        let stepApproversList = element.all(by.xpath(stepApproversListPath));

         // expect(stepApproversList.count()).toBe(approvers.length, "List count not equal"); //допилить потом 1.9.17
        //user strong order comparison
        if (noApprovers){
            Page.Wait.ElementDisplayed(element(by.xpath(stepPath+Common.DateQaPath(this.addFirstApproverBtnQA))),'Add approver button')
            return;
        }
        for (var i = 0; i < approvers.length; i++) {

            var approverInList = stepApproversList.get(i);
            expect(approverInList.getAttribute("data-qa-name")).toBe(approvers[i], 'The approver "' + approvers[i] + '" is not found in the step  "' + this.stepName + '"');
        }
    }

    private CheckDefaultApprovers(approvers: string[]) {
        //TO DO add index to selector
        let stepApproversListPath = Common.DateQaPathAndName(this.stepRootQA, this.stepName) + Common.DateQaPath(this.defaultApproversListQA);
        let stepApproversList = element.all(by.xpath(stepApproversListPath))

        //user strong order comparison
        for (var i = 0; i < approvers.length; i++) {
            var approverInList = stepApproversList.get(i);
            expect(approverInList.getAttribute("data-qa-name")).toBe(approvers[i], 'The approver "' + approvers[i] + '" is not found in the step  "' + this.stepName + '"');
        }
    }

    private CheckReviwers(reviwers: string[]) {
        //TO DO add index to selector
        let stepReviwersListPath = Common.DateQaPathAndName(this.stepRootQA, this.stepName) + Common.DateQaPath(this.reviwersListQA) + Common.DateQaPath(this.userListItemQA);
        let stepReviwersList = element.all(by.xpath(stepReviwersListPath))

        //user strong order comparison
        for (var i = 0; i < reviwers.length; i++) {
            var approverInList = stepReviwersList.get(i);
            expect(approverInList.getText()).toBe(reviwers[i], 'The reviwer "' + reviwers[i] + '" is not found in the step  "' + this.stepName + '"');
        }
    }

    //strong order comparison
    public CheckDropDownItems(dropDownItems: string[]) {
        browser.sleep(1500);
        // let dropdownItemsList = element.all(by.xpath(Common.DateQaPath('form-dropdown-editor-panel') + Common.DateQaPath('form-dropdown-editor-list-item')));
        let dropdownItemsList = element.all(by.xpath(Common.DateQaPath('form-dropdown-editor-list-item')));
        for (var i = 0; i < dropDownItems.length; i++) {
            expect(dropdownItemsList.get(i).getAttribute("data-qa-name")).toBe(dropDownItems[i], 'The item "' + dropDownItems[i] + '" is not found at dropdown items');
        }
    }

    private CheckWarningText() {
        let dropdownItemsList = element(by.className("form-dropdown-editor-panel"));
            let textToVerifBefore11122017 = 'Enter a valid email to invite a new user';
            let textToVerifAfter11122017 = 'Enter a valid email address to invite a new user';
            expect(dropdownItemsList.getText()).toContain(textToVerifAfter11122017, "Warning text does not match");
    }

    private stepRootQA = "wfc-i-step";

    private deadLineBtnQA = "wfc-duration-editor-button";
    private deleteDeadLineBtnQA = "wfc-duration-editor-button__delete-button";
    private deadLineEditorQA = "wfc-duration-editor-button__text";
    private deadLineValue = "wfc-duration-editor-button__text";

    private userListItemQA = "wfc-user-list-item";
    private userListItemDeleteBtnQA = "wfc-user-list-item__delete-button";
    //private dropdowninputQA = "form-dropdown-editor-button__input";
    private userPickerQA = "wfc-user-picker";

    private approversTabQA = "wfc-i-step__tab-item-approvers";
    private reviwersTabQA = "wfc-i-step__tab-item-reviewers";

    private defaultListItemDeleteBtnQA = "wfc-user-assigned__delete-button";


    //approver tab
    private approverMatrixToolBarBtnQA = "wfc-i-step__open-approval-matrix-toolbar-button";
    private addApproverToolBarBtnQA = "wfc-i-step__add-approver-toolbar-button";
    private addFirstApproverBtnQA = "wfc-i-step__add-first-approver-button";
    private approversListQA = "wfc-i-step__approvers-list";

    private addDefaultApproverBtnQA = "wfc-i-step__set-default-approver-button";
    private defaultApproversListQA = "wfc-user-assigned";
    private defaultApproversAllListQA = "wfc-i-step__default-approver";




    //reviwerTab
    private reviwerMatrixToolBarBtnQA = "wfc-i-step__open-reviewer-matrix-toolbar-button";
    private addReviwerToolBarBtnQA = "wfc-i-step__add-reviewer-toolbar-button";
    private addFirstReviwerBtnQA = "wfc-i-step__add-first-reviewer-button";
    private reviwersListQA = "wfc-i-step__reviewers-list";

    //bubble
    private stepBubbleTextQA = "wfc-i-step__bubble-text";
    private stepBubbleInputQA = "wfc-i-step__bubble-text-input";
    private stepBubbleCloseBtnQA = "wfc-i-step__delete-step-button";

    private deadLineIcon = "wfc-duration-editor";

    private dragHandle = "wfc-i-step__drag-handle";

}