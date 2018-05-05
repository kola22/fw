import { Common } from "../../Common/Common";
import { XeroLoginMethod } from "../../Common/Enums";
import { Input } from "../Controls/Input";
import { Page, User } from "../Page";

export class XeroLoginForm {
    constructor(loginMethod: XeroLoginMethod = XeroLoginMethod.WithFrom) {
        Page.Wait.UrlContains("xero.com");
        switch (loginMethod) {
            case XeroLoginMethod.WithFrom:
                // Page.Wait.ElementDisplayed(this.form, "Xero login form");
                // Page.Wait.UrlContains("login.xero.com");
                break;
            case XeroLoginMethod.WithoutForm:
                break;
        }        
    }

    public SetEmail(value: string) {
        Common.Log("Xero set email \"" + value + "\"");
        this.emailInput.SetValue(value);
    }

    public SetPassword(value: string) {
        Common.Log("Xero set password \"" + value + "\"");
        this.passwordInput.SetValue(value);
    }

    public Login(user: User) {
        Common.Log("Xero login");
        var self = this;
        this.loginFieldInXero.isPresent().then(function (result) {
            if (result) {
                Common.Log("Xero login: Use Email & Password");
                self.SetEmail(user.Email);
                self.SetPassword(user.Password);
                self.LoginSubmitClick();
            }else{
                Common.Log("Xero login: DO NOT USED Email & Password");
            }
        });
    }

    public LoginSubmitClick() {
        Common.Log("Xero login submit click");
        this.loginSubmitButton.click();
    }

    public AllowAccessClick() {
        Common.Log("Xero login AllowAccess Click");
        browser.sleep(1500);
        this.allowAccess.click();
        browser.sleep(5000);
    }

    private emailInput: Input = Input.ById("email");
    private passwordInput: Input = Input.ById("password");

    private form = element(by.id("LoginForm"));
    private loginSubmitButton: protractor.ElementFinder = this.form.element(by.id("submitButton"));
    private allowAccess: protractor.ElementFinder = element(by.id("submit-button"));

    //30.3.18
    private loginFieldInXero = (element(by.xpath("//*[@id='submitButton']")));

}
