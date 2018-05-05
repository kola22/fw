import { Common } from "../../../Common/Common";
import { CheckBoxState, EnabledState } from "../../../Common/Enums";
import { Page } from "../../Page";
import { BaseWorkflowSettings } from "./BaseWorkflowSettings";
import { CheckBox } from "../../Controls/CheckBox";
import { RadioGroup } from "../../Controls/RadioGroup";
import { DateTimeEditor } from "../../Controls/DateTimeEditor";

export class QbWfSettings extends BaseWorkflowSettings {
    constructor(notifyCbState: EnabledState = EnabledState.Disabled) {
        super();
        Page.Wait.ElementDisplayed(this.settingPopUp, "Settings PopUp not displayed");

        // this.notifyAdministratorCb.CheckEnabled(notifyCbState);
    }
}