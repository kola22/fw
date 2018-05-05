import { Common } from "../../Common/Common";
import { Page } from "../Page";

export class DurationEditor {

    constructor() {
        Page.Wait.ElementDisplayed(this.panel, "DurationEditor");
    }

    public DaysUpClick(clickCount: number = 1, daysValue: number = null, hoursValue: number = null) {
        Common.Log('DurationEditor: Days up click count ' + clickCount);
        this.ClickDurationBtn(this.daysUpBtn, clickCount, daysValue, hoursValue);
    }

    public DaysDownClick(clickCount: number = 1, daysValue: number = null, hoursValue: number = null) {
        Common.Log('DurationEditor: Days down click count ' + clickCount);
        this.ClickDurationBtn(this.daysDownBtn, clickCount, daysValue, hoursValue);
    }

    public HoursUpClick(clickCount: number = 1, daysValue: number = null, hoursValue: number = null) {
        Common.Log('DurationEditor: Hours up click count ' + clickCount);
        this.ClickDurationBtn(this.hoursUpBtn, clickCount, daysValue, hoursValue);
    }

    public HoursDownClick(clickCount: number = 1, daysValue: number = null, hoursValue: number = null) {
        Common.Log('DurationEditor: Hours down click count ' + clickCount);
        this.ClickDurationBtn(this.hoursDownBtn, clickCount, daysValue, hoursValue);
    }

    public CheckDays(daysValue: number = null) {
        if (daysValue != null) {
            expect(this.daysValueElemnt.getText()).toBe(daysValue.toString(), "DurationEditor: days value wrong");
        }
    }

    public CheckHours(hoursValue: number = null) {
        if (hoursValue != null) {
            expect(this.hoursValueElement.getText()).toBe(hoursValue.toString(), "DurationEditor: hours value wrong");
        }
    }

    private panel = element(by.css(".wfc-duration-editor__panel"));

    private daysUpBtn = Common.ElementByDateQa("wfc-duration-editor-panel__days-up-button");
    private daysDownBtn = Common.ElementByDateQa("wfc-duration-editor-panel__days-down-button");
    private daysValueElemnt = Common.ElementByDateQa("wfc-duration-editor-panel__days");

    private hoursUpBtn = Common.ElementByDateQa("wfc-duration-editor-panel__hours-up-button");
    private hoursDownBtn = Common.ElementByDateQa("wfc-duration-editor-panel__hours-down-button");
    private hoursValueElement = Common.ElementByDateQa("wfc-duration-editor-panel__hours");

    private ClickDurationBtn(btnElement: protractor.ElementFinder, clickCount: number, daysValue: number = null, hoursValue: number = null) {
        Page.Wait.ElementDisplayed(btnElement, "DurationEditor btn");

        for (var i = 0; i < clickCount; i++) {
            btnElement.click()
            browser.sleep(500);
        }

        this.CheckDays(daysValue);
        this.CheckHours(hoursValue);
    }
}