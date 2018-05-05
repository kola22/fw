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


describe("Delete", function () {

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


    it("Wrong case", function () {
        Common.LogNameTestPlan('Test-plan: ');
        let noSave = false;

        let overView = new OverviewPage();
        overView.HamburgerClick();
        overView.AddNewCompany(companyName,noSave);
        let settingCompany = new CompanySetting();
        settingCompany.DeleteCompany('delete ');
        settingCompany.DeleteCompany('alks;djf3987');

    });


});
