import { Page } from "../../Pages/Page";
import { LoginForm } from "../../Pages/Forms/LogIn";
import { LogoMenu } from "../../Pages/Forms/LogoMenu";
import { MainPage } from "../../Pages/MainPage";
import { OverviewPage } from "../../Pages/OverviewPage";
import { QbWorkflows } from "../../Pages/Forms/QbWorkflows";
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
import {QbWfSettings} from "../../Pages/Popup/WorkflowSettings/QbWfSettings";
import {StandAloneWfSettings} from "../../Pages/Popup/WorkflowSettings/StandAloneWfSettings";
import {BaseWorkflowSettings,SafetyCatch} from "../../Pages/Popup/WorkflowSettings/BaseWorkflowSettings";




describe("20_1_Workflows_WFsettings_QB . ts", function () {
    let companyName = "test" + RandomGenerator.generate(6);

    beforeAll(function () {
        Common.Log('Before All test scenario');
        Common.Spies.Set();

        Page.Navigate.TestApp();
        LoginForm.Login(Page.Config.testUser);
        let overView = new OverviewPage();
        overView.CloseNotificationBar();
        browser.sleep(1500);
    });

    afterAll(function () {
        Common.Log('After All test scenario');

        Page.Navigate.TestApp();
        let overView = new OverviewPage();
        overView.HamburgerClick();
        overView.DeleteCompany(companyName);

        let logoMenu = new LogoMenu();
        logoMenu.LogoMenuClick(DropDownState.Open);
        browser.sleep(1000);
        logoMenu.LogoutCLick();
        browser.sleep(1000);
        Common.Spies.Log();
    });

    it("WF settings QB", function () {

        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_20_2w1vL4A ');

        let overView = new OverviewPage();
        overView.HamburgerClick();
        overView.AddNewCompany(companyName);
        overView.HamburgerClick();
        overView.OpenWorkFlowTab(companyName);
        let qbWorkflows = new QbWorkflows();
        qbWorkflows.ConnectToQb();
        qbWorkflows.PurchaseOrderClick();

        let workflowCard = new XeroWorkflowCard();
        workflowCard.SettingsClick();
        let wfSettings = new QbWfSettings();
        wfSettings.SafetyCatchSetting(SafetyCatch.AutoReject);
        wfSettings.SafetyCatchSetting(null,1);
        wfSettings.SaveClick();
        workflowCard.SettingsClick();
        wfSettings.SafetyCatchSetting(SafetyCatch.AutoApprove);
        wfSettings.SafetyCatchSetting(null,0);
    });



});