import { Page } from "../../Pages/Page";
import { LoginForm } from "../../Pages/Forms/LogIn";
import { LogoMenu } from "../../Pages/Forms/LogoMenu";
import { MainPage } from "../../Pages/MainPage";
import { OverviewPage } from "../../Pages/OverviewPage";
import { XeroWorkflows } from "../../Pages/Forms/XeroWorkflows";
import { CompanySetting } from "../../Pages/CompanySetting";
import { DropDownState, Validation, DisplayState, WorkFlowType, CloseState, ConditionsType, XeroLoginMethod } from "../../Common/Enums";
import { Common } from "../../Common/Common";
import { RandomGenerator } from "../../Common/RandomGenerator";
import { WorkflowStep } from "../../Pages/Forms/WorkflowStep";
import { XeroWorkflowCard } from "../../Pages/Forms/WorkflowCard";
import { MatrixPopup } from "../../Pages/Matrix/MatrixPopup";
import { MatrixLinesContainer } from "../../Pages/Matrix/MatrixLinesContainer";
import { XeroSyncPopup } from "../../Pages/Popup/XeroSyncPopup";
import { QbWorkflows } from "../../Pages/Forms/QbWorkflows";


describe("13_Workflows_AlternativeRules . ts", function () {

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

    it("Xero Bill", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_13_2xjJsfM ');


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

        // workflowCard.AddXeroRequester(existingApprover2); // обход бага
        workflowStep1.AddExistingApprover(existingApprover2, [existingApprover2]);
        workflowStep1.ApproverMatrixClick();
        let matrix = new MatrixPopup();

        let approverLinesContainer = MatrixLinesContainer.ByName(existingApprover2);
        let approverLine = approverLinesContainer.GetFirstLine();
        approverLine.AddAlternativeRule();
        let alternativeRuleLine1 = approverLinesContainer.GetAlternativeRuleLine("1");
        matrix.Done();
        workflowStep1.ApproverMatrixClick();

        approverLine.AddAlternativeRule();
        alternativeRuleLine1 = approverLinesContainer.GetAlternativeRuleLine("1");

        let totalAmountAlternativeRule = alternativeRuleLine1.GetAmountConditionCell();
        totalAmountAlternativeRule.SelectConditionType(ConditionsType.Under);
        totalAmountAlternativeRule.SetValue1('111',ConditionsType.Under);
        totalAmountAlternativeRule.CheckPreview('Under 111.00 RUB');

        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        let totalAmount = approverLine.GetAmountConditionCell();
        totalAmount.CheckPreview('Under 111.00 RUB');

        approverLine.AddAlternativeRule();
        alternativeRuleLine1 = approverLinesContainer.GetAlternativeRuleLine("1");
        totalAmount.CheckPreview('Under 111.00 RUB');
        totalAmountAlternativeRule.SelectConditionType(ConditionsType.Under);
        totalAmountAlternativeRule.SetValue1('999',ConditionsType.Under);
        totalAmountAlternativeRule.CheckPreview('Under 999.00 RUB');

        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Under 111.00 RUB');
        totalAmountAlternativeRule.CheckPreview('Under 999.00 RUB');

        approverLine.AddAlternativeRule();
        totalAmount.CheckPreview('Under 111.00 RUB');
        totalAmountAlternativeRule.CheckPreview('Under 999.00 RUB');

        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        approverLine.AddAlternativeRule();
        let alternativeRuleLine2 = approverLinesContainer.GetAlternativeRuleLine("2");
        let totalAmountAlternativeRule2 = alternativeRuleLine2.GetAmountConditionCell();
        totalAmountAlternativeRule2.SelectConditionType(ConditionsType.Within);
        totalAmountAlternativeRule2.SetValue1('100',null,Validation.Any,protractor.Key.TAB);
        totalAmountAlternativeRule2.SetValue2('800',ConditionsType.Within);
        totalAmountAlternativeRule2.CheckPreview('Within 100.00 RUB-800.00 RUB');
        alternativeRuleLine2.Remove();

        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Under 111.00 RUB');
        totalAmountAlternativeRule.CheckPreview('Under 999.00 RUB');

        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Under 111.00 RUB');
        totalAmountAlternativeRule.CheckPreview('Under 999.00 RUB');
        let mailNewUser = 't@t.com';
        matrix.AddNewUser(mailNewUser);

        let newApproverLinesContainer = MatrixLinesContainer.ById(mailNewUser);
        let newApproverLine = newApproverLinesContainer.GetFirstLine();

        let totalAmountNewApprover = newApproverLine.GetAmountConditionCell();

        newApproverLine.AddAlternativeRule();
        let newApproveralternativeRule = newApproverLinesContainer.GetAlternativeRuleLine("1");
        let newApproverTotalAmountAlternativeRule = newApproveralternativeRule.GetAmountConditionCell();
        newApproverTotalAmountAlternativeRule.SelectConditionType(ConditionsType.OverOrEqualTo);
        newApproverTotalAmountAlternativeRule.SetValue1('123',ConditionsType.OverOrEqualTo);
        newApproverTotalAmountAlternativeRule.CheckPreview('Over or equal to 123.00 RUB');

        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Under 111.00 RUB');
        totalAmountAlternativeRule.CheckPreview('Under 999.00 RUB');
        totalAmountNewApprover.CheckPreview('Over or equal to 123.00 RUB');
        matrix.Done();
        workflowCard.Close(CloseState.DiscardChanges);

    });

    it("Xero PO", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_16_2xaI1gI ');

        browser.sleep(1500);
        let xeroWorkflows = new XeroWorkflows();
        xeroWorkflows.PayableWorkflows.PurchaseOrderClick();

        let workflowCard = new XeroWorkflowCard();
        let workflowStep1 = new WorkflowStep(defaultNameStep);
        workflowStep1.AddExistingApprover(existingApprover2, [existingApprover2]);
        workflowStep1.ApproverMatrixClick();
        let matrix = new MatrixPopup();

        let approverLinesContainer = MatrixLinesContainer.ByName(existingApprover2);
        let approverLine = approverLinesContainer.GetFirstLine();
        approverLine.AddAlternativeRule();
        let alternativeRuleLine1 = approverLinesContainer.GetAlternativeRuleLine("1");
        matrix.Done();
        workflowStep1.ApproverMatrixClick();

        approverLine.AddAlternativeRule();
        alternativeRuleLine1 = approverLinesContainer.GetAlternativeRuleLine("1");

        let totalAmountAlternativeRule = alternativeRuleLine1.GetAmountConditionCell();
        totalAmountAlternativeRule.SelectConditionType(ConditionsType.Under);
        totalAmountAlternativeRule.SetValue1('111',ConditionsType.Under);
        totalAmountAlternativeRule.CheckPreview('Under 111.00 RUB');

        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        let totalAmount = approverLine.GetAmountConditionCell();
        totalAmount.CheckPreview('Under 111.00 RUB');

        approverLine.AddAlternativeRule();
        alternativeRuleLine1 = approverLinesContainer.GetAlternativeRuleLine("1");
        totalAmount.CheckPreview('Under 111.00 RUB');
        totalAmountAlternativeRule.SelectConditionType(ConditionsType.Under);
        totalAmountAlternativeRule.SetValue1('999',ConditionsType.Under);
        totalAmountAlternativeRule.CheckPreview('Under 999.00 RUB');

        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Under 111.00 RUB');
        totalAmountAlternativeRule.CheckPreview('Under 999.00 RUB');

        approverLine.AddAlternativeRule();
        totalAmount.CheckPreview('Under 111.00 RUB');
        totalAmountAlternativeRule.CheckPreview('Under 999.00 RUB');

        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        approverLine.AddAlternativeRule();
        let alternativeRuleLine2 = approverLinesContainer.GetAlternativeRuleLine("2");
        let totalAmountAlternativeRule2 = alternativeRuleLine2.GetAmountConditionCell();
        totalAmountAlternativeRule2.SelectConditionType(ConditionsType.Within);
        totalAmountAlternativeRule2.SetValue1('100',null,Validation.Any,protractor.Key.TAB);
        totalAmountAlternativeRule2.SetValue2('800',ConditionsType.Within);
        totalAmountAlternativeRule2.CheckPreview('Within 100.00 RUB-800.00 RUB');
        alternativeRuleLine2.Remove();

        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Under 111.00 RUB');
        totalAmountAlternativeRule.CheckPreview('Under 999.00 RUB');

        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Under 111.00 RUB');
        totalAmountAlternativeRule.CheckPreview('Under 999.00 RUB');
        let mailNewUser = 't@t.com';
        matrix.AddNewUser(mailNewUser);

        let newApproverLinesContainer = MatrixLinesContainer.ById(mailNewUser);
        let newApproverLine = newApproverLinesContainer.GetFirstLine();

        let totalAmountNewApprover = newApproverLine.GetAmountConditionCell();

        newApproverLine.AddAlternativeRule();
        let newApproveralternativeRule = newApproverLinesContainer.GetAlternativeRuleLine("1");
        let newApproverTotalAmountAlternativeRule = newApproveralternativeRule.GetAmountConditionCell();
        newApproverTotalAmountAlternativeRule.SelectConditionType(ConditionsType.OverOrEqualTo);
        newApproverTotalAmountAlternativeRule.SetValue1('123',ConditionsType.OverOrEqualTo);
        newApproverTotalAmountAlternativeRule.CheckPreview('Over or equal to 123.00 RUB');

        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Under 111.00 RUB');
        totalAmountAlternativeRule.CheckPreview('Under 999.00 RUB');
        totalAmountNewApprover.CheckPreview('Over or equal to 123.00 RUB');
        matrix.Done();

        workflowCard.Close(CloseState.DiscardChanges);
    });

    it("Xero AP", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_16_2xaI1gI ');

        browser.sleep(1500);
        let xeroWorkflows = new XeroWorkflows();
        xeroWorkflows.PayableWorkflows.ApCreditNoteClick();

        let workflowCard = new XeroWorkflowCard();
        let workflowStep1 = new WorkflowStep(defaultNameStep);
        workflowStep1.AddExistingApprover(existingApprover2, [existingApprover2]);
        workflowStep1.ApproverMatrixClick();
        let matrix = new MatrixPopup();

        let approverLinesContainer = MatrixLinesContainer.ByName(existingApprover2);
        let approverLine = approverLinesContainer.GetFirstLine();
        approverLine.AddAlternativeRule();
        let alternativeRuleLine1 = approverLinesContainer.GetAlternativeRuleLine("1");
        matrix.Done();
        workflowStep1.ApproverMatrixClick();

        approverLine.AddAlternativeRule();
        alternativeRuleLine1 = approverLinesContainer.GetAlternativeRuleLine("1");

        let totalAmountAlternativeRule = alternativeRuleLine1.GetAmountConditionCell();
        totalAmountAlternativeRule.SelectConditionType(ConditionsType.Under);
        totalAmountAlternativeRule.SetValue1('111',ConditionsType.Under);
        totalAmountAlternativeRule.CheckPreview('Under 111.00 RUB');

        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        let totalAmount = approverLine.GetAmountConditionCell();
        totalAmount.CheckPreview('Under 111.00 RUB');

        approverLine.AddAlternativeRule();
        alternativeRuleLine1 = approverLinesContainer.GetAlternativeRuleLine("1");
        totalAmount.CheckPreview('Under 111.00 RUB');
        totalAmountAlternativeRule.SelectConditionType(ConditionsType.Under);
        totalAmountAlternativeRule.SetValue1('999',ConditionsType.Under);
        totalAmountAlternativeRule.CheckPreview('Under 999.00 RUB');

        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Under 111.00 RUB');
        totalAmountAlternativeRule.CheckPreview('Under 999.00 RUB');

        approverLine.AddAlternativeRule();
        totalAmount.CheckPreview('Under 111.00 RUB');
        totalAmountAlternativeRule.CheckPreview('Under 999.00 RUB');

        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        approverLine.AddAlternativeRule();
        let alternativeRuleLine2 = approverLinesContainer.GetAlternativeRuleLine("2");
        let totalAmountAlternativeRule2 = alternativeRuleLine2.GetAmountConditionCell();
        totalAmountAlternativeRule2.SelectConditionType(ConditionsType.Within);
        totalAmountAlternativeRule2.SetValue1('100',null,Validation.Any,protractor.Key.TAB);
        totalAmountAlternativeRule2.SetValue2('800',ConditionsType.Within);
        totalAmountAlternativeRule2.CheckPreview('Within 100.00 RUB-800.00 RUB');
        alternativeRuleLine2.Remove();

        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Under 111.00 RUB');
        totalAmountAlternativeRule.CheckPreview('Under 999.00 RUB');

        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Under 111.00 RUB');
        totalAmountAlternativeRule.CheckPreview('Under 999.00 RUB');
        let mailNewUser = 't@t.com';
        matrix.AddNewUser(mailNewUser);

        let newApproverLinesContainer = MatrixLinesContainer.ById(mailNewUser);
        let newApproverLine = newApproverLinesContainer.GetFirstLine();

        let totalAmountNewApprover = newApproverLine.GetAmountConditionCell();

        newApproverLine.AddAlternativeRule();
        let newApproveralternativeRule = newApproverLinesContainer.GetAlternativeRuleLine("1");
        let newApproverTotalAmountAlternativeRule = newApproveralternativeRule.GetAmountConditionCell();
        newApproverTotalAmountAlternativeRule.SelectConditionType(ConditionsType.OverOrEqualTo);
        newApproverTotalAmountAlternativeRule.SetValue1('123',ConditionsType.OverOrEqualTo);
        newApproverTotalAmountAlternativeRule.CheckPreview('Over or equal to 123.00 RUB');

        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Under 111.00 RUB');
        totalAmountAlternativeRule.CheckPreview('Under 999.00 RUB');
        totalAmountNewApprover.CheckPreview('Over or equal to 123.00 RUB');
        matrix.Done();

        workflowCard.Close(CloseState.DiscardChanges);
    });

    it("Xero AR", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_16_2xaI1gI ');

        browser.sleep(1500);
        let xeroWorkflows = new XeroWorkflows();
        xeroWorkflows.ReceivableWorkflows.ARCreditNoteClick();

        let workflowCard = new XeroWorkflowCard();
        let workflowStep1 = new WorkflowStep(defaultNameStep);
        workflowStep1.AddExistingApprover(existingApprover2, [existingApprover2]);
        workflowStep1.ApproverMatrixClick();
        let matrix = new MatrixPopup();

        let approverLinesContainer = MatrixLinesContainer.ByName(existingApprover2);
        let approverLine = approverLinesContainer.GetFirstLine();
        approverLine.AddAlternativeRule();
        let alternativeRuleLine1 = approverLinesContainer.GetAlternativeRuleLine("1");
        matrix.Done();
        workflowStep1.ApproverMatrixClick();

        approverLine.AddAlternativeRule();
        alternativeRuleLine1 = approverLinesContainer.GetAlternativeRuleLine("1");

        let totalAmountAlternativeRule = alternativeRuleLine1.GetAmountConditionCell();
        totalAmountAlternativeRule.SelectConditionType(ConditionsType.Under);
        totalAmountAlternativeRule.SetValue1('111',ConditionsType.Under);
        totalAmountAlternativeRule.CheckPreview('Under 111.00 RUB');

        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        let totalAmount = approverLine.GetAmountConditionCell();
        totalAmount.CheckPreview('Under 111.00 RUB');

        approverLine.AddAlternativeRule();
        alternativeRuleLine1 = approverLinesContainer.GetAlternativeRuleLine("1");
        totalAmount.CheckPreview('Under 111.00 RUB');
        totalAmountAlternativeRule.SelectConditionType(ConditionsType.Under);
        totalAmountAlternativeRule.SetValue1('999',ConditionsType.Under);
        totalAmountAlternativeRule.CheckPreview('Under 999.00 RUB');

        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Under 111.00 RUB');
        totalAmountAlternativeRule.CheckPreview('Under 999.00 RUB');

        approverLine.AddAlternativeRule();
        totalAmount.CheckPreview('Under 111.00 RUB');
        totalAmountAlternativeRule.CheckPreview('Under 999.00 RUB');

        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        approverLine.AddAlternativeRule();
        let alternativeRuleLine2 = approverLinesContainer.GetAlternativeRuleLine("2");
        let totalAmountAlternativeRule2 = alternativeRuleLine2.GetAmountConditionCell();
        totalAmountAlternativeRule2.SelectConditionType(ConditionsType.Within);
        totalAmountAlternativeRule2.SetValue1('100',null,Validation.Any,protractor.Key.TAB);
        totalAmountAlternativeRule2.SetValue2('800',ConditionsType.Within);
        totalAmountAlternativeRule2.CheckPreview('Within 100.00 RUB-800.00 RUB');
        alternativeRuleLine2.Remove();

        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Under 111.00 RUB');
        totalAmountAlternativeRule.CheckPreview('Under 999.00 RUB');

        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Under 111.00 RUB');
        totalAmountAlternativeRule.CheckPreview('Under 999.00 RUB');
        let mailNewUser = 't@t.com';
        matrix.AddNewUser(mailNewUser);

        let newApproverLinesContainer = MatrixLinesContainer.ById(mailNewUser);
        let newApproverLine = newApproverLinesContainer.GetFirstLine();

        let totalAmountNewApprover = newApproverLine.GetAmountConditionCell();

        newApproverLine.AddAlternativeRule();
        let newApproveralternativeRule = newApproverLinesContainer.GetAlternativeRuleLine("1");
        let newApproverTotalAmountAlternativeRule = newApproveralternativeRule.GetAmountConditionCell();
        newApproverTotalAmountAlternativeRule.SelectConditionType(ConditionsType.OverOrEqualTo);
        newApproverTotalAmountAlternativeRule.SetValue1('123',ConditionsType.OverOrEqualTo);
        newApproverTotalAmountAlternativeRule.CheckPreview('Over or equal to 123.00 RUB');

        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Under 111.00 RUB');
        totalAmountAlternativeRule.CheckPreview('Under 999.00 RUB');
        totalAmountNewApprover.CheckPreview('Over or equal to 123.00 RUB');
        matrix.Done();

        workflowCard.Close(CloseState.DiscardChanges);
    });

    it("Xero Sales Invoic", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_16_2xaI1gI ');

        browser.sleep(1500);
        let xeroWorkflows = new XeroWorkflows();
        xeroWorkflows.ReceivableWorkflows.SalesInvoiceClick();

        let workflowCard = new XeroWorkflowCard();
        let workflowStep1 = new WorkflowStep(defaultNameStep);
        workflowStep1.AddExistingApprover(existingApprover2, [existingApprover2]);
        workflowStep1.ApproverMatrixClick();
        let matrix = new MatrixPopup();

        let approverLinesContainer = MatrixLinesContainer.ByName(existingApprover2);
        let approverLine = approverLinesContainer.GetFirstLine();
        approverLine.AddAlternativeRule();
        let alternativeRuleLine1 = approverLinesContainer.GetAlternativeRuleLine("1");
        matrix.Done();
        workflowStep1.ApproverMatrixClick();

        approverLine.AddAlternativeRule();
        alternativeRuleLine1 = approverLinesContainer.GetAlternativeRuleLine("1");

        let totalAmountAlternativeRule = alternativeRuleLine1.GetAmountConditionCell();
        totalAmountAlternativeRule.SelectConditionType(ConditionsType.Under);
        totalAmountAlternativeRule.SetValue1('111',ConditionsType.Under);
        totalAmountAlternativeRule.CheckPreview('Under 111.00 RUB');

        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        let totalAmount = approverLine.GetAmountConditionCell();
        totalAmount.CheckPreview('Under 111.00 RUB');

        approverLine.AddAlternativeRule();
        alternativeRuleLine1 = approverLinesContainer.GetAlternativeRuleLine("1");
        totalAmount.CheckPreview('Under 111.00 RUB');
        totalAmountAlternativeRule.SelectConditionType(ConditionsType.Under);
        totalAmountAlternativeRule.SetValue1('999',ConditionsType.Under);
        totalAmountAlternativeRule.CheckPreview('Under 999.00 RUB');

        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Under 111.00 RUB');
        totalAmountAlternativeRule.CheckPreview('Under 999.00 RUB');

        approverLine.AddAlternativeRule();
        totalAmount.CheckPreview('Under 111.00 RUB');
        totalAmountAlternativeRule.CheckPreview('Under 999.00 RUB');

        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        approverLine.AddAlternativeRule();
        let alternativeRuleLine2 = approverLinesContainer.GetAlternativeRuleLine("2");
        let totalAmountAlternativeRule2 = alternativeRuleLine2.GetAmountConditionCell();
        totalAmountAlternativeRule2.SelectConditionType(ConditionsType.Within);
        totalAmountAlternativeRule2.SetValue1('100',null,Validation.Any,protractor.Key.TAB);
        totalAmountAlternativeRule2.SetValue2('800',ConditionsType.Within);
        totalAmountAlternativeRule2.CheckPreview('Within 100.00 RUB-800.00 RUB');
        alternativeRuleLine2.Remove();

        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Under 111.00 RUB');
        totalAmountAlternativeRule.CheckPreview('Under 999.00 RUB');

        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Under 111.00 RUB');
        totalAmountAlternativeRule.CheckPreview('Under 999.00 RUB');
        let mailNewUser = 't@t.com';
        matrix.AddNewUser(mailNewUser);

        let newApproverLinesContainer = MatrixLinesContainer.ById(mailNewUser);
        let newApproverLine = newApproverLinesContainer.GetFirstLine();

        let totalAmountNewApprover = newApproverLine.GetAmountConditionCell();

        newApproverLine.AddAlternativeRule();
        let newApproveralternativeRule = newApproverLinesContainer.GetAlternativeRuleLine("1");
        let newApproverTotalAmountAlternativeRule = newApproveralternativeRule.GetAmountConditionCell();
        newApproverTotalAmountAlternativeRule.SelectConditionType(ConditionsType.OverOrEqualTo);
        newApproverTotalAmountAlternativeRule.SetValue1('123',ConditionsType.OverOrEqualTo);
        newApproverTotalAmountAlternativeRule.CheckPreview('Over or equal to 123.00 RUB');

        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Under 111.00 RUB');
        totalAmountAlternativeRule.CheckPreview('Under 999.00 RUB');
        totalAmountNewApprover.CheckPreview('Over or equal to 123.00 RUB');
        matrix.Done();

        workflowCard.Close(CloseState.DiscardChanges);
    });
});

