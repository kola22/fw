import { Page } from "../Page";
import { Common } from "../../Common/Common";

export class DateTimeEditor {

    constructor() {
    }

    public NextClcik() {
        Common.Log("DateTimeEditor: next click");
        let next = element(by.xpath(Common.DateQaPath(this.panelQA) + "//*[contains(@class,'next')]"));
        next.click();
    }

    public PrevClcik() {
        Common.Log("DateTimeEditor: prev click");
        let prev = element(by.xpath(Common.DateQaPath(this.panelQA) + "//*[contains(@class,'prev')]"));
        prev.click();
    }    

    public SetDay(value: string) {
        Common.Log("DateTimeEditor: set day= " + value);
        let dateItem = element(by.xpath(this.dayPathTemplate.replace('{dayValue}', value)));
        dateItem.click();
        browser.sleep(1000);
        expect(Common.HasClass(dateItem, "day active")).toBe(true, "Date not set");
        this.Close();
    }

    public SetMonth(value: string) {
        Common.Log("DateTimeEditor: set month= " + value);
        this.PickerSwitchClick();

        let monthItem = element(by.xpath(this.monthPathTemplate.replace('{monthValue}', value)));
        monthItem.click();
        browser.sleep(1000);

        let pickerSwitch = element(by.xpath(this.pickerSwitchPath));
        expect(pickerSwitch.getText()).toContain(value, "Month not set");
        this.Close();
    }


    public SetYear(value: string) {
        Common.Log("DateTimeEditor: set year= " + value);
        this.PickerSwitchClick();        

        this.PickerSwitchClick();

        let yearItem = element(by.xpath(this.yearPathTemplate.replace('{yearValue}', value)));
        yearItem.click();
        browser.sleep(1000);

        let pickerSwitch = element(by.xpath(this.pickerSwitchPath));
        expect(pickerSwitch.getText()).toContain(value, "Year not set");
        this.Close();
    }

    private panelQA = "form-date-time-editor--t-form__panel";
    private dayPathTemplate = "//*[.='{dayValue}'][@data-action='selectDay']";
    private monthPathTemplate = "//*[.='{monthValue}'][@data-action='selectMonth']";    
    private yearPathTemplate = "//*[.='{yearValue}'][@data-action='selectYear']";        
    private pickerSwitchPath = "//*[@data-action='pickerSwitch']";

    private PickerSwitchClick() {
        Common.Log("DateTimeEditor: PickerSwitchClick");
        let pickerSwitch = element(by.xpath(this.pickerSwitchPath));
        pickerSwitch.click();
        browser.sleep(1000);
    }

    private Close() {
        let panel = Common.ElementByDateQa(this.panelQA);
        browser.actions().mouseMove(panel, { x: -20, y: -20 }).click().perform();
    }
}