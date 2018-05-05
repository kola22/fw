import { Page } from "../Page";
import { BaseFakeScreen } from "../BaseFakeScreen";
import { Common } from "../../Common/Common";
import { DropDownState } from "../../Common/Enums";


export class LogoMenu extends BaseFakeScreen {
    constructor() {
        super();
        Common.Log("LogoMenu constructor");

        Page.Wait.ElementDisplayed(this.logoMenuElement, "LogoMenu");
        this.CheckIsCorrect();
    }

    public LogoMenuClick(dropDownState: DropDownState) {
        Common.Log("LogoMenu: click menu");

        this.logoMenuElement.click();

        switch (dropDownState) {
            case DropDownState.Open: expect(Common.HasClass(this.logoMenuElement, "open")).toBe(true,"Drop down menu not opened");
                break;
            case DropDownState.Collapsed: expect(Common.HasClass(this.logoMenuElement, "open")).toBe(false, "Drop down menu not collapsed");
                break;
        }
        browser.sleep(3000);
    }

    public LogoutCLick() {
        Common.Log("Logout click");
        Page.Wait.ElementDisplayed(this.logutMenuElement, "LogoMenu: logout");
        this.logutMenuElement.click()
    }

    private logoMenuElementPath = Common.DateQaPath("qa-page-header__profile-btn");
    private logoMenuElement = element(by.xpath(this.logoMenuElementPath));

    private logutMenuElementPath = Common.DateQaPath("page-header__profile-dropdown-logout");
    private logutMenuElement = element(by.xpath(this.logutMenuElementPath));

    private CheckIsCorrect() {
        expect(this.logoMenuElement.isDisplayed()).toBe(true, "Logomenu not displayed");
    }
}