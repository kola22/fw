import { Page } from "../../Pages/Page";
import { LoginForm } from "../../Pages/Forms/LogIn";
import { LogoMenu } from "../../Pages/Forms/LogoMenu";
import { MainPage } from "../../Pages/MainPage";
import { OverviewPage } from "../../Pages/OverviewPage";
import { CompanySetting } from "../../Pages/CompanySetting";
import { DropDownState, CloseState, DisplayState, WorkFlowType, ConditionsType, XeroLoginMethod, ValueState, EnabledState} from "../../Common/Enums";
import { Common } from "../../Common/Common";
import { RandomGenerator } from "../../Common/RandomGenerator";
import { WorkflowStep } from "../../Pages/Forms/WorkflowStep";
import { StandAloneWorkflowCard, XeroWorkflowCard } from "../../Pages/Forms/WorkflowCard";
import { StandaloneWorkflows } from "../../Pages/Forms/StandaloneWorkflows";
import { XeroWorkflows } from "../../Pages/Forms/XeroWorkflows";
import { StandAloneMatrix } from "../../Pages/Matrix/StandAloneMatrix";
import { QbWorkflows } from "../../Pages/Forms/QbWorkflows";



describe("15_Workflows_RulesActivated . ts", function () {

    let companyName = "test" + RandomGenerator.generate(6);
    let defaultNameStep = Page.Config.defaultStepName;

    beforeAll(function () {
        Common.Log('BeforeEach');
        Common.Spies.Set();

        Page.Navigate.TestApp();
        LoginForm.Login(Page.Config.testUser);
        let overView = new OverviewPage();
        overView.CloseNotificationBar();
    });

    afterAll(function () {
        Common.Log('AfterAll');

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

    it("Rules that activated Workflow  Xero Bill", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_15_2ym8cnd');

        let existingApprover2 = "Test Auto";
        browser.sleep(1500);
        let overView = new OverviewPage();
        overView.HamburgerClick();
        overView.AddNewCompany(companyName);
        let settingCompany = new CompanySetting();
        overView.HamburgerClick();
        overView.OpenWorkFlowTab(companyName);
        let xeroWorkflows = new XeroWorkflows();
        xeroWorkflows.ConnectToXero(XeroLoginMethod.WithoutForm);
        xeroWorkflows.PayableWorkflows.BillClick();

        let workflowCard = new XeroWorkflowCard();
        let workflowStep1 = new WorkflowStep(defaultNameStep);

        workflowCard.ActivateWorkflow(EnabledState.Disabled);
        workflowCard.ApproverWarningAfterTrySaving();
        workflowCard.ActivateWorkflow(EnabledState.Disabled);
        workflowCard.ApproverWarningAfterTrySaving();
        workflowStep1.AddExistingApprover(existingApprover2, [existingApprover2]);
        // workflowCard.AddXeroRequester(existingApprover2);

        workflowCard.ActivateWorkflow();

        workflowCard.ApproverWarningAfterTrySaving(false);
        workflowCard.UpdateWorkflow();
        workflowCard.ApproverWarningAfterTrySaving(false);
        workflowCard.RemoveXeroRequester();
        workflowCard.UpdateWorkflow();
        workflowCard.ApproverWarningAfterTrySaving();
        workflowCard.AddXeroRequester("Test Auto");
        workflowCard.Close(CloseState.DiscardChanges);

    });

    it("Rules that activated Workflow  Xero PO", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_15_2ym8cnd');

        let existingApprover2 = "Test Auto";
        browser.sleep(1500);
        // let overView = new OverviewPage();
        // overView.HamburgerClick();
        // overView.AddNewCompany(companyName);
        // let settingCompany = new CompanySetting();
        // overView.HamburgerClick();
        // overView.OpenWorkFlowTab(companyName);
        let xeroWorkflows = new XeroWorkflows();
        // xeroWorkflows.ConnectToXeroInSettingPage(XeroLoginMethod.WithoutForm);
        xeroWorkflows.PayableWorkflows.PurchaseOrderClick();

        let workflowCard = new XeroWorkflowCard();
        let workflowStep1 = new WorkflowStep(defaultNameStep);

        workflowCard.ActivateWorkflow(EnabledState.Disabled);
        workflowCard.ApproverWarningAfterTrySaving();
        workflowCard.ActivateWorkflow(EnabledState.Disabled);
        workflowCard.ApproverWarningAfterTrySaving();
        workflowStep1.AddExistingApprover(existingApprover2, [existingApprover2]);

        workflowCard.ActivateWorkflow();
        workflowCard.ApproverWarningAfterTrySaving(false);
        workflowCard.UpdateWorkflow();
        workflowCard.ApproverWarningAfterTrySaving(false);
        workflowCard.RemoveRequester();
        workflowCard.UpdateWorkflow();
        workflowCard.ApproverWarningAfterTrySaving();
        workflowCard.AddRequester("Test Auto");

        workflowCard.UpdateWorkflow();
        workflowCard.ApproverWarningAfterTrySaving(false);

        workflowCard.RemoveRequester();
        workflowCard.UpdateWorkflow();
        // browser.sleep(1000);
        workflowCard.ApproverWarningAfterTrySaving();
        browser.sleep(10001);
        workflowCard.ApproverWarningAfterTrySaving();
        workflowCard.Close(CloseState.DiscardChanges);
    });

    it("Rules that activated Workflow  StandAlone", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_15_2ym8cnd');

        let existingApprover2 = "Test Auto";

        // let overView = new OverviewPage();
        // overView.HamburgerClick();
        //
        // overView.AddNewCompany(companyName);
        // overView.HamburgerClick();
        //
        // overView.OpenWorkFlowTab(companyName);
        let standaloneWorkflows = new StandaloneWorkflows();
        standaloneWorkflows.CreateFirstClick();

        let workflowCard = new XeroWorkflowCard();
        let workflowCardStandAlone = new StandAloneWorkflowCard();
        let workflowStep1 = new WorkflowStep(defaultNameStep);

        workflowCardStandAlone.SetName('test test test');
        workflowCard.ActivateWorkflow(EnabledState.Disabled);
        workflowCard.ApproverWarningAfterTrySaving();
        workflowCard.ActivateWorkflow(EnabledState.Disabled);
        workflowCard.ApproverWarningAfterTrySaving();
        workflowStep1.AddExistingApprover(existingApprover2, [existingApprover2]);


        workflowCard.ActivateWorkflow(EnabledState.Disabled);
        workflowCard.ApproverWarningAfterTrySaving(false);
        workflowCard.UpdateWorkflow();
        workflowCard.ApproverWarningAfterTrySaving(false);

        workflowCard.RemoveXeroRequester();
        workflowCard.UpdateWorkflow();
        workflowCard.ApproverWarningAfterTrySaving();
        // workflowCard.UpdateWorkflow();
        // browser.sleep(10001);
        // workflowCard.ApproverWarningAfterTrySaving(false);

        workflowCardStandAlone.AddRequester("Test Auto");
        workflowCard.UpdateWorkflow();
        workflowCard.ApproverWarningAfterTrySaving(false);
        workflowCard.Close();

    });

    it("Rules that activated Workflow  AP CN", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_15_2ym8cnd');

        let existingApprover2 = "Test Auto";
        browser.sleep(1500);
        // let overView = new OverviewPage();
        // overView.HamburgerClick();
        // overView.AddNewCompany(companyName);
        // let settingCompany = new CompanySetting();
        // overView.HamburgerClick();
        // overView.OpenWorkFlowTab(companyName);
        let xeroWorkflows = new XeroWorkflows();
        // xeroWorkflows.ConnectToXeroInSettingPage(XeroLoginMethod.WithoutForm);
        xeroWorkflows.PayableWorkflows.ApCreditNoteClick();

        let workflowCard = new XeroWorkflowCard();
        let workflowStep1 = new WorkflowStep(defaultNameStep);

        workflowCard.ActivateWorkflow(EnabledState.Disabled);
        workflowCard.ApproverWarningAfterTrySaving();
        workflowCard.ActivateWorkflow(EnabledState.Disabled);
        workflowCard.ApproverWarningAfterTrySaving();
        workflowStep1.AddExistingApprover(existingApprover2, [existingApprover2]);

        workflowCard.ActivateWorkflow();
        workflowCard.ApproverWarningAfterTrySaving(false);
        workflowCard.UpdateWorkflow();
        workflowCard.ApproverWarningAfterTrySaving(false);
        workflowCard.RemoveXeroRequester();
        workflowCard.UpdateWorkflow();
        workflowCard.ApproverWarningAfterTrySaving();
        workflowCard.AddXeroRequester("Test Auto");
        workflowCard.Close(CloseState.DiscardChanges);

    });

    it("Rules that activated Workflow  AR CN", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_15_2ym8cnd');

        let existingApprover2 = "Test Auto";
        browser.sleep(1500);
        // let overView = new OverviewPage();
        // overView.HamburgerClick();
        // overView.AddNewCompany(companyName);
        // let settingCompany = new CompanySetting();
        // overView.HamburgerClick();
        // overView.OpenWorkFlowTab(companyName);
        let xeroWorkflows = new XeroWorkflows();
        // xeroWorkflows.ConnectToXeroInSettingPage(XeroLoginMethod.WithoutForm);
        xeroWorkflows.ReceivableWorkflows.ARCreditNoteClick();

        let workflowCard = new XeroWorkflowCard();
        let workflowStep1 = new WorkflowStep(defaultNameStep);

        workflowCard.ActivateWorkflow(EnabledState.Disabled);
        workflowCard.ApproverWarningAfterTrySaving();
        workflowCard.ActivateWorkflow(EnabledState.Disabled);
        workflowCard.ApproverWarningAfterTrySaving();
        workflowStep1.AddExistingApprover(existingApprover2, [existingApprover2]);

        workflowCard.ActivateWorkflow();
        workflowCard.ApproverWarningAfterTrySaving(false);
        workflowCard.UpdateWorkflow();
        workflowCard.ApproverWarningAfterTrySaving(false);
        workflowCard.RemoveXeroRequester();
        workflowCard.UpdateWorkflow();
        workflowCard.ApproverWarningAfterTrySaving();
        workflowCard.AddXeroRequester("Test Auto");
        workflowCard.Close(CloseState.DiscardChanges);

    });

    it("Rules that activated Workflow  SI", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_15_2ym8cnd');

        let existingApprover2 = "Test Auto";
        browser.sleep(1500);
        // let overView = new OverviewPage();
        // overView.HamburgerClick();
        // overView.AddNewCompany(companyName);
        // let settingCompany = new CompanySetting();
        // overView.HamburgerClick();
        // overView.OpenWorkFlowTab(companyName);
        let xeroWorkflows = new XeroWorkflows();
        // xeroWorkflows.ConnectToXeroInSettingPage(XeroLoginMethod.WithoutForm);
        xeroWorkflows.ReceivableWorkflows.SalesInvoiceClick();

        let workflowCard = new XeroWorkflowCard();
        let workflowStep1 = new WorkflowStep(defaultNameStep);

        workflowCard.ActivateWorkflow(EnabledState.Disabled);
        workflowCard.ApproverWarningAfterTrySaving();
        workflowCard.ActivateWorkflow(EnabledState.Disabled);
        workflowCard.ApproverWarningAfterTrySaving();
        workflowStep1.AddExistingApprover(existingApprover2, [existingApprover2]);

        workflowCard.ActivateWorkflow();
        workflowCard.ApproverWarningAfterTrySaving(false);
        workflowCard.UpdateWorkflow();
        workflowCard.ApproverWarningAfterTrySaving(false);
        workflowCard.RemoveXeroRequester();
        workflowCard.UpdateWorkflow();
        workflowCard.ApproverWarningAfterTrySaving();
        workflowCard.AddXeroRequester("Test Auto");
        workflowCard.Close(CloseState.DiscardChanges);
    });

});


