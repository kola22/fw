import { Page } from "./Page";
import { Common } from "../Common/Common";


export class XeroAccount {
    constructor() {
        Common.Log("XeroAccount");

    }

    public LogOutInXero(){
        Common.Log("LogOutInXero");
        browser.driver.executeScript("$(window.open('https://my.xero.com'))");
        Common.SwitchToWindow(1);
        browser.sleep(2000);
        Page.Wait.ElementDisplayed(this.userNameXero,"XeroAccount: userNameXero");
        this.userNameXero.click();
        browser.sleep(1000);
        this.logOutXero.click();
        browser.sleep(2000);
        browser.close();
        Common.SwitchToWindow(0);
    }

    private userNameXero = element(by.className("username"));
    private logOutXero = element(by.xpath("//li[@class='xn-h-profile-card-navigation-item grid-3 logout']"));
}