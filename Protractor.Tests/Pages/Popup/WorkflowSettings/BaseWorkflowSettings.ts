import { Common } from "../../../Common/Common";
import { RadioGroup } from "../../Controls/RadioGroup";
import { Page } from "../../Page";


export enum SafetyCatch {
    AutoApprove,
    AutoReject
}

export class BaseWorkflowSettings {

    constructor() {
    }

    public CloseClick() {
        Common.Log("Workflow settings close click");
        Page.Wait.ElementDisplayed(this.closeBtn, "Workflow settings close click");

        this.closeBtn.click();
        browser.sleep(1000);
    }

    public SaveClick() {
        Common.Log("Workflow settings save click");
        Page.Wait.ElementDisplayed(this.saveBtn, "Workflow settings save click");

        this.saveBtn.click();
        browser.sleep(1000);
    }

    public SafetyCatchSetting(elementToClick:SafetyCatch,indexCheck:number = null){
        browser.sleep(1000);
        let element = '';
        switch (elementToClick) {
            case SafetyCatch.AutoApprove:
                element = 'AutoApprove';
                break;
            case SafetyCatch.AutoReject:
                element = 'AutoReject';
                break;
        }
        if (indexCheck == null){
            this.RadioGroupItemClick(this.safetyCatchQA, element);
        }
        else {
            this.CheckButtonSettings(this.safetyCatchQA,indexCheck);
        }
    }

    private closeBtn = Common.ElementByDateQa("ui-default-popup-content__close-button");
    private saveBtn = Common.ElementByDateQa("wfc-settings-popup__apply-and-close-button");

    private safetyCatchQA =  "wfc-settings-popup__safety-catch";

    private safetyCatchRadioGroupQA = "wfc-settings-popup__safety-catch";

    protected CheckButtonSettings(qaPath, indexCheckButton : number){
        let radiogroup = new RadioGroup(qaPath);
        radiogroup.CheckRadioGroupCheckedElement(indexCheckButton);
    }

    protected RadioGroupItemClick(radioGroupQA: string, itemId: string) {
        Common.Log("Workflow settings: " + itemId + " click");
        let radiogroup = new RadioGroup(radioGroupQA);
        radiogroup.ItemClick(itemId);
    }

    protected settingPopUp = element(by.css(".wfc-settings-popup__content-wrp"));
}
