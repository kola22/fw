import { Common } from "../../Common/Common";
import { Page } from "../Page";
import { WorkFlowType, Confirm, CloseState,EnabledState } from "../../Common/Enums";
import { Input } from "../Controls/Input";
import { InputDropDown } from "../Controls/InputDropDown";
import { WorkflowStep } from "./WorkflowStep";
import { ConfirmationPanel } from "../Popup/ConfirmationPanel";
import { UnsavedChangesPopup } from "../Popup/UnsavedChangesPopup";
import { AlertMessage } from "../Popup/AlertMessage";


export class BaseWorkflowCard {

    constructor(private saveBtnElement: protractor.ElementFinder) {
        Common.Log("WorkflowCard page: Constructor page");
        Page.Wait.ElementDisplayed(this.cardElement, "Workflow");
        browser.sleep(1000);
    }

    public ActivateWorkflow(state=EnabledState.Enabled,error:boolean=false) {
        Common.Log("WorkflowCard pages: Click Activate");
        this.activateBtn.click();
        this.CheckErrorStep(error);

        browser.sleep(1500);
        if(state == EnabledState.Enabled){
            this.CloseActivatePopUp();
        }

    }

    private CloseActivatePopUp(){
        browser.sleep(1000);
        this.closeAfterActivate.click();
        browser.sleep(1000);
    }

    private CheckErrorStep(error){
        if (error) {
            let alertMessage = new AlertMessage;
            alertMessage.NoStepsError();
        }
    }

    public UpdateWorkflow(error:boolean = false) {
        Common.Log("WorkflowCard update");
        this.updateBtn.click();
        this.CheckErrorStep(error);

        browser.sleep(2500);
    }

    public AddNewStep(stepName: string = null, index: number = 0): WorkflowStep {
        Common.Log("WorkflowCard add step=\"" + stepName + "\"");
        this.addNewStep.click();
        browser.sleep(500);

        Page.pressEnter();
        browser.sleep(500);

        let defaultNameStep = 'Approval step';
        let workflowStep = new WorkflowStep(defaultNameStep, [], index);
        if (stepName && stepName != defaultNameStep) {
            workflowStep.RenameStep(stepName);
        }
        return workflowStep;
    }

    public SaveWorkflow() {
        Common.Log("WorkflowCard save");
        expect(this.saveBtnElement != null).toBe(true, "WorkflowCard save button element not set");
        this.saveBtnElement.click();
        browser.sleep(2000);
    }

    public SettingsClick() {
        Common.Log("WorkflowCard settings click");
        // Page.Wait.ElementNotDisplayed(this.settingsaBtn, "WorkflowCard settings button");
        this.settingsaBtn.click();
        browser.sleep(3000);
    }

    public Discard(confirm: Confirm = Confirm.Yes) {
        Common.Log("WorkflowCard discard");
        this.ToolBarMenuClick();

        Page.Wait.ElementDisplayed(this.toolBarMenuDiscardItem, "WorkflowCard toolbar menu discard item");
        this.toolBarMenuDiscardItem.click();

        this.Confirmation(confirm);
    }

    public Deactivate() {
        Common.Log("WorkflowCard deactivate");
        this.ToolBarMenuClick();

        Page.Wait.ElementDisplayed(this.toolBarMenuDiscardItem, "WorkflowCard toolbar menu deactivate item");
        this.toolBarMenuDiscardItem.click();
    }

    public CheckWorkflow() {
        //TO DO
    }

    public Close(closeState: CloseState = CloseState.NoChanges) {
        this.closeButton.click();

        switch (closeState) {
            case CloseState.NoChanges:
                Common.Log("WorkflowCard: Close");
                Page.Wait.ElementNotDisplayed(this.cardElement, "WorkflowCard");
                break;
            case CloseState.DiscardChanges:
                Common.Log("WorkflowCard: Close");
                let unsavedChangesPopup1 = new UnsavedChangesPopup();
                unsavedChangesPopup1.DiscardClick();
                Page.Wait.ElementNotDisplayed(this.cardElement, "WorkflowCard");
                break;
            case CloseState.ContinueEditing:
                Common.Log("WorkflowCard: Close");
                let unsavedChangesPopup2 = new UnsavedChangesPopup();
                unsavedChangesPopup2.ContinueEditClick()
                break;
        }
    }

    public CheckWarningAfterTrySaving(displayed = true){
        Common.Log("WorkflowCard: Check Warning After Try Saving");
        displayed ? Page.Wait.ElementDisplayed(this.warningInBottom,'Warning',1000) : Page.Wait.ElementNotDisplayed(this.warningInBottom,'Warning',1000);

    }

    public ApproverWarningAfterTrySaving(displayed = true){
        Common.Log("WorkflowCard: Check Warning After Try Saving");
        displayed ? Page.Wait.ElementDisplayed(this.warningInApprover,'Warning',1000) : Page.Wait.ElementNotDisplayed(this.warningInApprover,'Warning',1000);

    }


    protected cardElement = element(by.css(".wfc__card"));
    protected addNewStep = Common.ElementByDateQa("wfc-add-step");
    protected closeButton = Common.ElementByDateQa("navigation__close-page-button");

