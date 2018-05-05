import { Page } from "../../Pages/Page";
import { LoginForm } from "../../Pages/Forms/LogIn";
import { LogoMenu } from "../../Pages/Forms/LogoMenu";
import { MainPage } from "../../Pages/MainPage";
import { OverviewPage } from "../../Pages/OverviewPage";
import { CompanySetting } from "../../Pages/CompanySetting";
import {
    DropDownState, Validation, DisplayState, WorkFlowType, ConditionsType, XeroLoginMethod, ValueState,
    EnabledState
} from "../../Common/Enums";
import { Common } from "../../Common/Common";
import { RandomGenerator } from "../../Common/RandomGenerator";
import { WorkflowStep } from "../../Pages/Forms/WorkflowStep";
import { StandAloneWorkflowCard, XeroWorkflowCard } from "../../Pages/Forms/WorkflowCard";
import { StandaloneWorkflows } from "../../Pages/Forms/StandaloneWorkflows";
import { XeroWorkflows } from "../../Pages/Forms/XeroWorkflows";
import { StandAloneMatrix } from "../../Pages/Matrix/StandAloneMatrix";
import { MatrixPopup } from "../../Pages/Matrix/MatrixPopup";

import { MatrixLine } from "../../Pages/Matrix/MatrixLine";
import { MatrixLinesContainer } from "../../Pages/Matrix/MatrixLinesContainer";
import { QbWorkflows} from "../../Pages/Forms/QbWorkflows";



