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
import { QbWorkflows } from "../../Pages/Forms/QbWorkflows";



describe("11_Workflows_CountNameWorkflows . ts", function () {

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

    it("Count and Name Xero Workflows", function () {

        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_11_2wXLkKI');

        let overView = new OverviewPage();
        overView.HamburgerClick();
        overView.AddNewCompany(companyName);
        let settingCompany = new CompanySetting();
        overView.HamburgerClick();
        overView.OpenWorkFlowTab(companyName);
        let xeroWorkflows = new XeroWorkflows();
        xeroWorkflows.ConnectToXero(XeroLoginMethod.WithoutForm);
        browser.sleep(2000);
        xeroWorkflows.PayableWorkflows.PurchaseGetText();
        xeroWorkflows.PayableWorkflows.ApCreditNoteGetText();
        xeroWorkflows.PayableWorkflows.BillGetText();
        xeroWorkflows.ReceivableWorkflows.ARCreditNoteGetText();
        xeroWorkflows.ReceivableWorkflows.SalesInvoiceGetText();
        xeroWorkflows.DisconectClick();
        let clickToReconnectButton = true;
        xeroWorkflows.ConnectToXero(XeroLoginMethod.WithoutForm,clickToReconnectButton);

        browser.sleep(2000);
        xeroWorkflows.PayableWorkflows.PurchaseGetText();
        xeroWorkflows.PayableWorkflows.ApCreditNoteGetText();
        xeroWorkflows.PayableWorkflows.BillGetText();
        xeroWorkflows.ReceivableWorkflows.ARCreditNoteGetText();
        xeroWorkflows.ReceivableWorkflows.SalesInvoiceGetText();




    });

    it("Count and Name QB Workflows", function () {

        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_11_2wXLkKI');

        let overView = new OverviewPage();
        overView.HamburgerClick();
        overView.AddNewCompany(companyName);
        overView.HamburgerClick();
        overView.OpenWorkFlowTab(companyName);
        let qbWorkflows = new QbWorkflows();
        qbWorkflows.ConnectToQb();

        qbWorkflows.PurchaseGetText();

    });
});
