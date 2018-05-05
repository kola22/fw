import { Page } from "../Page";
import { Common } from "../../Common/Common";
import { DropDownState } from "../../Common/Enums";

export class CompanyMenuGroup {
    constructor(private name: string) {
        this.Init();
    }

    public ClickRootElement(state: DropDownState) {
        Common.Log("CompanyMenuGroup for \"" + this.name + "\" click root element");
        Common.ScrollIntoView(this.rootElement);
        this.rootElement.click();
        this.CheckCollapsed(state);
    }

    public ClickOpenRequest() {
        Common.Log("CompanyMenuGroup for \"" + this.name + "\" click open requests");
        this.ClickMenuElementByQa("navigation-drawer__company-open-requests-button");
    }

    public ClickAllRequest() {
        Common.Log("CompanyMenuGroup: For \"" + this.name + "\" click All requests");
        this.ClickMenuElementByQa("navigation-drawer__company-all-requests-button");
    }

    public ClickWorkflows() {
        Common.Log("CompanyMenuGroup: For \"" + this.name + "\" click Workflows");
        this.ClickMenuElementByQa("navigation-drawer__company-workflow-templates-button");
    }

    public ClickSettings() {
        Common.Log("CompanyMenuGroup: For \"" + this.name + "\" click Settings");
        this.ClickMenuElementByQa("navigation-drawer__company-page-button",true);
    }

    private rootElement: protractor.ElementFinder;

    private Init() {
        this.rootElement = Common.ElementByDateQaName(this.name);
    }

    private CheckCollapsed(state: DropDownState) {
        expect(Common.ContainClass(this.rootElement, "menu-group__collapsed")).toBe(state == DropDownState.Collapsed, "Wrong collapsed state for \"" + this.name + "\"");
    }

    private ClickMenuElementByQa(dataQaValue: string, setting = false) {
        browser.sleep(2000);
        let xpath = Common.DateQaName(this.name) + Common.DateQaPath(dataQaValue);
        // if(setting == true){xpath = xpath + "[@title='Change Company settings'][2]"}
        let menuElement = element(by.xpath(xpath));
        browser.sleep(1000);
        Page.Wait.Element(menuElement, "Menu element data-qa=" + dataQaValue + " for company=\"" + this.name + "\"");
        Common.ScrollIntoView(menuElement);
        browser.sleep(1000);

        menuElement.click();
    }
}