describe("16_Workflows_SavingDataInMatrix . ts", function () {

    let companyName = "test" + RandomGenerator.generate(6);
    let defaultNameStep = Page.Config.defaultStepName;
    let existingApprover2 = "Test Auto";

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

    it("Saving the data. Xero Bill", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_16_2xaI1gI ');



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
        workflowStep1.AddExistingApprover(existingApprover2, [existingApprover2]);
        workflowStep1.ApproverMatrixClick();
        let matrix = new MatrixPopup();

        let matrixLine = MatrixLinesContainer.GetFirstLineByName(existingApprover2);

        let conditionCell = matrixLine.GetAmountConditionCell();
        conditionCell.SelectConditionType(ConditionsType.Under);
        conditionCell.SetValue1('33', ConditionsType.Under);
        conditionCell.CheckPreview('Under 33.00 RUB');

        browser.refresh();
        browser.sleep(2000);
        browser.switchTo().alert().accept();
        workflowCard = new XeroWorkflowCard();

        workflowStep1.AddExistingApprover(existingApprover2, [existingApprover2]);
        workflowStep1.ApproverMatrixClick();
        conditionCell.CheckPreview('Any amount');
        matrix.Close();
        workflowCard.ActivateWorkflow(EnabledState.Enabled);
        workflowStep1.ApproverMatrixClick();
        conditionCell.CheckPreview('Any amount');
        conditionCell.SelectConditionType(ConditionsType.Under);
        conditionCell.SetValue1('233', ConditionsType.Under);
        conditionCell.CheckPreview('Under 233.00 RUB');
        matrix.Done();

        browser.refresh();
        browser.sleep(1000);
        browser.switchTo().alert().accept();
        workflowCard = new XeroWorkflowCard();
        workflowStep1.ApproverMatrixClick();
        conditionCell.CheckPreview('Any amount');
        conditionCell.SelectConditionType(ConditionsType.Under);
        conditionCell.SetValue1('505', ConditionsType.Under);
        conditionCell.CheckPreview('Under 505.00 RUB');
        matrix.Done();

        workflowCard.UpdateWorkflow();
        browser.sleep(1000);
        browser.refresh();
        workflowCard = new XeroWorkflowCard();
        workflowStep1.ApproverMatrixClick();
        conditionCell.CheckPreview('Under 505.00 RUB');
        matrix.Close();
        workflowCard.Close();



    });

    it("Saving the data. Xero PO", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_16_2xaI1gI ');

        browser.sleep(1500);
        let xeroWorkflows = new XeroWorkflows();
        xeroWorkflows.PayableWorkflows.PurchaseOrderClick();

        let workflowCard = new XeroWorkflowCard();
        let workflowStep1 = new WorkflowStep(defaultNameStep);
        workflowStep1.AddExistingApprover(existingApprover2, [existingApprover2]);
        workflowStep1.ApproverMatrixClick();
        let matrix = new MatrixPopup();

        let matrixLine = MatrixLinesContainer.GetFirstLineByName(existingApprover2);

        let conditionCell = matrixLine.GetAmountConditionCell();
        conditionCell.SelectConditionType(ConditionsType.Under);
        conditionCell.SetValue1('33', ConditionsType.Under);
        conditionCell.CheckPreview('Under 33.00 RUB');

        browser.refresh();
        browser.sleep(2000);
        browser.switchTo().alert().accept();
        workflowCard = new XeroWorkflowCard();

        workflowStep1.AddExistingApprover(existingApprover2, [existingApprover2]);
        workflowStep1.ApproverMatrixClick();
        conditionCell.CheckPreview('Any amount');
        matrix.Close();
        workflowCard.ActivateWorkflow();
        workflowStep1.ApproverMatrixClick();
        conditionCell.CheckPreview('Any amount');
        conditionCell.SelectConditionType(ConditionsType.Under);
        conditionCell.SetValue1('233', ConditionsType.Under);
        conditionCell.CheckPreview('Under 233.00 RUB');
        matrix.Done();

        browser.refresh();
        browser.sleep(1000);
        browser.switchTo().alert().accept();
        workflowCard = new XeroWorkflowCard();
        workflowStep1.ApproverMatrixClick();
        conditionCell.CheckPreview('Any amount');
        conditionCell.SelectConditionType(ConditionsType.Under);
        conditionCell.SetValue1('505', ConditionsType.Under);
        conditionCell.CheckPreview('Under 505.00 RUB');
        matrix.Done();

        workflowCard.UpdateWorkflow();
        browser.sleep(1000);
        browser.refresh();
        workflowCard = new XeroWorkflowCard();
        workflowStep1.ApproverMatrixClick();
        conditionCell.CheckPreview('Under 505.00 RUB');
        matrix.Close();
        workflowCard.Close();
    });

    it("Saving the data. ApCreditNote", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_16_2xaI1gI ');

        let xeroWorkflows = new XeroWorkflows();
        xeroWorkflows.PayableWorkflows.ApCreditNoteClick();
        let workflowCard = new XeroWorkflowCard();
        let workflowStep1 = new WorkflowStep(defaultNameStep);
        workflowStep1.AddExistingApprover(existingApprover2, [existingApprover2]);
        workflowStep1.ApproverMatrixClick();
        let matrix = new MatrixPopup();

        let matrixLine = MatrixLinesContainer.GetFirstLineByName(existingApprover2);

        let conditionCell = matrixLine.GetAmountConditionCell();
        conditionCell.SelectConditionType(ConditionsType.Under);
        conditionCell.SetValue1('33', ConditionsType.Under);
        conditionCell.CheckPreview('Under 33.00 RUB');

        browser.refresh();
        browser.sleep(2000);
        browser.switchTo().alert().accept();
        workflowCard = new XeroWorkflowCard();

        workflowStep1.AddExistingApprover(existingApprover2, [existingApprover2]);
        workflowStep1.ApproverMatrixClick();
        conditionCell.CheckPreview('Any amount');
        matrix.Close();
        workflowCard.ActivateWorkflow();
        workflowStep1.ApproverMatrixClick();
        conditionCell.CheckPreview('Any amount');
        conditionCell.SelectConditionType(ConditionsType.Under);
        conditionCell.SetValue1('233', ConditionsType.Under);
        conditionCell.CheckPreview('Under 233.00 RUB');
        matrix.Done();

        browser.refresh();
        browser.sleep(1000);
        browser.switchTo().alert().accept();
        workflowCard = new XeroWorkflowCard();
        workflowStep1.ApproverMatrixClick();
        conditionCell.CheckPreview('Any amount');
        conditionCell.SelectConditionType(ConditionsType.Under);
        conditionCell.SetValue1('505', ConditionsType.Under);
        conditionCell.CheckPreview('Under 505.00 RUB');
        matrix.Done();

        workflowCard.UpdateWorkflow();
        browser.sleep(1000);
        browser.refresh();
        workflowCard = new XeroWorkflowCard();
        workflowStep1.ApproverMatrixClick();
        conditionCell.CheckPreview('Under 505.00 RUB');
        matrix.Close();
        workflowCard.Close();
    });

    it("Saving the data. ARCreditNote", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_16_2xaI1gI ');

        let xeroWorkflows = new XeroWorkflows();
        xeroWorkflows.ReceivableWorkflows.ARCreditNoteClick();
        let workflowCard = new XeroWorkflowCard();
        let workflowStep1 = new WorkflowStep(defaultNameStep);
        workflowStep1.AddExistingApprover(existingApprover2, [existingApprover2]);
        workflowStep1.ApproverMatrixClick();
        let matrix = new MatrixPopup();

        let matrixLine = MatrixLinesContainer.GetFirstLineByName(existingApprover2);

        let conditionCell = matrixLine.GetAmountConditionCell();
        conditionCell.SelectConditionType(ConditionsType.Under);
        conditionCell.SetValue1('33', ConditionsType.Under);
        conditionCell.CheckPreview('Under 33.00 RUB');

        browser.refresh();
        browser.sleep(2000);
        browser.switchTo().alert().accept();
        workflowCard = new XeroWorkflowCard();

        workflowStep1.AddExistingApprover(existingApprover2, [existingApprover2]);
        workflowStep1.ApproverMatrixClick();
        conditionCell.CheckPreview('Any amount');
        matrix.Close();
        workflowCard.ActivateWorkflow();
        workflowStep1.ApproverMatrixClick();
        conditionCell.CheckPreview('Any amount');
        conditionCell.SelectConditionType(ConditionsType.Under);
        conditionCell.SetValue1('233', ConditionsType.Under);
        conditionCell.CheckPreview('Under 233.00 RUB');
        matrix.Done();

        browser.refresh();
        browser.sleep(1000);
        browser.switchTo().alert().accept();
        workflowCard = new XeroWorkflowCard();
        workflowStep1.ApproverMatrixClick();
        conditionCell.CheckPreview('Any amount');
        conditionCell.SelectConditionType(ConditionsType.Under);
        conditionCell.SetValue1('505', ConditionsType.Under);
        conditionCell.CheckPreview('Under 505.00 RUB');
        matrix.Done();

        workflowCard.UpdateWorkflow();
        browser.sleep(1000);
        browser.refresh();
        workflowCard = new XeroWorkflowCard();
        workflowStep1.ApproverMatrixClick();
        conditionCell.CheckPreview('Under 505.00 RUB');
        matrix.Close();
        workflowCard.Close();
    });

    it("Saving the data. SalesInvoice", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_16_2xaI1gI ');

        let xeroWorkflows = new XeroWorkflows();
        xeroWorkflows.ReceivableWorkflows.SalesInvoiceClick();
        let workflowCard = new XeroWorkflowCard();
        let workflowStep1 = new WorkflowStep(defaultNameStep);
        workflowStep1.AddExistingApprover(existingApprover2, [existingApprover2]);
        workflowStep1.ApproverMatrixClick();
        let matrix = new MatrixPopup();

        let matrixLine = MatrixLinesContainer.GetFirstLineByName(existingApprover2);

        let conditionCell = matrixLine.GetAmountConditionCell();
        conditionCell.SelectConditionType(ConditionsType.Under);
        conditionCell.SetValue1('33', ConditionsType.Under);
        conditionCell.CheckPreview('Under 33.00 RUB');

        browser.refresh();
        browser.sleep(2000);
        browser.switchTo().alert().accept();
        workflowCard = new XeroWorkflowCard();

        workflowStep1.AddExistingApprover(existingApprover2, [existingApprover2]);
        workflowStep1.ApproverMatrixClick();
        conditionCell.CheckPreview('Any amount');
        matrix.Close();
        workflowCard.ActivateWorkflow();
        workflowStep1.ApproverMatrixClick();
        conditionCell.CheckPreview('Any amount');
        conditionCell.SelectConditionType(ConditionsType.Under);
        conditionCell.SetValue1('233', ConditionsType.Under);
        conditionCell.CheckPreview('Under 233.00 RUB');
        matrix.Done();

        browser.refresh();
        browser.sleep(1000);
        browser.switchTo().alert().accept();
        workflowCard = new XeroWorkflowCard();
        workflowStep1.ApproverMatrixClick();
        conditionCell.CheckPreview('Any amount');
        conditionCell.SelectConditionType(ConditionsType.Under);
        conditionCell.SetValue1('505', ConditionsType.Under);
        conditionCell.CheckPreview('Under 505.00 RUB');
        matrix.Done();

        workflowCard.UpdateWorkflow();
        browser.sleep(1000);
        browser.refresh();
        workflowCard = new XeroWorkflowCard();
        workflowStep1.ApproverMatrixClick();
        conditionCell.CheckPreview('Under 505.00 RUB');
        matrix.Close();
        workflowCard.Close();
    });

    it("Saving the data. Standalone", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_16_2xaI1gI ');

        let standaloneWorkflows = new StandaloneWorkflows();
        standaloneWorkflows.CreateFirstClick();
        let workflowCard = new StandAloneWorkflowCard();
        workflowCard.SetName('123123');
        workflowCard.SaveWorkflow();
        let workflowStep1 = new WorkflowStep(defaultNameStep);
        workflowStep1.AddExistingApprover(existingApprover2, [existingApprover2]);
        workflowStep1.ApproverMatrixClick();
        let matrix = new MatrixPopup();

        let matrixLine = MatrixLinesContainer.GetFirstLineByName(existingApprover2);

        let conditionCell = matrixLine.GetAmountConditionCell();
        conditionCell.SelectConditionType(ConditionsType.Under);
        conditionCell.SetValue1('33', ConditionsType.Under);
        conditionCell.CheckPreview('Under 33.00 RUB');

        browser.refresh();
        browser.sleep(2000);
        browser.switchTo().alert().accept();
        workflowCard = new StandAloneWorkflowCard();

        workflowStep1.AddExistingApprover(existingApprover2, [existingApprover2]);
        workflowStep1.ApproverMatrixClick();
        conditionCell.CheckPreview('Any amount');
        matrix.Close();
        workflowCard.ActivateWorkflow(EnabledState.Disabled);
        workflowStep1.ApproverMatrixClick();
        conditionCell.CheckPreview('Any amount');
        conditionCell.SelectConditionType(ConditionsType.Under);
        conditionCell.SetValue1('233', ConditionsType.Under);
        conditionCell.CheckPreview('Under 233.00 RUB');
        matrix.Done();

        browser.refresh();
        browser.sleep(1000);
        browser.switchTo().alert().accept();
        workflowCard = new StandAloneWorkflowCard();
        workflowStep1.ApproverMatrixClick();
        conditionCell.CheckPreview('Any amount');
        conditionCell.SelectConditionType(ConditionsType.Under);
        conditionCell.SetValue1('505', ConditionsType.Under);
        conditionCell.CheckPreview('Under 505.00 RUB');
        matrix.Done();

        workflowCard.UpdateWorkflow();
        browser.sleep(1000);
        browser.refresh();
        workflowCard = new StandAloneWorkflowCard();
        workflowStep1.ApproverMatrixClick();
        conditionCell.CheckPreview('Under 505.00 RUB');
        matrix.Close();
        workflowCard.Close();
    });


});

