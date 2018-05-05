import { Page, User } from "../Page";
import { Common } from "../../Common/Common";
import { Validation, DisplayState } from "../../Common/Enums";
import { Input } from "../Controls/Input";

export class LoginForm {
    constructor() {
        Common.Log("Login window constructor class");
        Page.Wait.ElementDisplayed(this.formElement, "Log in window",60000);
        this.CheckIsCorrect();
    }

    public static Login(user: User) {
        let loginForm = new LoginForm();
        loginForm.SetEmail(user.Email, Validation.Valid);
        loginForm.SetPassword(user.Password, Validation.Valid);
        loginForm.SignInButtonClick();
    }

    public SignInButtonClick(displayState: DisplayState = DisplayState.Hide) {
        Common.Log("Login: SignIn button click");

        //wait previous messages to be hidden
        this.WaitGlobalMewssageHide();

        this.loginButtonElement.click();

        this.CheckGlobalMessageState(displayState)
        browser.sleep(5000);
    }

    public SetEmail(value: string, validationState: Validation = Validation.Valid) {
        Common.LogWithValue("Login: set email ",value);
        this.emailInput.SetValue(value,protractor.Key.TAB,true,false);
    }

    public SetPassword(value: string, validationState: Validation = Validation.Valid) {
        Common.LogWithValue("Login: set password ",value);
        this.passwordInput.SetValue(value,protractor.Key.TAB,true,false);

    }

    private CheckGlobalMessageState(displayState: DisplayState) {
        Common.Log("Login global message is \"" + DisplayState[displayState] + "\"");

        switch (displayState) {
            case DisplayState.Shown:
                this.globalMessageChildsElement = element.all(by.xpath(this.globalMessageChildsPath)).first();
                Page.Wait.ElementDisplayed(this.globalMessageChildsElement, "Global message for login window");
                break;
            case DisplayState.Hide:
                this.WaitGlobalMewssageHide();
                break;
        }
    }

    private WaitGlobalMewssageHide() {
        this.globalMessageChildsElement = element.all(by.xpath(this.globalMessageChildsPath)).first();
        Page.Wait.ElementNotPresent(this.globalMessageChildsElement, "Global message for login window");
    }

    // private emailInput = Input.ByDataQa("login-page__email-input");
    private emailInput = Input.ByXpath("//*[@class='aut-email-field__editor']");
    //private passwordInput = Input.ByDataQa("login-page__pwd-input");
    private passwordInput = Input.ByXpath("//*[@class='aut-password-field__editor']");
    private loginButtonElement = Common.ElementByDateQa("login-page__log-in-btn");
    // private loginButtonElement = element(by.xpath("//*[@class='aut-login-module__login-button ui-standard-button ui-standard-button--large ui-standard-button--color-forest-green']"));


    private formElement = element(by.className("aut-login-module"));
    private globalMessageChildsPath = "//*[@id='alertContainer']//div";
    private globalMessageChildsElement: protractor.ElementFinder;

    private CheckIsCorrect() {
        expect(this.loginButtonElement.isDisplayed()).toBe(true, "Login button not showing");
        expect(this.formElement.isDisplayed()).toBe(true, "Login window not showing");
    }
}