    protected toolBarMenu = Common.ElementByDateQa("wfc-toolbar__action-menu");
    protected toolBarMenuDiscardItem = Common.ElementByDateQa("wfc-toolbar__discardTemplateChanges-menu-item");
    protected toolBarMenuDeactivateItem = Common.ElementByDateQa("wfc-toolbar__disableTemplate-menu-item");
    protected settingsaBtn = Common.ElementByDateQa("wfc-toolbar__updateTemplateSettings-button");
    protected activateBtn = Common.ElementByDateQa("wfc-toolbar__enableTemplate-button");
    protected updateBtn = Common.ElementByDateQa("wfc-toolbar__updateEnabledTemplate-button");

    protected warningInBottom = element(by.xpath("//*[@class='alert alert-danger']"));
    protected warningInApprover = Common.ElementByDateQa("wfc-validation-bubble");

    protected closeAfterActivate = element(by.xpath("//*[@class='ui-default-popup-content__header-close']"));




    public ToolBarMenuClick() {
        Page.Wait.ElementDisplayed(this.toolBarMenu, "WorkflowCard toolbar menu");
        this.toolBarMenu.click();
    }

    protected Confirmation(confirm: Confirm) {
        let confirmationPanel = new ConfirmationPanel();
        switch (confirm) {
            case Confirm.Yes: confirmationPanel.ClickYes();
                break;
            case Confirm.No: confirmationPanel.ClickNo();
                break;
        }
    }
}

export class StandAloneWorkflowCard extends BaseWorkflowCard {
    constructor() {
        super(Common.ElementByDateQa("wfc-toolbar__createTemplate-button"));
    }

    public SetName(name: string) {
        Common.Log("WorkflowCard save name=\"" + name + "\"");
        this.nameInput.SetValue(name);
    }

    public Delete(confirm: Confirm = Confirm.Yes) {
        Common.Log("WorkflowCard delete");
        this.ToolBarMenuClick();

        Page.Wait.ElementDisplayed(this.toolBarMenuDeleteItem, "WorkflowCard toolbar menu delete item");
        this.toolBarMenuDeleteItem.click();

        this.Confirmation(confirm);
    }

    private GetSelectDropDown(): InputDropDown {
        return new InputDropDown('//*[@class="wfc-sas-step"]');
    }

    public AddRequester(name){
        Common.Log("WorkflowCard Add Requester");
        this.addRequesterButton.click();
        let multiSelect = this.GetSelectDropDown();
        multiSelect.SelectItem(name);
    }

    private nameInput = Input.ByDataQa("wfc-toolbar__name-input");
    private toolBarMenuDeleteItem = Common.ElementByDateQa("wfc-toolbar__deleteTemplate-menu-item");

    private addRequesterButton = Common.ElementByDateQa("wfc-sas-step__add-submitter-button");
}

export class XeroWorkflowCard extends BaseWorkflowCard {
    constructor() {
        super(Common.ElementByDateQa("wfc-toolbar__saveDraftTemplate-button"));
    }

    public StartOverClick() {
        Common.Log("WorkflowCard start over click");
        Page.Wait.ElementDisplayed(this.toolBarMenu, "WorkflowCard toolbar menu");
        this.toolBarMenu.click();

        Page.Wait.ElementDisplayed(this.toolBarMenuTartOverItem, "WorkflowCard toolbar start over item");
        this.toolBarMenuTartOverItem.click();

    }

    public RemoveXeroRequester(){
        Common.Log("WorkflowCard Remove Xero Requester");
        this.deleteXeroRequesterButton.click();
    }

    public AddXeroRequester(name){
        Common.Log("WorkflowCard Add Xero Requester");
        this.addXeroRequesterButton.click();
        let multiSelect = this.GetSelectDropDown();
        multiSelect.SelectItem(name);
    }

    private GetSelectDropDown(): InputDropDown {
        return new InputDropDown('//*[@class="wfc-int-s-step"]');
    }

    public RemoveRequester(){
        Common.Log("WorkflowCard Remove Requester");
        this.deleteRequesterButton.click();
    }

    public AddRequester(name){
        Common.Log("WorkflowCard Add Requester");
        this.addRequesterButton.click();
        let multiSelect = this.GetSelectDropDown();
        multiSelect.SelectItem(name);
    }

    public RequesterMatrixClick(){
        Common.Log("WorkflowCard Requester Matrix Click");
        this.requesterMatrix.click();
        browser.sleep(1000);
    }





    private toolBarMenuTartOverItem = Common.ElementByDateQa("wfc-toolbar__startOver-menu-item");
    private deleteXeroRequesterButton = Common.ElementByDateQa("wfc-user-assigned__delete-button");
    private addXeroRequesterButton = Common.ElementByDateQa("wfc-int-s-step__set-external-submitter-button");

    private deleteRequesterButton = Common.ElementByDateQa("wfc-user-list-item__delete-button");
    private addRequesterButton = Common.ElementByDateQa("wfc-int-s-step__add-first-submitter-button");

    private requesterMatrix = Common.ElementByDateQa("wfc-int-s-step__open-submitter-matrix-toolbar-button");



}