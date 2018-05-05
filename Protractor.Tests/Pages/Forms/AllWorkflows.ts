import { Common } from "../../Common/Common";
import { XeroLoginMethod,WorkFlowType } from "../../Common/Enums";
import { Input } from "../Controls/Input";
import { Page, User } from "../Page";


export class AllWorkflows {

    constructor() {
    }

    public CloseCongratulationPopUp(){
        Common.Log("Close Congratulation PopUp");
        Page.Wait.ElementDisplayed(this.closeCongratulationPopUp,"PopUp Congratulation cancel button");
        this.closeCongratulationPopUp.click();
    }

    public DisconectClick() {
        // Common.Log("Disconect");
        browser.sleep(2000);
        Page.Wait.ElementDisplayed(this.mewnuBtn, "Menu button");
        Common.ScrollIntoView(this.mewnuBtn);
        this.mewnuBtn.click();

        Page.Wait.Element(this.disconectBtn, "Disconect button");
        this.disconectBtn.click();
        Page.Wait.ElementDisplayed(this.textAfterDisconnect, "Disconnect text not visible");
    }



    private closeCongratulationPopUp = Common.ElementByDateQa("ui-default-popup-content__close-button");

    private textAfterDisconnect = element(by.xpath("//*[contains(text(),'Disconnected from ')]"));
    private disconectBtn = Common.ElementByDateQa("wfl-int-card-normal-header__action-item-disconnect");
    private mewnuBtn = Common.ElementByDateQa("wfl-int-card-normal-header__action-menu");

    public textAfterConnect = element(by.xpath("//*[contains(text(),'connected to')]"));


}