import { Page } from "../Page";
import { Common } from "../../Common/Common";
import {EnabledState} from "../../Common/Enums";
//import {  } from "../../Common/Enums";

export class RadioGroup {
    constructor(private radioGroupQA: string) {
    }

    public ItemClick(itemId: string) {
        Common.Log("RadioGroup click: " + itemId + " click");
        let rgItem = this.GetRadioGroupItem(itemId);
        Page.Wait.ElementDisplayed(rgItem, "RadioGroup: " + itemId + " click");
        rgItem.click();
    }

    private radioGroupItemQA = "form-radio-group-item";


    private GetRadioGroupItem(itemId: string) {
        return element(by.xpath(Common.DateQaPath(this.radioGroupQA) + Common.DateQaPathAndId(this.radioGroupItemQA, itemId)));
    }
//*[@data-qa='wfc-settings-popup__lock-date']//*[@data-qa='form-radio-group-item']//*[contains(@class,'ui-radiobox')]
    public CheckRadioGroupCheckedElement(numberCheckedElement:number){
        browser.sleep(1000);
        Common.Log("Workflow settings: Check radio button settings");
        let stepApproversListPath = Common.DateQaPath(this.radioGroupQA)+Common.DateQaPath("form-radio-group-item")+"//*[contains(@class,'ui-radiobox')]";
        let stepApproversList = element.all(by.xpath(stepApproversListPath));
        Page.Wait.Element(stepApproversList.first(),"");


        stepApproversList.each(function (el: protractor.ElementFinder, index: number) {
            var approverInList = stepApproversList.get(index);
            expect(Common.HasClass(approverInList, "ui-radiobox--checked")).toBe(index==numberCheckedElement, "Radio button checked state wrong");
        });
    }
}