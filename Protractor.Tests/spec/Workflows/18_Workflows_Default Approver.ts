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
import { QbWorkflows } from "../../Pages/Forms/QbWorkflows";
import { MatrixLine } from "../../Pages/Matrix/MatrixLine";
import { MatrixPopup } from "../../Pages/Matrix/MatrixPopup";
import { DurationEditor } from "../../Pages/Popup/DurationEditor";
import { XeroSyncPopup } from "../../Pages/Popup/XeroSyncPopup";
import { XeroWorkflowCard } from "../../Pages/Forms/WorkflowCard";
import { MatrixLinesContainer } from "../../Pages/Matrix/MatrixLinesContainer";
import { StandAloneWorkflowCard } from "../../Pages/Forms/WorkflowCard";
import { StandaloneWorkflows } from "../../Pages/Forms/StandaloneWorkflows";


describe("18_Workflows_Default Approver . ts", function () {

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

    it("Default Approver in Bill Xero Approval Matrix", function () {

        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_18_2elmxF7');

        let defaultNameStep = Page.Config.defaultStepName;
        let administratorUser = "Test Auto";
        let newUSerMail = 'xxxx@1111.ccc';

        browser.sleep(1500);
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
        workflowStep1.AddExistingApprover(administratorUser, [administratorUser]);

        workflowStep1.ApproverMatrixClick();
        let matrix = new MatrixPopup();
        let approver1LinesContainer = MatrixLinesContainer.ByName(administratorUser);
        let approver1Line = approver1LinesContainer.GetFirstLine();

        let conditionCell1 = approver1Line.GetAmountConditionCell();
        conditionCell1.SelectConditionType(ConditionsType.Within);
        conditionCell1.SetValue1('0', ConditionsType.Within, null, protractor.Key.TAB);
        conditionCell1.SetValue2('111', ConditionsType.Within);
        matrix.Done();
        workflowStep1.CheckDefaultAprroverForm(DisplayState.Shown);
        workflowStep1.ApproverMatrixClick();
        matrix.AddNewUser(newUSerMail );
        matrix.Done();
        workflowStep1.CheckDefaultAprroverForm(DisplayState.Hide);
        workflowStep1.ApproverMatrixClick();

        let newUSerName = 'xxxx';
        let approver2LinesContainer = MatrixLinesContainer.ByName(newUSerMail );
        let approver2Line = approver2LinesContainer.GetFirstLine();

        let conditionCell2 = approver2Line.GetAmountConditionCell();
        conditionCell2.SelectConditionType(ConditionsType.OverOrEqualTo);
        conditionCell2.SetValue1('100', ConditionsType.OverOrEqualTo, null, protractor.Key.TAB);
        matrix.Done();
        workflowStep1.CheckDefaultAprroverForm(DisplayState.Shown);

        workflowStep1.ApproverMatrixClick();
        conditionCell2.SelectConditionType(ConditionsType.Any);
        matrix.Done();
        workflowStep1.CheckDefaultAprroverForm(DisplayState.Hide);

        workflowStep1.ApproverMatrixClick();
        matrix.RemoveUserByName(newUSerMail);
        matrix.Done();
        workflowStep1.CheckDefaultAprroverForm(DisplayState.Shown);

        workflowStep1.AddNewDefaultApprover(newUSerMail);
        workflowStep1.DeleteApprover(administratorUser);
        workflowStep1.CheckDefaultAprroverForm(DisplayState.Hide);




    });

    it("Default Approver in Xero Ap Credit Note", function () {

        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_18_2elmxF7');

        let defaultNameStep = Page.Config.defaultStepName;
        let administratorUser = "Test Auto";
        let newUSerMail = 'xxxx@1111.ccc';

        browser.sleep(1500);
        let overView = new OverviewPage();
        overView.HamburgerClick();

        overView.AddNewCompany(companyName);
        overView.HamburgerClick();
        overView.OpenWorkFlowTab(companyName);
        let xeroWorkflows = new XeroWorkflows();
        xeroWorkflows.ConnectToXero(XeroLoginMethod.WithoutForm);
        xeroWorkflows.PayableWorkflows.ApCreditNoteClick();

        let workflowCard = new XeroWorkflowCard();

        let workflowStep1 = new WorkflowStep(defaultNameStep);
        workflowStep1.AddExistingApprover(administratorUser, [administratorUser]);

        workflowStep1.ApproverMatrixClick();
        let matrix = new MatrixPopup();

        let approver1LinesContainer = MatrixLinesContainer.ByName(administratorUser);
        let approver1Line = approver1LinesContainer.GetFirstLine();

        let conditionCell1 = approver1Line.GetAmountConditionCell();
        conditionCell1.SelectConditionType(ConditionsType.Within);
        conditionCell1.SetValue1('0', ConditionsType.Within, null, protractor.Key.TAB);
        conditionCell1.SetValue2('111', ConditionsType.Within);
        matrix.Done();
        workflowStep1.CheckDefaultAprroverForm(DisplayState.Shown);
        workflowStep1.ApproverMatrixClick();
        matrix.AddNewUser(newUSerMail );
        matrix.Done();
        workflowStep1.CheckDefaultAprroverForm(DisplayState.Hide);
        workflowStep1.ApproverMatrixClick();

        browser.sleep(6666);

        let newUSerName = 'xxxx';
        let approver2LinesContainer = MatrixLinesContainer.ByName(newUSerMail );
        let approver2Line = approver2LinesContainer.GetFirstLine();

        let conditionCell2 = approver2Line.GetAmountConditionCell();
        conditionCell2.SelectConditionType(ConditionsType.OverOrEqualTo);
        conditionCell2.SetValue1('100', ConditionsType.OverOrEqualTo, null, protractor.Key.TAB);
        matrix.Done();
        workflowStep1.CheckDefaultAprroverForm(DisplayState.Shown);

        workflowStep1.ApproverMatrixClick();
        conditionCell2.SelectConditionType(ConditionsType.Any);
        matrix.Done();
        workflowStep1.CheckDefaultAprroverForm(DisplayState.Hide);

        workflowStep1.ApproverMatrixClick();
        matrix.RemoveUserByName(newUSerMail);
        matrix.Done();
        workflowStep1.CheckDefaultAprroverForm(DisplayState.Shown);

        workflowStep1.AddNewDefaultApprover(newUSerMail);
        workflowStep1.DeleteApprover(administratorUser);
        workflowStep1.CheckDefaultAprroverForm(DisplayState.Hide);




    });

    it("Default Approver in Xero AR Credit Note", function () {

        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_18_2elmxF7');

        let defaultNameStep = Page.Config.defaultStepName;
        let administratorUser = "Test Auto";
        let newUSerName = 'xxxx@1111.ccc';

        browser.sleep(1500);
        let overView = new OverviewPage();
        overView.HamburgerClick();

        overView.AddNewCompany(companyName);
        overView.HamburgerClick();
        overView.OpenWorkFlowTab(companyName);
        let xeroWorkflows = new XeroWorkflows();
        xeroWorkflows.ConnectToXero(XeroLoginMethod.WithoutForm);
        xeroWorkflows.ReceivableWorkflows.ARCreditNoteClick();

        let workflowCard = new XeroWorkflowCard();

        let workflowStep1 = new WorkflowStep(defaultNameStep);
        workflowStep1.AddExistingApprover(administratorUser, [administratorUser]);

        workflowStep1.ApproverMatrixClick();
        let matrix = new MatrixPopup();

        let approver1LinesContainer = MatrixLinesContainer.ByName(administratorUser);
        let approver1Line = approver1LinesContainer.GetFirstLine();

        let conditionCell1 = approver1Line.GetAmountConditionCell();
        conditionCell1.SelectConditionType(ConditionsType.Within);
        conditionCell1.SetValue1('0', ConditionsType.Within, null, protractor.Key.TAB);
        conditionCell1.SetValue2('111', ConditionsType.Within);
        matrix.Done();
        workflowStep1.CheckDefaultAprroverForm(DisplayState.Shown);
        workflowStep1.ApproverMatrixClick();
        matrix.AddNewUser(newUSerName );
        matrix.Done();
        workflowStep1.CheckDefaultAprroverForm(DisplayState.Hide);
        workflowStep1.ApproverMatrixClick();

        browser.sleep(6666);

        // newUSerName = 'xxxx';
        let approver2LinesContainer = MatrixLinesContainer.ByName(newUSerName );
        let approver2Line = approver2LinesContainer.GetFirstLine();

        let conditionCell2 = approver2Line.GetAmountConditionCell();
        conditionCell2.SelectConditionType(ConditionsType.OverOrEqualTo);
        conditionCell2.SetValue1('100', ConditionsType.OverOrEqualTo, null, protractor.Key.TAB);
        matrix.Done();
        workflowStep1.CheckDefaultAprroverForm(DisplayState.Shown);

        workflowStep1.ApproverMatrixClick();
        conditionCell2.SelectConditionType(ConditionsType.Any);
        matrix.Done();
        workflowStep1.CheckDefaultAprroverForm(DisplayState.Hide);

        workflowStep1.ApproverMatrixClick();
        matrix.RemoveUserByName(newUSerName);
        matrix.Done();
        workflowStep1.CheckDefaultAprroverForm(DisplayState.Shown);

        workflowStep1.AddNewDefaultApprover(newUSerName);
        workflowStep1.DeleteApprover(administratorUser);
        workflowStep1.CheckDefaultAprroverForm(DisplayState.Hide);




    });

    it("Default Approver in Xero SalesInvoice", function () {

        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_18_2elmxF7');

        let defaultNameStep = Page.Config.defaultStepName;
        let administratorUser = "Test Auto";
        let newUSerName = 'xxxx@1111.ccc';

        browser.sleep(1500);
        let overView = new OverviewPage();
        overView.HamburgerClick();

        overView.AddNewCompany(companyName);
        overView.HamburgerClick();
        overView.OpenWorkFlowTab(companyName);
        let xeroWorkflows = new XeroWorkflows();
        xeroWorkflows.ConnectToXero(XeroLoginMethod.WithoutForm);
        xeroWorkflows.ReceivableWorkflows.SalesInvoiceClick();
        let workflowCard = new XeroWorkflowCard();

        let workflowStep1 = new WorkflowStep(defaultNameStep);
        workflowStep1.AddExistingApprover(administratorUser, [administratorUser]);

        workflowStep1.ApproverMatrixClick();
        let matrix = new MatrixPopup();

        let approver1LinesContainer = MatrixLinesContainer.ByName(administratorUser);
        let approver1Line = approver1LinesContainer.GetFirstLine();

        let conditionCell1 = approver1Line.GetAmountConditionCell();
        conditionCell1.SelectConditionType(ConditionsType.Within);
        conditionCell1.SetValue1('0', ConditionsType.Within, null, protractor.Key.TAB);
        conditionCell1.SetValue2('111', ConditionsType.Within);
        matrix.Done();
        workflowStep1.CheckDefaultAprroverForm(DisplayState.Shown);
        workflowStep1.ApproverMatrixClick();
        matrix.AddNewUser(newUSerName );
        matrix.Done();
        workflowStep1.CheckDefaultAprroverForm(DisplayState.Hide);
        workflowStep1.ApproverMatrixClick();

        let approver2LinesContainer = MatrixLinesContainer.ByName(newUSerName );
        let approver2Line = approver2LinesContainer.GetFirstLine();

        let conditionCell2 = approver2Line.GetAmountConditionCell();
        conditionCell2.SelectConditionType(ConditionsType.OverOrEqualTo);
        conditionCell2.SetValue1('100', ConditionsType.OverOrEqualTo, null, protractor.Key.TAB);
        matrix.Done();
        workflowStep1.CheckDefaultAprroverForm(DisplayState.Shown);

        workflowStep1.ApproverMatrixClick();
        conditionCell2.SelectConditionType(ConditionsType.Any);
        matrix.Done();
        workflowStep1.CheckDefaultAprroverForm(DisplayState.Hide);

        workflowStep1.ApproverMatrixClick();
        matrix.RemoveUserByName(newUSerName);
        matrix.Done();
        workflowStep1.CheckDefaultAprroverForm(DisplayState.Shown);

        workflowStep1.AddNewDefaultApprover(newUSerName);
        workflowStep1.DeleteApprover(administratorUser);
        workflowStep1.CheckDefaultAprroverForm(DisplayState.Hide);




    });

    it("Default Approver in Xero Purchase Order", function () {

        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_18_2elmxF7');

        let defaultNameStep = Page.Config.defaultStepName;
        let administratorUser = "Test Auto";
        let newUSerName = 'xxxx@1111.ccc';

        browser.sleep(1500);
        let overView = new OverviewPage();
        overView.HamburgerClick();
        overView.AddNewCompany(companyName);
        overView.HamburgerClick();
        overView.OpenWorkFlowTab(companyName);
        let xeroWorkflows = new XeroWorkflows();
        xeroWorkflows.ConnectToXero(XeroLoginMethod.WithoutForm);
        xeroWorkflows.PayableWorkflows.PurchaseOrderClick();

        let workflowCard = new XeroWorkflowCard();

        let workflowStep1 = new WorkflowStep(defaultNameStep);
        workflowStep1.AddExistingApprover(administratorUser, [administratorUser]);

        workflowStep1.ApproverMatrixClick();
        let matrix = new MatrixPopup();

        let approver1LinesContainer = MatrixLinesContainer.ByName(administratorUser);
        let approver1Line = approver1LinesContainer.GetFirstLine();

        let conditionCell1 = approver1Line.GetAmountConditionCell();
        conditionCell1.SelectConditionType(ConditionsType.Within);
        conditionCell1.SetValue1('0', ConditionsType.Within, null, protractor.Key.TAB);
        conditionCell1.SetValue2('111', ConditionsType.Within);
        matrix.Done();
        workflowStep1.CheckDefaultAprroverForm(DisplayState.Shown);
        workflowStep1.ApproverMatrixClick();
        matrix.AddNewUser(newUSerName );
        matrix.Done();
        workflowStep1.CheckDefaultAprroverForm(DisplayState.Hide);
        workflowStep1.ApproverMatrixClick();

        browser.sleep(6666);

        let approver2LinesContainer = MatrixLinesContainer.ByName(newUSerName );
        let approver2Line = approver2LinesContainer.GetFirstLine();

        let conditionCell2 = approver2Line.GetAmountConditionCell();
        conditionCell2.SelectConditionType(ConditionsType.OverOrEqualTo);
        conditionCell2.SetValue1('100', ConditionsType.OverOrEqualTo, null, protractor.Key.TAB);
        matrix.Done();
        workflowStep1.CheckDefaultAprroverForm(DisplayState.Shown);

        workflowStep1.ApproverMatrixClick();
        conditionCell2.SelectConditionType(ConditionsType.Any);
        matrix.Done();
        workflowStep1.CheckDefaultAprroverForm(DisplayState.Hide);

        workflowStep1.ApproverMatrixClick();
        matrix.RemoveUserByName(newUSerName);
        matrix.Done();
        workflowStep1.CheckDefaultAprroverForm(DisplayState.Shown);

        workflowStep1.AddNewDefaultApprover(newUSerName);
        workflowStep1.DeleteApprover(administratorUser);
        workflowStep1.CheckDefaultAprroverForm(DisplayState.Hide);




    });

    it("Default Approver in Standalone", function () {

        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_18_2elmxF7');

        let defaultNameStep = Page.Config.defaultStepName;
        let administratorUser = "Test Auto";
        let newUSerName = 'xxxx@1111.ccc';

        browser.sleep(1500);
        let overView = new OverviewPage();
        overView.HamburgerClick();

        overView.AddNewCompany(companyName);
        overView.HamburgerClick();
        overView.OpenWorkFlowTab(companyName);
        let standaloneWorkflows = new StandaloneWorkflows();
        standaloneWorkflows.CreateFirstClick();

        let workflowCard = new StandAloneWorkflowCard();

        let workflowStep1 = new WorkflowStep(defaultNameStep);
        workflowStep1.AddExistingApprover(administratorUser, [administratorUser]);

        workflowStep1.ApproverMatrixClick();
        let matrix = new MatrixPopup();

        let approver1LinesContainer = MatrixLinesContainer.ByName(administratorUser);
        let approver1Line = approver1LinesContainer.GetFirstLine();

        let conditionCell1 = approver1Line.GetAmountConditionCell();
        conditionCell1.SelectConditionType(ConditionsType.Within);
        conditionCell1.SetValue1('0', ConditionsType.Within, null, protractor.Key.TAB);
        conditionCell1.SetValue2('111', ConditionsType.Within);
        matrix.Done();
        workflowStep1.CheckDefaultAprroverForm(DisplayState.Shown);
        workflowStep1.ApproverMatrixClick();
        matrix.AddNewUser(newUSerName );
        matrix.Done();
        workflowStep1.CheckDefaultAprroverForm(DisplayState.Hide);
        workflowStep1.ApproverMatrixClick();

        browser.sleep(6666);

        let approver2LinesContainer = MatrixLinesContainer.ByName(newUSerName );
        let approver2Line = approver2LinesContainer.GetFirstLine();

        let conditionCell2 = approver2Line.GetAmountConditionCell();
        conditionCell2.SelectConditionType(ConditionsType.OverOrEqualTo);
        conditionCell2.SetValue1('100', ConditionsType.OverOrEqualTo, null, protractor.Key.TAB);
        matrix.Done();
        workflowStep1.CheckDefaultAprroverForm(DisplayState.Shown);

        workflowStep1.ApproverMatrixClick();
        conditionCell2.SelectConditionType(ConditionsType.Any);
        matrix.Done();
        workflowStep1.CheckDefaultAprroverForm(DisplayState.Hide);

        workflowStep1.ApproverMatrixClick();
        matrix.RemoveUserByName(newUSerName);
        matrix.Done();
        workflowStep1.CheckDefaultAprroverForm(DisplayState.Shown);

        workflowStep1.AddNewDefaultApprover(newUSerName);
        workflowStep1.DeleteApprover(administratorUser);
        workflowStep1.CheckDefaultAprroverForm(DisplayState.Hide);




    });

    it("Default Approver in QB Purchase Order", function () {

        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_18_2elmxF7');

        let defaultNameStep = Page.Config.defaultStepName;
        let administratorUser = "Test Auto";
        let newUSerName = 'xxxx@1111.ccc';

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
        workflowStep1.AddExistingApprover(administratorUser, [administratorUser]);

        workflowStep1.ApproverMatrixClick();
        let matrix = new MatrixPopup();

        let approver1LinesContainer = MatrixLinesContainer.ByName(administratorUser);
        let approver1Line = approver1LinesContainer.GetFirstLine();

        let conditionCell1 = approver1Line.GetAmountConditionCell();
        conditionCell1.SelectConditionType(ConditionsType.Within);
        conditionCell1.SetValue1('0', ConditionsType.Within, null, protractor.Key.TAB);
        conditionCell1.SetValue2('111', ConditionsType.Within);
        matrix.Done();
        workflowStep1.CheckDefaultAprroverForm(DisplayState.Shown);
        workflowStep1.ApproverMatrixClick();
        matrix.AddNewUser(newUSerName );
        matrix.Done();
        workflowStep1.CheckDefaultAprroverForm(DisplayState.Hide);
        workflowStep1.ApproverMatrixClick();

        browser.sleep(6666);

        let approver2LinesContainer = MatrixLinesContainer.ByName(newUSerName );
        let approver2Line = approver2LinesContainer.GetFirstLine();

        let conditionCell2 = approver2Line.GetAmountConditionCell();
        conditionCell2.SelectConditionType(ConditionsType.OverOrEqualTo);
        conditionCell2.SetValue1('100', ConditionsType.OverOrEqualTo, null, protractor.Key.TAB);
        matrix.Done();
        workflowStep1.CheckDefaultAprroverForm(DisplayState.Shown);

        workflowStep1.ApproverMatrixClick();
        conditionCell2.SelectConditionType(ConditionsType.Any);
        matrix.Done();
        workflowStep1.CheckDefaultAprroverForm(DisplayState.Hide);

        workflowStep1.ApproverMatrixClick();
        matrix.RemoveUserByName(newUSerName);
        matrix.Done();
        workflowStep1.CheckDefaultAprroverForm(DisplayState.Shown);

        workflowStep1.AddNewDefaultApprover(newUSerName);
        workflowStep1.DeleteApprover(administratorUser);
        workflowStep1.CheckDefaultAprroverForm(DisplayState.Hide);




    });

});