describe("16_Workflows_SavingDataInMatrix QB", function () {

    let companyName = "test" + RandomGenerator.generate(6);
    let defaultNameStep = Page.Config.defaultStepName;
    let existingApprover2 = "Test Auto";

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

    it("Saving the data. QB PO", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_16_2xaI1gI ');



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
        workflowStep1.AddExistingApprover(existingApprover2, [existingApprover2]);
        workflowStep1.ApproverMatrixClick();
        let matrix = new MatrixPopup();

        let matrixLine = MatrixLinesContainer.GetFirstLineByName(existingApprover2);

        let conditionCell = matrixLine.GetAmountConditionCell();
        conditionCell.SelectConditionType(ConditionsType.Under);
        conditionCell.SetValue1('33', ConditionsType.Under);
        conditionCell.CheckPreview('Under 33.00 ANG');

        browser.refresh();
        browser.sleep(2000);
        browser.switchTo().alert().accept();
        workflowCard = new XeroWorkflowCard();

        workflowStep1.AddExistingApprover(existingApprover2, [existingApprover2]);
        workflowStep1.ApproverMatrixClick();
        conditionCell.CheckPreview('Any amount');
        matrix.Close();

        //пока не работает
        // https://approvalmax.myjetbrains.com/youtrack/issue/AM-1777

        workflowCard.ActivateWorkflow();
        workflowStep1.ApproverMatrixClick();
        conditionCell.CheckPreview('Any amount');
        conditionCell.SelectConditionType(ConditionsType.Under);
        conditionCell.SetValue1('233', ConditionsType.Under);
        conditionCell.CheckPreview('Under 233.00 ANG');
        matrix.Done();

        browser.refresh();
        browser.sleep(1000);
        browser.switchTo().alert().accept();
        workflowCard = new XeroWorkflowCard();
        workflowStep1.ApproverMatrixClick();
        conditionCell.CheckPreview('Any amount');
        conditionCell.SelectConditionType(ConditionsType.Under);
        conditionCell.SetValue1('505', ConditionsType.Under);
        conditionCell.CheckPreview('Under 505.00 ANG');
        matrix.Done();

        workflowCard.UpdateWorkflow();
        browser.sleep(1000);
        browser.refresh();
        workflowCard = new XeroWorkflowCard();
        workflowStep1.ApproverMatrixClick();
        conditionCell.CheckPreview('Under 505.00 ANG');
        matrix.Close();
        workflowCard.Close();



    });

});

