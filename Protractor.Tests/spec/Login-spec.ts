import { Page } from "../Pages/Page";
import { LoginForm } from "../Pages/Forms/LogIn";
import { LogoMenu } from "../Pages/Forms/LogoMenu";
import { MainPage } from "../Pages/MainPage";
import { DropDownState, Validation, DisplayState } from "../Common/Enums";
import { Common } from "../Common/Common";
import { RandomGenerator } from "../Common/RandomGenerator";


describe("Basic login test", function () {

    beforeEach(function () {
        Common.Log('BeforeEach');
        Common.Spies.Set();
    });

    afterEach(function () {
        Common.Log('AfterEach');
        Common.Spies.Log();
    });

    it("Basic log in test", function () {
        Page.Navigate.TestApp();

        let loginFomr = new LoginForm();

        loginFomr.SetEmail(RandomGenerator.generate(5), Validation.NotValid);
        loginFomr.SetEmail(Page.Config.testUser.Email, Validation.Valid);

        loginFomr.SetPassword(RandomGenerator.generate(5), Validation.Valid);

        let globalMessageState = DisplayState.Shown;
        loginFomr.SignInButtonClick(globalMessageState);

        loginFomr.SetEmail(Page.Config.testUser.Email, Validation.Valid);
        loginFomr.SetPassword(Page.Config.testUser.Password, Validation.Valid);

        globalMessageState = DisplayState.Hide;
        loginFomr.SignInButtonClick(globalMessageState);

        let logoMenu = new LogoMenu();

        logoMenu.LogoMenuClick(DropDownState.Open);

        logoMenu.LogoutCLick();
    });
});
