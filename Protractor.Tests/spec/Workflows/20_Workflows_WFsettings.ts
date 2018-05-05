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




describe("20_Workflows_WFsettings .  ts", function () {
    let companyName = "test" + RandomGenerator.generate(6);
    let checkSettings = [FraudDetectionChangeAfterApprovalSetting.Contact, FraudDetectionChangeAfterApprovalSetting.Item];

    beforeAll(function () {
        Common.Log('BeforeEach');
        Common.Spies.Set();

        Page.Navigate.TestApp();
        LoginForm.Login(Page.Config.testUser);
        let overView = new OverviewPage();
        overView.CloseNotificationBar();
        browser.sleep(1500);
    });

    afterAll(function () {
        Common.Log('AfterEach');

        Page.Navigate.TestApp();
        let overView = new OverviewPage();
        overView.HamburgerClick();
        overView.DeleteCompany(companyName);

        let logoMenu = new LogoMenu();
        logoMenu.LogoMenuClick(DropDownState.Open);

        logoMenu.LogoutCLick();
        browser.sleep(1000);
        Common.Spies.Log();
    });

    it("WF settings Xero Bill", function () {

        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_20_2w1vL4A ');

        let overView = new OverviewPage();
        overView.HamburgerClick();
        overView.AddNewCompany(companyName);
        overView.HamburgerClick();
        overView.OpenWorkFlowTab(companyName);
        let xeroWorkflows = new XeroWorkflows();
        xeroWorkflows.ConnectToXero(XeroLoginMethod.WithoutForm);


        xeroWorkflows.PayableWorkflows.BillClick();
        let workflowCard = new XeroWorkflowCard();
        workflowCard.SettingsClick();
        let wfSettings = new XeroWfSettings();
        wfSettings.LockDateSetting(LockDate.ApproveWithNextDay);
        wfSettings.SafetyCatchSetting(SafetyCatch.AutoReject);
        wfSettings.FraudDetectionChangeAfterApprovalSettingClick(checkSettings);
        wfSettings.SaveClick();
        workflowCard.SettingsClick();
        wfSettings.LockDateSetting(null, 1);
        wfSettings.SafetyCatchSetting(null, 1);
        wfSettings.FraudDetectionChangeAfterApprovalSettingCheck(checkSettings);
        wfSettings.SaveClick();
        workflowCard.Close();
    });

    it("WF settings AP Credit Note", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_20_2w1vL4A ');
        let xeroWorkflows = new XeroWorkflows();
        xeroWorkflows.PayableWorkflows.ApCreditNoteClick();
        let workflowCard = new XeroWorkflowCard();
        browser.sleep(2000);
        workflowCard.SettingsClick();
        let wfSettings = new XeroWfSettings();
        wfSettings.LockDateSetting(LockDate.ApproveWithNextDay);
        wfSettings.SafetyCatchSetting(SafetyCatch.AutoReject);
        wfSettings.FraudDetectionChangeAfterApprovalSettingClick(checkSettings);
        wfSettings.SaveClick();
        workflowCard.SettingsClick();
        wfSettings.LockDateSetting(null, 1);
        wfSettings.SafetyCatchSetting(null, 1);
        wfSettings.FraudDetectionChangeAfterApprovalSettingCheck(checkSettings);
        wfSettings.SaveClick();
        workflowCard.Close();
    });

    it("WF settings Xero PO", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_20_2w1vL4A ');
        let xeroWorkflows = new XeroWorkflows();
        xeroWorkflows.PayableWorkflows.PurchaseOrderClick();
        let workflowCard = new XeroWorkflowCard();
        browser.sleep(2000);
        workflowCard.SettingsClick();
        let wfSettings = new XeroWfSettings();
        wfSettings.SafetyCatchSetting(SafetyCatch.AutoReject);
        wfSettings.FraudDetectionChangeAfterApprovalSettingClick(checkSettings);
        wfSettings.SaveClick();
        workflowCard.SettingsClick();
        wfSettings.SafetyCatchSetting(null, 1);
        wfSettings.FraudDetectionChangeAfterApprovalSettingCheck(checkSettings);
        wfSettings.SaveClick();
        workflowCard.Close();
    });

    it("WF settings AR Credit Note", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_20_2w1vL4A ');
        let xeroWorkflows = new XeroWorkflows();
        xeroWorkflows.ReceivableWorkflows.ARCreditNoteClick();
        let workflowCard = new XeroWorkflowCard();
        browser.sleep(2000);
        workflowCard.SettingsClick();
        let wfSettings = new XeroWfSettings();
        wfSettings.SafetyCatchSetting(SafetyCatch.AutoReject);
        wfSettings.FraudDetectionChangeAfterApprovalSettingClick(checkSettings);
        wfSettings.SaveClick();
        workflowCard.SettingsClick();
        wfSettings.SafetyCatchSetting(null,1);
        wfSettings.FraudDetectionChangeAfterApprovalSettingCheck(checkSettings);
        wfSettings.SaveClick();
        workflowCard.Close();
    });

    it("WF settings Sales Invoice", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_20_2w1vL4A ');
        let xeroWorkflows = new XeroWorkflows();
        xeroWorkflows.ReceivableWorkflows.SalesInvoiceClick();
        let workflowCard = new XeroWorkflowCard();
        browser.sleep(2000);
        workflowCard.SettingsClick();
        let wfSettings = new XeroWfSettings();
        wfSettings.SafetyCatchSetting(SafetyCatch.AutoReject);
        wfSettings.FraudDetectionChangeAfterApprovalSettingClick(checkSettings);
        wfSettings.SaveClick();
        workflowCard.SettingsClick();
        wfSettings.SafetyCatchSetting(null,1);
        wfSettings.FraudDetectionChangeAfterApprovalSettingCheck(checkSettings);
        wfSettings.SaveClick();
        workflowCard.Close();
    });

    it("WF settings Standalone", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_20_2w1vL4A ');
        let standaloneWorkflows = new StandaloneWorkflows();
        standaloneWorkflows.CreateFirstClick();
        let workflowCardSA = new StandAloneWorkflowCard();
        browser.sleep(2000);
        workflowCardSA.SettingsClick();
        let wfSettings = new StandAloneWfSettings();
        wfSettings.SafetyCatchSetting(SafetyCatch.AutoReject);
        wfSettings.SaveClick();
        workflowCardSA.SettingsClick();
        wfSettings.SafetyCatchSetting(null,1);
        wfSettings.SaveClick();
        workflowCardSA.Close();

    });

});
