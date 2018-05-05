import { Page } from "../../Pages/Page";
import { LoginForm } from "../../Pages/Forms/LogIn";
import { LogoMenu } from "../../Pages/Forms/LogoMenu";
import { MainPage } from "../../Pages/MainPage";
import { OverviewPage } from "../../Pages/OverviewPage";
import { XeroWorkflows } from "../../Pages/Forms/XeroWorkflows";
import { CompanySetting } from "../../Pages/CompanySetting";
import { DropDownState, Validation, DisplayState, WorkFlowType, ConditionsType, EnabledState, XeroLoginMethod, CloseState } from "../../Common/Enums";
import { Common } from "../../Common/Common";
import { RandomGenerator } from "../../Common/RandomGenerator";
import { WorkflowStep } from "../../Pages/Forms/WorkflowStep";
import { CompanyMenuGroup } from "../../Pages/Controls/CompanyMenuGroup";
import { QbWorkflows } from "../../Pages/Forms/QbWorkflows";
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

describe("22_Workflows_WithoutSteps  ts Xero+SA", function () {
    let companyName = "test" + RandomGenerator.generate(6);
    let checkSettings = [FraudDetectionChangeAfterApprovalSetting.Contact, FraudDetectionChangeAfterApprovalSetting.Item];
    let defaultNameStep = "Approval step";
    let existingApprover2 = "Test Auto";

    beforeAll(function () {
        Common.Log('BeforeAll');
        Common.Spies.Set();

        Page.Navigate.TestApp();
        LoginForm.Login(Page.Config.testUser);
        let overView = new OverviewPage();
        overView.CloseNotificationBar();
        browser.sleep(1500);
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

    it("Bill", function () {
        let seeError = true;
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_22_2BV0C4P');

        let overView = new OverviewPage();
        overView.HamburgerClick();
        overView.AddNewCompany(companyName);
        overView.HamburgerClick();
        overView.OpenWorkFlowTab(companyName);
        let xeroWorkflows = new XeroWorkflows();
        xeroWorkflows.ConnectToXero(XeroLoginMethod.WithoutForm);


        xeroWorkflows.PayableWorkflows.BillClick();
        let workflowCard = new XeroWorkflowCard();
        let workflowStep1 = new WorkflowStep(defaultNameStep);
        workflowStep1.DeleteStep();
        workflowCard.SaveWorkflow();
        workflowCard.ActivateWorkflow(EnabledState.Disabled,seeError);
        workflowCard.Close();
        xeroWorkflows.PayableWorkflows.BillClick();
        workflowCard.ActivateWorkflow(EnabledState.Disabled,seeError);
        let newStep = workflowCard.AddNewStep('11111');
        newStep.AddExistingApprover(existingApprover2,[existingApprover2]);
        workflowCard.ActivateWorkflow();
        newStep.DeleteStep();
        workflowCard.UpdateWorkflow(seeError);
        workflowCard.Close(CloseState.DiscardChanges);

    });

    it("Ap Credit Note", function () {
        let seeError = true;
        Common.LogNameTestPlan('Test-plan: ');

        let xeroWorkflows = new XeroWorkflows();
        xeroWorkflows.PayableWorkflows.ApCreditNoteClick();
        let workflowCard = new XeroWorkflowCard();
        let workflowStep1 = new WorkflowStep(defaultNameStep);
        workflowStep1.DeleteStep();
        workflowCard.SaveWorkflow();
        workflowCard.ActivateWorkflow(EnabledState.Disabled,seeError);
        workflowCard.Close();
        xeroWorkflows.PayableWorkflows.ApCreditNoteClick();
        workflowCard.ActivateWorkflow(EnabledState.Disabled,seeError);
        let newStep = workflowCard.AddNewStep('11111');
        newStep.AddExistingApprover(existingApprover2,[existingApprover2]);
        workflowCard.ActivateWorkflow();
        newStep.DeleteStep();
        workflowCard.UpdateWorkflow(seeError);
        workflowCard.Close(CloseState.DiscardChanges);

    });

    it("Xero PO", function () {
        let seeError = true;
        Common.LogNameTestPlan('Test-plan: ');

        let xeroWorkflows = new XeroWorkflows();
        xeroWorkflows.PayableWorkflows.PurchaseOrderClick();
        let workflowCard = new XeroWorkflowCard();
        let workflowStep1 = new WorkflowStep(defaultNameStep);
        workflowStep1.DeleteStep();
        workflowCard.SaveWorkflow();
        workflowCard.ActivateWorkflow(EnabledState.Disabled,seeError);
        workflowCard.Close();
        xeroWorkflows.PayableWorkflows.PurchaseOrderClick();
        workflowCard.ActivateWorkflow(EnabledState.Disabled,seeError);
        let newStep = workflowCard.AddNewStep('11111');
        newStep.AddExistingApprover(existingApprover2,[existingApprover2]);
        workflowCard.ActivateWorkflow();
        newStep.DeleteStep();
        workflowCard.UpdateWorkflow(seeError);
        workflowCard.Close(CloseState.DiscardChanges);

    });

    it("AR Credit Note", function () {
        let seeError = true;
        Common.LogNameTestPlan('Test-plan: ');

        let xeroWorkflows = new XeroWorkflows();
        xeroWorkflows.ReceivableWorkflows.ARCreditNoteClick();
        let workflowCard = new XeroWorkflowCard();
        let workflowStep1 = new WorkflowStep(defaultNameStep);
        workflowStep1.DeleteStep();
        workflowCard.SaveWorkflow();
        workflowCard.ActivateWorkflow(EnabledState.Disabled,seeError);
        workflowCard.Close();
        xeroWorkflows.ReceivableWorkflows.ARCreditNoteClick();
        workflowCard.ActivateWorkflow(EnabledState.Disabled,seeError);
        let newStep = workflowCard.AddNewStep('11111');
        newStep.AddExistingApprover(existingApprover2,[existingApprover2]);
        workflowCard.ActivateWorkflow();
        newStep.DeleteStep();
        workflowCard.UpdateWorkflow(seeError);
        workflowCard.Close(CloseState.DiscardChanges);

    });

    it("Sales Invoice", function () {
        let seeError = true;
        Common.LogNameTestPlan('Test-plan: ');

        let xeroWorkflows = new XeroWorkflows();
        xeroWorkflows.ReceivableWorkflows.SalesInvoiceClick();
        let workflowCard = new XeroWorkflowCard();
        let workflowStep1 = new WorkflowStep(defaultNameStep);
        workflowStep1.DeleteStep();
        workflowCard.SaveWorkflow();
        workflowCard.ActivateWorkflow(EnabledState.Disabled,seeError);
        workflowCard.Close();
        xeroWorkflows.ReceivableWorkflows.SalesInvoiceClick();
        workflowCard.ActivateWorkflow(EnabledState.Disabled,seeError);
        let newStep = workflowCard.AddNewStep('11111');
        newStep.AddExistingApprover(existingApprover2,[existingApprover2]);
        workflowCard.ActivateWorkflow();
        newStep.DeleteStep();
        workflowCard.UpdateWorkflow(seeError);
        workflowCard.Close(CloseState.DiscardChanges);

    });

    it("StandAlone", function () {
        let seeError = true;
        Common.LogNameTestPlan('Test-plan: ');



        let standaloneWorkflows = new StandaloneWorkflows();
        standaloneWorkflows.CreateFirstClick();
        let workflowCardSA = new StandAloneWorkflowCard();

        let workflowStep1 = new WorkflowStep(defaultNameStep);
        workflowStep1.DeleteStep();
        workflowCardSA.SetName('123123');
        workflowCardSA.SaveWorkflow();
        workflowCardSA.ActivateWorkflow(EnabledState.Disabled,seeError);
        workflowCardSA.Close();
        standaloneWorkflows.WorkflowClick("123123");
        workflowCardSA.ActivateWorkflow(EnabledState.Disabled,seeError);
        let newStep = workflowCardSA.AddNewStep('11111');
        newStep.AddExistingApprover(existingApprover2,[existingApprover2]);
        workflowCardSA.ActivateWorkflow(EnabledState.Disabled);
        newStep.DeleteStep();
        workflowCardSA.UpdateWorkflow(seeError);
        workflowCardSA.Close(CloseState.DiscardChanges);

    });

});

describe("22_Workflows_WithoutSteps  ts QB", function () {
    let companyName = "test" + RandomGenerator.generate(6);
    let checkSettings = [FraudDetectionChangeAfterApprovalSetting.Contact, FraudDetectionChangeAfterApprovalSetting.Item];
    let defaultNameStep = "Approval step";
    let existingApprover2 = "Test Auto";

    beforeAll(function () {
        Common.Log('BeforeAll');
        Common.Spies.Set();

        Page.Navigate.TestApp();
        LoginForm.Login(Page.Config.testUser);
        let overView = new OverviewPage();
        overView.CloseNotificationBar();
        browser.sleep(1500);
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

    it("QB", function () {
        let seeError = true;
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_22_2BV0C4P');

        browser.sleep(1500);
        let overView = new OverviewPage();
        overView.HamburgerClick();
        overView.AddNewCompany(companyName);
        overView.HamburgerClick();
        overView.OpenWorkFlowTab(companyName);

        let qbWorkflows = new QbWorkflows();
        qbWorkflows.ConnectToQb();
        qbWorkflows.PurchaseOrderClick();

        let workflowCard = new XeroWorkflowCard();
        let workflowStep1 = new WorkflowStep(defaultNameStep);

        workflowStep1.DeleteStep();
        workflowCard.SaveWorkflow();
        workflowCard.ActivateWorkflow(EnabledState.Disabled,seeError);
        workflowCard.Close();
        qbWorkflows.PurchaseOrderClick();
        workflowCard.ActivateWorkflow(EnabledState.Disabled,seeError);
        let newStep = workflowCard.AddNewStep('11111');
        newStep.AddExistingApprover(existingApprover2,[existingApprover2]);
        workflowCard.ActivateWorkflow();
        newStep.DeleteStep();
        workflowCard.UpdateWorkflow(seeError);
        workflowCard.Close(CloseState.DiscardChanges);

    });



});
