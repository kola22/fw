import { Page } from "./Page";
import { Common } from "../Common/Common";
import { CompanySetting } from "./CompanySetting";
import { DropDownState, Validation, DisplayState, WorkFlowType, } from "../Common/Enums";
import { Input } from "./Controls/Input";
import { CompanyMenuGroup } from "./Controls/CompanyMenuGroup";

export class OverviewPage {
    constructor() {
        Common.Log("Overview Page constructor");
        Page.Wait.ElementDisplayed(this.hamburger, "Hamburger menu element",90000);
        browser.sleep(500);

        this.CheckIsCorrect();
    }

    public HamburgerClick() {
        Common.Log("Overview page: Hamburger Click");

        Page.Wait.ElementDisplayed(this.hamburger, "Hamburger menu element",90000);
        browser.sleep(500);
        this.hamburger.click();
        // browser.sleep(1500); 21.3.18
        browser.sleep(500);
    }

    public OpenWorkFlowTab(companyName: string = null, clickToRoot: boolean = false) {
        let companyMenuGroup = new CompanyMenuGroup(companyName);
        if (clickToRoot) {
            companyMenuGroup.ClickRootElement(DropDownState.Open);
        }
        companyMenuGroup.ClickWorkflows();
    }

    public OpenSettingTab(companyName: string) {
        let companyMenuGroup = new CompanyMenuGroup(companyName);
        companyMenuGroup.ClickSettings();
    }

    public ExpandCompanyMenu(companyName: string, state : DropDownState = DropDownState.Open) {
        Common.Log("ExpandCompanyMenu");
        let companyMenuGroup = new CompanyMenuGroup(companyName);
        companyMenuGroup.ClickRootElement(state);
    }

    public AddNewCompany(name: string = null,needSave:boolean = true) {
        Common.Log("Overview page: Add New Company");

        // browser.sleep(1000);
        Common.ScrollIntoView(this.addNewCompany);
        this.addNewCompany.click();

        let companySetting = new CompanySetting();
        Common.GlobalProgressLineLoader();
        browser.sleep(1000);
        name != null ? companySetting.SetCompanyName(name) : browser.sleep(1000);
        needSave ? companySetting.SaveClick() : browser.sleep(20);
        browser.sleep(2000);
    }

    public DeleteCompany(companyName: string, clickToRoot: boolean = true) {
        Common.Log("Delete company");
        let companyMenuGroup = new CompanyMenuGroup(companyName);
        if (clickToRoot) {
            companyMenuGroup.ClickRootElement(DropDownState.Open);
        }
        companyMenuGroup.ClickSettings();

        let companySetting = new CompanySetting(companyName);
        companySetting.DeleteCompany();
        browser.sleep(1000);
    }

    public RenameCompany(oldCompanyName: string, newName: string, clickToRoot: boolean = true, unnamedCompany: boolean = false) {
        Common.Log("Rename company");
        let companyMenuGroup = new CompanyMenuGroup(oldCompanyName);
        if (clickToRoot) {
            companyMenuGroup.ClickRootElement(DropDownState.Open);
        }
        companyMenuGroup.ClickSettings();

        if (unnamedCompany) {
            oldCompanyName = null;
        }
        let companySetting = new CompanySetting(oldCompanyName);
        companySetting.RenameCompany(newName);
        browser.sleep(1000);
    }

    public DeleteAllCompany() {
        Common.Log("Delete ALL company");
        let x=0;
        var self = this;
        var companyIcon = this.companyIcon;
        while (x<50){
            x++;
            browser.wait((companyIcon).isPresent().then(function (result) {
                if (result) {
                    self.companyIcon.click();
                    browser.sleep(1000);
                    self.companySettings.click();
                    let companySetting = new CompanySetting();
                    companySetting.DeleteCompany();
                    browser.sleep(3000);
                    self.HamburgerClick();

                }
            }));
        }
    }

    public CloseNotificationBar() {
        // Page.Wait.ElementDisplayed(this.closeNotificationButton, "Hamburger menu element");
        // this.closeNotificationButton.click();

        (this.closeNotificationButton).isDisplayed().then(function (result) {
            Common.Log("Click 'Close Notification Bar'");
            return result ? (element(by.id("global-important-notification-bar-close-btn"))).click() : browser.sleep(100)

        });
    }

    public CheckSortingCompany(company : string[]){
        Common.Log("Check Company Count & Sorting: "+company.toString()+"");
        let companyList = element.all(by.xpath(Common.DateQaPath("navigation-drawer__company")));
        expect(companyList.count()).toBe(company.length, 'Company count do not equal == '+ company.length.toString() +' ');
        for (var i = 0; i < company.length; i++) {
            var companyInList = companyList.get(i);
            expect(companyInList.getAttribute("data-qa-name")).toBe(company[i], 'The company "' + company[i] + '" is not found ');
        }
    }

    protected companyIcon: protractor.ElementFinder = Common.ElementByDateQa("navigation-drawer__company-toggle-button");
    protected companySettings: protractor.ElementFinder = Common.ElementByDateQa("navigation-drawer__company-page-button");

    protected hamburger: protractor.ElementFinder = Common.ElementByDateQa("navigation__drawer-button");

    protected addNewCompany: protractor.ElementFinder = Common.ElementByDateQa("navigation-drawer__add-new-company-button");

    protected closeNotificationButton: protractor.ElementFinder = element(by.id("global-important-notification-bar-close-btn"));

    private CheckIsCorrect() {
        //TO DO
    }

    protected companyNameXpath = "navigation-drawer__company-page-button";
}