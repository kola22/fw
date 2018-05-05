import { Page } from "../../Pages/Page";
import { LoginForm } from "../../Pages/Forms/LogIn";
import { LogoMenu } from "../../Pages/Forms/LogoMenu";
import { MainPage } from "../../Pages/MainPage";
import { OverviewPage } from "../../Pages/OverviewPage";
import { XeroWorkflows } from "../../Pages/Forms/XeroWorkflows";
import { CompanySetting } from "../../Pages/CompanySetting";
import { DropDownState, Validation, DisplayState, WorkFlowType, ConditionsType, EnabledState, XeroLoginMethod } from "../../Common/Enums";
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
import {BaseWorkflowSettings,SafetyCatch} from "../../Pages/Popup/WorkflowSettings/BaseWorkflowSettings";




describe("Add new company", function () {

    beforeEach(function () {
        Common.Log('BeforeEach');
        Common.Spies.Set();

        Page.Navigate.TestApp();
        LoginForm.Login(Page.Config.testUser);
        let overView = new OverviewPage();
        overView.CloseNotificationBar();
    });

    afterEach(function () {
        Common.Log('AfterAll');
        Page.Navigate.TestApp();
        let logoMenu = new LogoMenu();
        logoMenu.LogoMenuClick(DropDownState.Open);
        logoMenu.LogoutCLick();
        Common.Spies.Log();
        browser.sleep(1500);
    });


    it("Change name", function () {
        Common.LogNameTestPlan('Test-plan:  ');

        let overView = new OverviewPage();
        overView.HamburgerClick();
        overView.DeleteAllCompany();

        overView.AddNewCompany(null);
        // Common.ClickInDrawerReg();
        Common.CheckTitleBrowser("Organisation | Unnamed Organisation | ApprovalMax");
        overView.HamburgerClick();
        overView.CheckSortingCompany(["Unnamed Organisation"]);
        Common.ClickInDrawerReg();
        let settingCompany = new CompanySetting();
        settingCompany.RenameCompany(' ');
        Common.CheckTitleBrowser("Organisation | Unnamed Organisation | ApprovalMax");
        Common.RefreshBrowser();
        Common.CheckTitleBrowser("Organisation | | ApprovalMax");

        settingCompany.RenameCompany('11');
        Common.CheckTitleBrowser("Organisation | | ApprovalMax");
        Common.RefreshBrowser();
        Common.CheckTitleBrowser("Organisation | 11 | ApprovalMax");

        settingCompany.RenameCompany(' ');
        Common.CheckTitleBrowser("Organisation | 11 | ApprovalMax");
        Common.RefreshBrowser();
        Common.CheckTitleBrowser("Organisation | | ApprovalMax");
        overView.HamburgerClick();
        overView.CheckSortingCompany([" "]);
        Common.ClickInDrawerReg();

        settingCompany.RenameCompany("                  qa         ");
        Common.CheckTitleBrowser("Organisation | | ApprovalMax");
        Common.RefreshBrowser();
        Common.CheckTitleBrowser("Organisation | qa | ApprovalMax");
        overView.HamburgerClick();
        overView.CheckSortingCompany(["                  qa         "]);

    });

    it("Symbol name", function () {
        Common.LogNameTestPlan('Test-plan:  ');

        let overView = new OverviewPage();
        overView.HamburgerClick();
        overView.DeleteAllCompany();

        overView.AddNewCompany('            ^(?(")(".+?(?<!)"@)|(([0-9a-z]((+=0!@#$%^&*()_+~?><');
        overView.HamburgerClick();
        overView.CheckSortingCompany(['            ^(?(")(".+?(?<!)"@)|(([0-9a-z]((+=0!@#$%^&*()_+~?><']);
        Common.ClickInDrawerReg();
        Common.CheckTitleBrowser("Organisation | Unnamed Organisation | ApprovalMax");
        Common.RefreshBrowser();
        Common.CheckTitleBrowser('Organisation | ^(?(")(".+?(?<!)"@)|(([0-9a-z]((+=0!@#$%^&*()_+~?>< | ApprovalMax');



    });

});
