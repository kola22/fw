import { Page } from "../../Pages/Page";
import { LoginForm } from "../../Pages/Forms/LogIn";
import { LogoMenu } from "../../Pages/Forms/LogoMenu";
import { MainPage } from "../../Pages/MainPage";
import { OverviewPage } from "../../Pages/OverviewPage";
import { XeroWorkflows } from "../../Pages/Forms/XeroWorkflows";
import { CompanySetting } from "../../Pages/CompanySetting";
import { DropDownState, Validation, DisplayState, WorkFlowType, CloseState, XeroSyncItem, XeroLoginMethod } from "../../Common/Enums";
import { Common } from "../../Common/Common";
import { RandomGenerator } from "../../Common/RandomGenerator";
import { WorkflowStep } from "../../Pages/Forms/WorkflowStep";
import { XeroWorkflowCard } from "../../Pages/Forms/WorkflowCard";
import { MatrixPopup } from "../../Pages/Matrix/MatrixPopup";
import { MatrixLinesContainer } from "../../Pages/Matrix/MatrixLinesContainer";
import { XeroSyncPopup } from "../../Pages/Popup/XeroSyncPopup";
import { QbWorkflows } from "../../Pages/Forms/QbWorkflows";


// тест нужно дополнить ключевой проверкой -- обновление кэша после создания нового айтема в Зире
describe("14_Workflows_Cache . ts", function () {

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

    it("Xero Bill Cache", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_14_2xjJsfM');
        let existingApprover2 = "Test Auto";

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

        matrix.SyncClick();
        let cache = new XeroSyncPopup();
        cache.Sync(XeroSyncItem.Accounts);
        cache.Sync(XeroSyncItem.Contacts);
        cache.Sync(XeroSyncItem.Currencies);
        cache.Sync(XeroSyncItem.Items);
        cache.Sync(XeroSyncItem.Organization);
        cache.Sync(XeroSyncItem.Taxes);
        cache.Sync(XeroSyncItem.Themes);
        cache.Sync(XeroSyncItem.TrackingCategories);
        matrix.Close();
        workflowCard.Close(CloseState.DiscardChanges);

    });

    it("Xero ApCreditNote Cache", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_14_2xjJsfM');

        let existingApprover2 = "Test Auto";
        let xeroWorkflows = new XeroWorkflows();

        xeroWorkflows.PayableWorkflows.ApCreditNoteClick();

        let workflowCard = new XeroWorkflowCard();
        let workflowStep1 = new WorkflowStep(defaultNameStep);
        workflowStep1.AddExistingApprover(existingApprover2, [existingApprover2]);
        workflowStep1.ApproverMatrixClick();
        let matrix = new MatrixPopup();
        let matrixLine = MatrixLinesContainer.GetFirstLineByName(existingApprover2);

        matrix.SyncClick();
        let cache = new XeroSyncPopup();
        cache.Sync(XeroSyncItem.Accounts);
        cache.Sync(XeroSyncItem.Contacts);
        cache.Sync(XeroSyncItem.Currencies);
        cache.Sync(XeroSyncItem.Items);
        cache.Sync(XeroSyncItem.Organization);
        cache.Sync(XeroSyncItem.Taxes);
        cache.Sync(XeroSyncItem.Themes);
        cache.Sync(XeroSyncItem.TrackingCategories);
        matrix.Close();
        workflowCard.Close(CloseState.DiscardChanges);

    });

    it("Xero PO Cache", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_14_2xjJsfM');

        let existingApprover2 = "Test Auto";
        let xeroWorkflows = new XeroWorkflows();

        xeroWorkflows.PayableWorkflows.PurchaseOrderClick();

        let workflowCard = new XeroWorkflowCard();
        let workflowStep1 = new WorkflowStep(defaultNameStep);
        workflowStep1.AddExistingApprover(existingApprover2, [existingApprover2]);
        workflowStep1.ApproverMatrixClick();
        let matrix = new MatrixPopup();
        let matrixLine = MatrixLinesContainer.GetFirstLineByName(existingApprover2);

        matrix.SyncClick();
        let cache = new XeroSyncPopup();
        cache.Sync(XeroSyncItem.Accounts);
        cache.Sync(XeroSyncItem.Contacts);
        cache.Sync(XeroSyncItem.Currencies);
        cache.Sync(XeroSyncItem.Items);
        cache.Sync(XeroSyncItem.Organization);
        cache.Sync(XeroSyncItem.Taxes);
        cache.Sync(XeroSyncItem.Themes);
        cache.Sync(XeroSyncItem.TrackingCategories);
        matrix.Close();
        workflowCard.Close(CloseState.DiscardChanges);

    });

    it("Xero ARCreditNote Cache", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_14_2xjJsfM');

        let existingApprover2 = "Test Auto";
        let xeroWorkflows = new XeroWorkflows();

        xeroWorkflows.ReceivableWorkflows.ARCreditNoteClick();

        let workflowCard = new XeroWorkflowCard();
        let workflowStep1 = new WorkflowStep(defaultNameStep);
        workflowStep1.AddExistingApprover(existingApprover2, [existingApprover2]);
        workflowStep1.ApproverMatrixClick();
        let matrix = new MatrixPopup();
        let matrixLine = MatrixLinesContainer.GetFirstLineByName(existingApprover2);

        matrix.SyncClick();
        let cache = new XeroSyncPopup();
        cache.Sync(XeroSyncItem.Accounts);
        cache.Sync(XeroSyncItem.Contacts);
        cache.Sync(XeroSyncItem.Currencies);
        cache.Sync(XeroSyncItem.Items);
        cache.Sync(XeroSyncItem.Organization);
        cache.Sync(XeroSyncItem.Taxes);
        cache.Sync(XeroSyncItem.Themes);
        cache.Sync(XeroSyncItem.TrackingCategories);
        matrix.Close();
        workflowCard.Close(CloseState.DiscardChanges);

    });

    it("Xero SalesInvoice Cache", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_14_2xjJsfM');

        let existingApprover2 = "Test Auto";
        let xeroWorkflows = new XeroWorkflows();

        xeroWorkflows.ReceivableWorkflows.SalesInvoiceClick();

        let workflowCard = new XeroWorkflowCard();
        let workflowStep1 = new WorkflowStep(defaultNameStep);
        workflowStep1.AddExistingApprover(existingApprover2, [existingApprover2]);
        workflowStep1.ApproverMatrixClick();
        let matrix = new MatrixPopup();
        let matrixLine = MatrixLinesContainer.GetFirstLineByName(existingApprover2);

        matrix.SyncClick();
        let cache = new XeroSyncPopup();
        cache.Sync(XeroSyncItem.Accounts);
        cache.Sync(XeroSyncItem.Contacts);
        cache.Sync(XeroSyncItem.Currencies);
        cache.Sync(XeroSyncItem.Items);
        cache.Sync(XeroSyncItem.Organization);
        cache.Sync(XeroSyncItem.Taxes);
        cache.Sync(XeroSyncItem.Themes);
        cache.Sync(XeroSyncItem.TrackingCategories);
        matrix.Close();
        workflowCard.Close(CloseState.DiscardChanges);

    });
});
