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


describe("4_Workflows_NewApproverInStep . ts", function () {

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
        overView.DeleteCompany(companyName,false);

        let logoMenu = new LogoMenu();
        logoMenu.LogoMenuClick(DropDownState.Open);

        logoMenu.LogoutCLick();
        browser.sleep(1000);
        Common.Spies.Log();
    });

    it("New Approver in Step", function () {

        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_4_2uQkaUi');

        let defaultNameStep = Page.Config.defaultStepName;
        let newStep2 = '2222222';
        let existingApprover = "Test Auto";
        let newApproverEmail1 = "newqa@mail.com";
        let newApproverName1 = "newqa";
        let newApproverEmail2 = "selenium@mail.ru";
        let newApproverName2 = "selenium";

        browser.sleep(1500);
        let overView = new OverviewPage();
        overView.HamburgerClick();

        //2 Add a new company         Name == Test_777 or random name
        overView.AddNewCompany(companyName);
        //3 Click == Connect to Xero

        //6 Click Hamburger
        overView.HamburgerClick();

        //7 Click on the ""Approval workflows"" on company
        overView.OpenWorkFlowTab(companyName);
        let xeroWorkflows = new XeroWorkflows();
        xeroWorkflows.ConnectToXero(XeroLoginMethod.WithoutForm);

        //8 Click == Bill workflow
        xeroWorkflows.PayableWorkflows.BillClick();

        let workflowCard = new XeroWorkflowCard();
        let workflowStep1 = new WorkflowStep(defaultNameStep);
        defaultNameStep = 'step1';
        workflowStep1.RenameStep(defaultNameStep );

        //9 Add administrator ( Test Auto ) in first Step
        workflowStep1.AddExistingApprover(existingApprover, [existingApprover]);
        //10 Add new user in first Step == newQa@mail.com
        workflowStep1.AddNewApprover(newApproverEmail1, [newApproverEmail1]);

        workflowStep1 = new WorkflowStep(defaultNameStep, [newApproverEmail1, existingApprover]);

        //11 Save workFlow
        workflowCard.SaveWorkflow();

        //12 Verify user in first Step
        workflowStep1 = new WorkflowStep(defaultNameStep, [newApproverEmail1, existingApprover]);

        //13 Add new user in first Step == Selenium@mail.ru
        workflowStep1.AddNewApprover(newApproverEmail2, [newApproverEmail1,newApproverEmail2,existingApprover]);

        workflowCard.SaveWorkflow();

        // 15 Verify user in first Step
        workflowStep1 = new WorkflowStep(defaultNameStep, [newApproverEmail1,newApproverEmail2,existingApprover]);

        //16 Add new Step == 2222222
        let workflowStep2 = workflowCard.AddNewStep(newStep2);

        //17 Add user newQa@mail.com in 2222222 Step
        //18 Add user Selenium@mail.ru in 2222222 Step

        workflowStep2.AddNewApprover(newApproverEmail1, [newApproverEmail1]);
        workflowStep2.AddNewApprover(newApproverEmail2, [newApproverEmail1, newApproverEmail2]);

        workflowCard.SaveWorkflow();

        //20 Verify user in 2222222 Step
        workflowStep2 = new WorkflowStep(newStep2, [newApproverEmail1, newApproverEmail2]);

        workflowCard.Close();

        let logoMenu = new LogoMenu();
        logoMenu.LogoMenuClick(DropDownState.Open);
        //22 Sign out
        logoMenu.LogoutCLick();
        browser.sleep(3000);

        //23 Log in
        LoginForm.Login(Page.Config.testUser);

//        browser.sleep(3000);
        overView.HamburgerClick();
        overView.ExpandCompanyMenu(companyName);
        overView.OpenWorkFlowTab(companyName);

        //24 Open the Workflow
        xeroWorkflows.PayableWorkflows.BillClick();

        //25 Verify user in first Step
        workflowStep1 = new WorkflowStep(defaultNameStep, [newApproverEmail1,newApproverEmail2,existingApprover]);

        //26 Verify user in 2222222 Step
        workflowStep2 = new WorkflowStep(newStep2, [newApproverEmail1, newApproverEmail2]);

        workflowCard.Close();
    });
});
