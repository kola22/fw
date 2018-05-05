import { Common } from "../../Common/Common";
import { Input } from "../Controls/Input";
import { Page, User } from "../Page";

export class QbLoginForm {
    constructor() {
        Common.LogWithValue("Wait URL ","appcenter.intuit.com");
        Page.Wait.UrlContains("appcenter.intuit.com");
    }

    public SetEmail(value: string) {
        Common.LogWithValue("QB set email = ",value);
        this.emailInput.SetValue(value,protractor.Key.TAB,true,false);
    }

    public SetPassword(value: string) {
        Common.LogWithValue("QB set password = ",value);
        this.passwordInput.SetValue(value,protractor.Key.TAB,true,false);
    }

    public Login(user: User) {
        Common.Log("Qb login page");
        this.SetEmail(user.Email);
        this.SetPassword(user.Password);
        this.LoginSubmitClick();
    }

    public LoginSubmitClick() {
        Common.Log("Qb login: click 'Submit' button");
        this.loginSubmitButton.click();
    }

    public AuthorizeClick() {
        Common.Log("Qb authorize page: click Authorize button");
        Page.Wait.Element(this.authorize,'authorize button in QB');
        this.authorize.click();
        browser.sleep(5000);
    }

    private emailInput: Input = Input.ById("ius-userid",true);
    private passwordInput: Input = Input.ById("ius-password",true);

    private form = element(by.id("ius-sign-in-actions"));
    private loginSubmitButton: protractor.ElementFinder = this.form.element(by.id("ius-sign-in-submit-btn"));
    public authorize: protractor.ElementFinder = element(by.id("authorizeBtn"));
}
