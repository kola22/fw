import { Page } from "../../Pages/Page";
import { LoginForm } from "../../Pages/Forms/LogIn";
import { LogoMenu } from "../../Pages/Forms/LogoMenu";
import { MainPage } from "../../Pages/MainPage";
import { OverviewPage } from "../../Pages/OverviewPage";
import { XeroWorkflows } from "../../Pages/Forms/XeroWorkflows";
import { CompanySetting } from "../../Pages/CompanySetting";
import { DropDownState, Validation, DisplayState, WorkFlowType, ConditionsType, SyncType, XeroLoginMethod } from "../../Common/Enums";
import { Common } from "../../Common/Common";
import { RandomGenerator } from "../../Common/RandomGenerator";



describe("QB integration", function () {

    let companyName = "test" + RandomGenerator.generate(6);
    beforeEach(function () {
        Common.Log('BeforeEach');
        Common.Spies.Set();

        Page.Navigate.TestApp();
        LoginForm.Login(Page.Config.testUser);
        let overView = new OverviewPage();
        overView.CloseNotificationBar();
    });

    afterEach(function () {
        Common.Log('After Each');
        Page.Navigate.TestApp();
        let logoMenu = new LogoMenu();
        logoMenu.LogoMenuClick(DropDownState.Open);
        logoMenu.LogoutCLick();
        Common.Spies.Log();
        browser.sleep(1500);
    });


    xit("Main", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Company_4_2Egjbxy');
        let noSave = false;

        let overView = new OverviewPage();
        overView.HamburgerClick();
        overView.AddNewCompany(companyName,noSave);
        let settingCompany = new CompanySetting();
        settingCompany.CheckCurrency('USD');
        settingCompany.CheckTimeZone('(UTC+03:00) Moscow, St. Petersburg, Volgograd');
        settingCompany.CheckBlockContent(SyncType.Xero);
        settingCompany.CheckBlockContent(SyncType.QB);
        settingCompany.ConnectToQBInSettingPage();


        settingCompany.CheckCurrency('USD');
        settingCompany.CheckTimeZone('(UTC+03:00) Moscow, St. Petersburg, Volgograd');

        Common.RefreshBrowser();
        settingCompany.CheckCurrency('ANG');
        settingCompany.CheckTimeZone('(UTC+03:00) Moscow, St. Petersburg, Volgograd');


        settingCompany.DisconnectedXero();
        settingCompany.CheckCurrency('ANG');
        settingCompany.CheckTimeZone('(UTC+03:00) Moscow, St. Petersburg, Volgograd');

        Common.RefreshBrowser();
        settingCompany.CheckCurrency('ANG');
        settingCompany.CheckTimeZone('(UTC+03:00) Moscow, St. Petersburg, Volgograd');

        settingCompany.ReconnectToQB();
        settingCompany.CheckCurrency('ANG');
        settingCompany.CheckTimeZone('(UTC+03:00) Moscow, St. Petersburg, Volgograd');

        Common.RefreshBrowser();
        settingCompany.CheckCurrency('ANG');
        settingCompany.CheckTimeZone('(UTC+03:00) Moscow, St. Petersburg, Volgograd');
        settingCompany.CheckBlockContentAfterSync(SyncType.QB);
    });

    xit("Change currency and time zone", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Company_4_2Egjbxy');
        let noSave = false;

        let overView = new OverviewPage();
        overView.HamburgerClick();
        overView.AddNewCompany(companyName,noSave);
        let settingCompany = new CompanySetting();
        settingCompany.CheckCurrency('USD');
        settingCompany.CheckTimeZone('(UTC+03:00) Moscow, St. Petersburg, Volgograd');
        settingCompany.CheckBlockContent(SyncType.Xero);
        settingCompany.CheckBlockContent(SyncType.QB);

        settingCompany.SetTimeZOne('(UTC-10:00) Aleutian Islands');
        settingCompany.SetCurrency('DOP Dominican Peso');
        settingCompany.CheckCurrency('DOP');
        settingCompany.CheckTimeZone('(UTC-10:00) Aleutian Islands');

        settingCompany.SaveClick();
        settingCompany.CheckCurrency('DOP');
        settingCompany.CheckTimeZone('(UTC-10:00) Aleutian Islands');

        Common.RefreshBrowser();
        settingCompany.CheckCurrency('DOP');
        settingCompany.CheckTimeZone('(UTC-10:00) Aleutian Islands');

        settingCompany.ConnectToQBInSettingPage();
        settingCompany.CheckCurrency('DOP');
        settingCompany.CheckTimeZone('(UTC-10:00) Aleutian Islands');

        Common.RefreshBrowser();
        settingCompany.CheckCurrency('ANG');
        settingCompany.CheckTimeZone('(UTC-10:00) Aleutian Islands');
    });

    it("Do not click Save", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Company_4_2Egjbxy');
        let toSave = true;
        let noSave = false;
        let company = 'qa_qa_test';
        let overView = new OverviewPage();
        overView.HamburgerClick();
        overView.AddNewCompany(company,noSave);

        let settingCompany = new CompanySetting();
        settingCompany.ConnectToQBInSettingPage();
        Common.RefreshBrowser();
        settingCompany.CheckBlockContentAfterSync(SyncType.QB);
        settingCompany.SaveClick();
        settingCompany.CheckBlockContentAfterSync(SyncType.QB);
        Common.RefreshBrowser();
        settingCompany.CheckBlockContentAfterSync(SyncType.QB);

    });

});
