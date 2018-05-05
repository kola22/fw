import { Common } from "../../../Common/Common";
import { CheckBoxState, EnabledState } from "../../../Common/Enums";
import { Page } from "../../Page";
import { BaseWorkflowSettings } from "./BaseWorkflowSettings";
import { CheckBox } from "../../Controls/CheckBox";
import { RadioGroup } from "../../Controls/RadioGroup";
import { DateTimeEditor } from "../../Controls/DateTimeEditor";

export enum LockDate {
    LockApproval,
    ApproveWithNextDay
}


export enum FraudDetectionBypassing {
    false,
    true
}

export enum FraudDetectionChangeAfterApprovalSetting {
    Contact,
    NewTotalAmount,
    Tracking,
    Account,
    Item,
    Description
}

export class XeroWfSettings extends BaseWorkflowSettings {
    constructor(notifyCbState: EnabledState = EnabledState.Disabled) {
        super();
        Page.Wait.ElementDisplayed(this.settingPopUp, "Settings PopUp not displayed");

         // this.notifyAdministratorCb.CheckEnabled(notifyCbState);
    }



    public LockDateSetting(elementToClick:LockDate,indexCheck:number = null){
        browser.sleep(1000);
        let element = '';
        switch (elementToClick) {
            case LockDate.LockApproval:
                element = 'LockApproval';
                break;
            case LockDate.ApproveWithNextDay:
                element = 'ApproveWithNextDay';
                break;
        }
        if (indexCheck == null){
            this.RadioGroupItemClick(this.lockDateRadioGroupQA, element);
        }
        else {
            this.CheckButtonSettings(this.lockDateRadioGroupQA,indexCheck);
        }
    }


    public FraudDetectionBypassingSetting(elementToClick:FraudDetectionBypassing,indexCheck:number = null ){
        browser.sleep(1000);
        let element = '';
        switch (elementToClick) {
            case FraudDetectionBypassing.false:
                element = 'false';
                break;
            case FraudDetectionBypassing.true:
                element = 'true';
                break;
        }
        if (indexCheck == null){
            this.RadioGroupItemClick(this.fraudDetectionBypassingRadioGroupQA, element);
            if (element == 'true'){
                this.DatePickerClick();
                let dataPicker = new DateTimeEditor();
                dataPicker.PrevClcik();
                dataPicker.SetDay('4'); // Заглушка, чтобы не учитывать дни
            }

        }
        else {
            this.CheckButtonSettings(this.fraudDetectionBypassingRadioGroupQA,indexCheck);
        }
    }

    public FraudDetectionChangeAfterApprovalSettingCheck(checkedSettings : FraudDetectionChangeAfterApprovalSetting[] = new Array()){
        browser.sleep(1000);
        for (var i = 0; i < checkedSettings.length; i++) {
            switch (checkedSettings[i]) {
                case FraudDetectionChangeAfterApprovalSetting.Contact:
                    this.contactFDsetting.CheckState(CheckBoxState.Checked);
                    break;
                case FraudDetectionChangeAfterApprovalSetting.NewTotalAmount:
                    this.totalAmountFDsetting.CheckState(CheckBoxState.Checked);
                    break;
                case FraudDetectionChangeAfterApprovalSetting.Tracking:
                    this.trackingFDsetting.CheckState(CheckBoxState.Checked);
                    break;
                case FraudDetectionChangeAfterApprovalSetting.Account:
                    this.accountFDsetting.CheckState(CheckBoxState.Checked);
                    break;
                case FraudDetectionChangeAfterApprovalSetting.Item:
                    this.itemFDsetting.CheckState(CheckBoxState.Checked);
                    break;
                case FraudDetectionChangeAfterApprovalSetting.Description:
                    this.descriptionFDsetting.CheckState(CheckBoxState.Checked);
                    break;
            }
        }
    }

    public FraudDetectionChangeAfterApprovalSettingClick(checkedSettings : FraudDetectionChangeAfterApprovalSetting[] = new Array()){
        browser.sleep(1000);
        for (var i = 0; i < checkedSettings.length; i++) {
            switch (checkedSettings[i]) {
                case FraudDetectionChangeAfterApprovalSetting.Contact:
                    this.contactFDsetting.Click();
                    break;
                case FraudDetectionChangeAfterApprovalSetting.NewTotalAmount:
                    this.totalAmountFDsetting.Click();
                    break;
                case FraudDetectionChangeAfterApprovalSetting.Tracking:
                    this.trackingFDsetting.Click();
                    break;
                case FraudDetectionChangeAfterApprovalSetting.Account:
                    this.accountFDsetting.Click();
                    break;
                case FraudDetectionChangeAfterApprovalSetting.Item:
                    this.itemFDsetting.Click();
                    break;
                case FraudDetectionChangeAfterApprovalSetting.Description:
                    this.descriptionFDsetting.Click();
                    break;
            }
        }
    }




    public DoNotPullDocumentToApprovalClick() {
        this.RadioGroupItemClick(this.fraudDetectionBypassingRadioGroupQA, "false");
    }

    public PullDocumentToApprovalClick() {
        this.RadioGroupItemClick(this.fraudDetectionBypassingRadioGroupQA, "true");
    }

    public NotifyAdministratorClick(state: CheckBoxState) {
        // this.notifyAdministratorCb.Click(state);
    }

    public DatePickerClick() {
        Common.Log("Workflow setting date picker click")
        let dateTimePicker = element(by.xpath(Common.DateQaPath(this.dateTimePickerInputQA)));
        dateTimePicker.click();
    }





    // public CheckSettings (lockDate,safetyCatch,fraudDetection, fraudDetectionCheckBox, poMatching){
    // }


    private lockDateRadioGroupQA = "wfc-settings-popup__lock-date";    

    private fraudDetectionBypassingRadioGroupQA = "wfc-settings-popup__FraudDetectionBypassing-enabled";
    private dateTimePickerInputQA = "form-date-time-editor__input";
    // private notifyAdministratorCb: CheckBox = new CheckBox("wfc-settings-popup__FraudDetectionBypassing-notify-admins");

    // check box in FRAUD DETECTION — CHANGES AFTER APPROVAL
    private contactFDsetting : CheckBox = new CheckBox("wfc-settings-popup__FraudDetectionChangesAfterSection-ContactId");
    private totalAmountFDsetting : CheckBox = new CheckBox("wfc-settings-popup__FraudDetectionChangesAfterSection-NetAmount");
    private trackingFDsetting : CheckBox = new CheckBox("wfc-settings-popup__FraudDetectionChangesAfterSection-TrackingCategories");
    private accountFDsetting : CheckBox = new CheckBox("wfc-settings-popup__FraudDetectionChangesAfterSection-LineItemAccountCode");
    private itemFDsetting : CheckBox = new CheckBox("wfc-settings-popup__FraudDetectionChangesAfterSection-LineItemCode");
    private descriptionFDsetting : CheckBox = new CheckBox("wfc-settings-popup__FraudDetectionChangesAfterSection-LineItemDescription");

}