describe("15_Workflows_RulesActivated . ts QB", function () {

    let companyName = "test" + RandomGenerator.generate(6);

    beforeEach(function () {
        Common.Log('BeforeEach');
        Common.Spies.Set();
        Page.Navigate.TestApp();
        browser.sleep(2500);
        LoginForm.Login(Page.Config.testUser);
        let overView = new OverviewPage();
        overView.CloseNotificationBar();
    });

    afterEach(function () {
        Common.Log('AfterAll');

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

    it("Rules that activated Workflow  QB PO", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_15_2ym8cnd');

        let defaultNameStep = Page.Config.defaultStepName;
        let existingApprover2 = "Test Auto";
        browser.sleep(1500);
        let overView = new OverviewPage();
        overView.HamburgerClick();
        overView.AddNewCompany(companyName);
        let settingCompany = new CompanySetting();
        overView.HamburgerClick();
        overView.OpenWorkFlowTab(companyName);
        let qbWorkflows = new QbWorkflows();
        qbWorkflows.ConnectToQb();
        qbWorkflows.PurchaseOrderClick();

        let workflowCard = new XeroWorkflowCard();
        let workflowStep1 = new WorkflowStep(defaultNameStep);

        workflowCard.ActivateWorkflow(EnabledState.Disabled);
        workflowCard.ApproverWarningAfterTrySaving();
        workflowCard.ActivateWorkflow(EnabledState.Disabled);
        workflowCard.ApproverWarningAfterTrySaving();
        workflowStep1.AddExistingApprover(existingApprover2, [existingApprover2]);

        workflowCard.ActivateWorkflow();
        workflowCard.ApproverWarningAfterTrySaving(false);
        workflowCard.UpdateWorkflow();
        workflowCard.ApproverWarningAfterTrySaving(false);
        workflowCard.RemoveRequester();
        workflowCard.UpdateWorkflow();
        workflowCard.ApproverWarningAfterTrySaving();
        workflowCard.AddRequester("Test Auto");
        workflowCard.UpdateWorkflow();
        workflowCard.ApproverWarningAfterTrySaving(false);
    });


});
