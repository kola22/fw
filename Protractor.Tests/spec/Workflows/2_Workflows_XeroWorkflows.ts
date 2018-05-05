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
import { CompanyMenuGroup } from "../../Pages/Controls/CompanyMenuGroup";
import { MatrixLine } from "../../Pages/Matrix/MatrixLine";
import { MatrixPopup } from "../../Pages/Matrix/MatrixPopup";
import { DurationEditor } from "../../Pages/Popup/DurationEditor";
import { XeroSyncPopup } from "../../Pages/Popup/XeroSyncPopup";
import { XeroWorkflowCard } from "../../Pages/Forms/WorkflowCard";


describe("2_Workflows_XeroWorkflows . ts", function () {

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
        browser.sleep(5000);
        overView.DeleteCompany(companyName, false);

        // let x = 0;
        // while (x<10){
        //     x=x+1;
        //     overView.DeleteAllCompany();
        //     browser.sleep(5000);
        //     overView.HamburgerClick();
        // }

        let logoMenu = new LogoMenu();
        logoMenu.LogoMenuClick(DropDownState.Open);

        logoMenu.LogoutCLick();
        browser.sleep(1000);
        Common.Spies.Log();
    });

    it("Xero Workflow Start and Edit", function () {

        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_2_2tkeNMQ');

        let defaultNameStep = Page.Config.defaultStepName;
        let newStep1 = 'testtest';
        let newStep2 = 'QA_QA_QA';
        //let approver1 = "Test Auto";
        let existingApprover2 = "Test Auto";
        // let newApproverEmail1 = "someQA@mail.com";
        // let newApproverName1 = "someQA";

        browser.sleep(1500);
        let overView = new OverviewPage();
        overView.HamburgerClick();

        //2 Add a new company         Name == Test_777 or random name
        overView.AddNewCompany(companyName);
        //6 Click Hamburger
        overView.HamburgerClick();

        //7 Click on the ""Approval workflows"" on company
        overView.OpenWorkFlowTab(companyName);
        let xeroWorkflows = new XeroWorkflows();
        xeroWorkflows.ConnectToXero(XeroLoginMethod.WithFrom);

        //8 Click == Bill workflow
        xeroWorkflows.PayableWorkflows.BillClick();

        let workflowStep1 = new WorkflowStep(defaultNameStep);
        //9 Rename step 2
        workflowStep1.RenameStep(newStep1);
        let workflowCard = new XeroWorkflowCard();
        //10 Add step 3
        let workflowStep2 = workflowCard.AddNewStep(newStep2);

        // workflowStep1.AddNewApprover(newApproverEmail1, [newApproverName1, existingApprover2]);

        //11 Add administrator (Test Auto) in each step as == Approver
        workflowStep1.AddExistingApprover(existingApprover2, [existingApprover2]);
        // workflowStep2.AddExistingApprover(newApproverName1, [newApproverName1]); //newApprover1 will be existing to this time
        workflowStep2.AddExistingApprover(existingApprover2, [ existingApprover2]);

        workflowCard.SaveWorkflow();

        //After saving new users transform to lowercase
        // newApproverName1 = newApproverName1.toLocaleLowerCase();

        // workflowStep1 = new WorkflowStep(newStep1, [newApproverName1, existingApprover2]);
        // workflowStep2 = new WorkflowStep(newStep2, [newApproverName1, existingApprover2]);

        //13 Verify the contents
        workflowStep1 = new WorkflowStep(newStep1, [ existingApprover2]);
        workflowStep2 = new WorkflowStep(newStep2, [ existingApprover2]);

        // workflowStep1.ApproverMatrixClick();
        // let matrix = new MatrixPopup();
        // matrix.RemoveUser(newApproverName1);
        // matrix.SyncClick();
        // let xeroSyncPopup = new XeroSyncPopup();
        // xeroSyncPopup.Sync(XeroSyncItem.Accounts);
        // xeroSyncPopup.Sync(XeroSyncItem.Contacts);
        // matrix.Done();

        // workflowStep1 = new WorkflowStep(newStep1, [existingApprover2]);
        //
        // workflowStep1.DeadLineClick();
        //
        // let durationEditor = new DurationEditor();
        // durationEditor.DaysUpClick(4, 4, 0);
        // durationEditor.HoursDownClick(1, 3, 23);
        // durationEditor.HoursUpClick(1, 4, 0);
        // durationEditor.HoursDownClick(1, 3, 23);
        // durationEditor.DaysDownClick(2, 1, 23);
        //
        // workflowStep1.DeleteDeadLine();

        workflowCard.Close();

        let logoMenu = new LogoMenu();
        logoMenu.LogoMenuClick(DropDownState.Open);
        //15 Sign out
        logoMenu.LogoutCLick();
        browser.sleep(3000);


        // Page.Navigate.TestApp();
        //16 Log in
        LoginForm.Login(Page.Config.testUser);



        overView.HamburgerClick();
        overView.ExpandCompanyMenu(companyName);
        overView.OpenWorkFlowTab(companyName);


        //17 Open the Workflow and verify the contents
        xeroWorkflows.PayableWorkflows.BillClick();
        workflowStep1 = new WorkflowStep(newStep1, [ existingApprover2]);
        workflowStep2 = new WorkflowStep(newStep2, [ existingApprover2]);


        workflowCard.Close();
        // overView.HamburgerClick();
        // overView.ExpandCompanyMenu(companyName, DropDownState.Collapsed);
        // workflowCard.SaveForkflow();

    });
});