describe("13_Workflows_AlternativeRules QB", function () {

    let companyName = "test" + RandomGenerator.generate(6);
    let defaultNameStep = Page.Config.defaultStepName;

    beforeEach(function () {
        Common.Log('BeforeEach');
        Common.Spies.Set();

        Page.Navigate.TestApp();
        LoginForm.Login(Page.Config.testUser);
        let overView = new OverviewPage();
        overView.CloseNotificationBar();
    });

    afterEach(function () {
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

    it("QB PO", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_13_2xjJsfM ');

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
        workflowStep1.AddExistingApprover(existingApprover2, [existingApprover2]);
        workflowStep1.ApproverMatrixClick();
        let matrix = new MatrixPopup();

        let approverLinesContainer = MatrixLinesContainer.ByName(existingApprover2);
        let approverLine = approverLinesContainer.GetFirstLine();
        approverLine.AddAlternativeRule();
        let alternativeRuleLine1 = approverLinesContainer.GetAlternativeRuleLine("1");
        matrix.Done();
        workflowStep1.ApproverMatrixClick();

        approverLine.AddAlternativeRule();
        alternativeRuleLine1 = approverLinesContainer.GetAlternativeRuleLine("1");

        let totalAmountAlternativeRule = alternativeRuleLine1.GetAmountConditionCell();
        totalAmountAlternativeRule.SelectConditionType(ConditionsType.Under);
        totalAmountAlternativeRule.SetValue1('111',ConditionsType.Under);
        totalAmountAlternativeRule.CheckPreview('Under 111.00 ANG');

        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        let totalAmount = approverLine.GetAmountConditionCell();
        totalAmount.CheckPreview('Under 111.00 ANG');

        approverLine.AddAlternativeRule();
        alternativeRuleLine1 = approverLinesContainer.GetAlternativeRuleLine("1");
        totalAmount.CheckPreview('Under 111.00 ANG');
        totalAmountAlternativeRule.SelectConditionType(ConditionsType.Under);
        totalAmountAlternativeRule.SetValue1('999',ConditionsType.Under);
        totalAmountAlternativeRule.CheckPreview('Under 999.00 ANG');

        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Under 111.00 ANG');
        totalAmountAlternativeRule.CheckPreview('Under 999.00 ANG');

        approverLine.AddAlternativeRule();
        totalAmount.CheckPreview('Under 111.00 ANG');
        totalAmountAlternativeRule.CheckPreview('Under 999.00 ANG');

        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        approverLine.AddAlternativeRule();
        let alternativeRuleLine2 = approverLinesContainer.GetAlternativeRuleLine("2");
        let totalAmountAlternativeRule2 = alternativeRuleLine2.GetAmountConditionCell();
        totalAmountAlternativeRule2.SelectConditionType(ConditionsType.Within);
        totalAmountAlternativeRule2.SetValue1('100',null,Validation.Any,protractor.Key.TAB);
        totalAmountAlternativeRule2.SetValue2('800',ConditionsType.Within);
        totalAmountAlternativeRule2.CheckPreview('Within 100.00 ANG-800.00 ANG');
        alternativeRuleLine2.Remove();

        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Under 111.00 ANG');
        totalAmountAlternativeRule.CheckPreview('Under 999.00 ANG');

        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Under 111.00 ANG');
        totalAmountAlternativeRule.CheckPreview('Under 999.00 ANG');
        let mailNewUser = 't@t.com';
        matrix.AddNewUser(mailNewUser);

        let newApproverLinesContainer = MatrixLinesContainer.ById(mailNewUser);
        let newApproverLine = newApproverLinesContainer.GetFirstLine();

        let totalAmountNewApprover = newApproverLine.GetAmountConditionCell();

        newApproverLine.AddAlternativeRule();
        let newApproveralternativeRule = newApproverLinesContainer.GetAlternativeRuleLine("1");
        let newApproverTotalAmountAlternativeRule = newApproveralternativeRule.GetAmountConditionCell();
        newApproverTotalAmountAlternativeRule.SelectConditionType(ConditionsType.OverOrEqualTo);
        newApproverTotalAmountAlternativeRule.SetValue1('123',ConditionsType.OverOrEqualTo);
        newApproverTotalAmountAlternativeRule.CheckPreview('Over or equal to 123.00 ANG');

        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Under 111.00 ANG');
        totalAmountAlternativeRule.CheckPreview('Under 999.00 ANG');
        totalAmountNewApprover.CheckPreview('Over or equal to 123.00 ANG');

    });
});
