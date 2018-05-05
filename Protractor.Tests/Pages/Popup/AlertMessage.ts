import { Common } from "../../Common/Common";
import { Page } from "../Page";

export class AlertMessage {

    constructor() {
      Page.Wait.ElementDisplayed(this.alertContainer, "Alert Container");
    }

    public NoStepsError() {
        Common.Log("NoStepsError");
        expect(this.alertContainer.getText()).toContain('Please add at least one approval step to the workflow', "Message in Alert Container");
    }

    private alertContainer = element.all(by.css("#alertContainer .alert")).first();

}