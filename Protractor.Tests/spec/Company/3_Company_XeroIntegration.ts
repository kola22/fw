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
import { WorkflowStep } from "../../Pages/Forms/WorkflowStep";
import { CompanyMenuGroup } from "../../Pages/Controls/CompanyMenuGroup";
import { MatrixLine } from "../../Pages/Matrix/MatrixLine";
import { MatrixPopup } from "../../Pages/Matrix/MatrixPopup";
import { DurationEditor } from "../../Pages/Popup/DurationEditor";
import { XeroSyncPopup } from "../../Pages/Popup/XeroSyncPopup";
import { XeroWorkflowCard } from "../../Pages/Forms/WorkflowCard";
import { MatrixLinesContainer } from "../../Pages/Matrix/MatrixLinesContainer";
import { StandAloneWorkflowCard } from "../../Pages/Forms/WorkflowCard";
import { StandaloneWorkflows } from "../../Pages/Forms/StandaloneWorkflows";
import {XeroWfSettings,LockDate,FraudDetectionBypassing,FraudDetectionChangeAfterApprovalSetting} from "../../Pages/Popup/WorkflowSettings/XeroWfSettings";
import {StandAloneWfSettings} from "../../Pages/Popup/WorkflowSettings/StandAloneWfSettings";
import { XeroAccount } from "../../Pages/XeroAccount";


describe("3_Company_XeroIntegration   .   ts", function () {

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
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Company_3_2pRIS2h');
        let noSave = false;

        let overView = new OverviewPage();
        overView.HamburgerClick();
        overView.AddNewCompany(companyName,noSave);
        let settingCompany = new CompanySetting();
        settingCompany.CheckCurrency('USD');
        settingCompany.CheckTimeZone('(UTC+03:00) Moscow, St. Petersburg, Volgograd');
        settingCompany.CheckBlockContent(SyncType.Xero);
        settingCompany.CheckBlockContent(SyncType.QB);
        settingCompany.ConnectToXeroInSettingPage();
        settingCompany.CheckCurrency('USD');
        settingCompany.CheckTimeZone('(UTC+03:00) Moscow, St. Petersburg, Volgograd');

        Common.RefreshBrowser();
        settingCompany.CheckCurrency('RUB');
        settingCompany.CheckTimeZone('(UTC+00:00) Casablanca');

        settingCompany.CheckBlockContentAfterSync(SyncType.Xero);
        settingCompany.ClickXeroCompanyUrl();
        settingCompany.XeroCacheButton();

        Common.RefreshBrowser();
        settingCompany.CheckCurrency('RUB');
        settingCompany.CheckTimeZone('(UTC+00:00) Casablanca');

        settingCompany.DisconnectedXero();
        settingCompany.CheckCurrency('RUB');
        settingCompany.CheckTimeZone('(UTC+00:00) Casablanca');

        Common.RefreshBrowser();
        settingCompany.CheckCurrency('RUB');
        settingCompany.CheckTimeZone('(UTC+00:00) Casablanca');

        settingCompany.ReconnectToXero();
        settingCompany.CheckCurrency('RUB');
        settingCompany.CheckTimeZone('(UTC+00:00) Casablanca');

        Common.RefreshBrowser();
        settingCompany.CheckCurrency('RUB');
        settingCompany.CheckTimeZone('(UTC+00:00) Casablanca');
        settingCompany.CheckBlockContentAfterSync(SyncType.Xero);
});

    xit("Change currency and time zone", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Company_3_2pRIS2h');
        let toSave = true;
        let noSave = false;
        let company = 'qa_qa_test';

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

        settingCompany.ConnectToXeroInSettingPage();
        settingCompany.CheckCurrency('DOP');
        settingCompany.CheckTimeZone('(UTC-10:00) Aleutian Islands');

        Common.RefreshBrowser();
        settingCompany.CheckCurrency('RUB');
        settingCompany.CheckTimeZone('(UTC+00:00) Casablanca');
    });

    it("Another company", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Company_3_2pRIS2h');
        let company = 'qa_qa_test';
        let overView = new OverviewPage();
        overView.HamburgerClick();
        overView.AddNewCompany(company);

        let settingCompany = new CompanySetting();
        settingCompany.ConnectToXeroInSettingPage();
        settingCompany.DisconnectedXero();

        let xero = new XeroAccount();
        xero.LogOutInXero();

        settingCompany.ReconnectToXero(true,true);
        settingCompany.CheckBlockContentAfterDisconnect(SyncType.Xero);
        settingCompany.ReconnectToXero(false,true);

        settingCompany.CheckBlockContentAfterDisconnect(SyncType.Xero);
        Common.RefreshBrowser();
        settingCompany.CheckBlockContentAfterDisconnect(SyncType.Xero);

        xero.LogOutInXero();
        settingCompany.ReconnectToXero(true);

    });

    it("Do not click Save", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Company_3_2pRIS2h');
        let toSave = true;
        let noSave = false;
        let company = 'qa_qa_test';
        let overView = new OverviewPage();
        overView.HamburgerClick();
        overView.AddNewCompany(company,noSave);

        let settingCompany = new CompanySetting();
        settingCompany.ConnectToXeroInSettingPage();
        Common.RefreshBrowser();
        settingCompany.CheckBlockContentAfterSync(SyncType.Xero);
        settingCompany.SaveClick();
        settingCompany.CheckBlockContentAfterSync(SyncType.Xero);
        Common.RefreshBrowser();
        settingCompany.CheckBlockContentAfterSync(SyncType.Xero);

    });

});
