import { Page } from "../../Pages/Page";
import { LoginForm } from "../../Pages/Forms/LogIn";
import { LogoMenu } from "../../Pages/Forms/LogoMenu";
import { MainPage } from "../../Pages/MainPage";
import { OverviewPage } from "../../Pages/OverviewPage";
import { CompanySetting } from "../../Pages/CompanySetting";
import { DropDownState, Validation, DisplayState, WorkFlowType } from "../../Common/Enums";
import { Common } from "../../Common/Common";
import { RandomGenerator } from "../../Common/RandomGenerator";
import { WorkflowStep } from "../../Pages/Forms/WorkflowStep";
import { StandAloneWorkflowCard } from "../../Pages/Forms/WorkflowCard";
import { StandaloneWorkflows } from "../../Pages/Forms/StandaloneWorkflows";

describe("1_Workflows_StandaloneWorkflows . ts ", function () {

    let companyName = "test" + RandomGenerator.generate(6);
    let addSAWorkflow = function (name: string) {
        let standaloneWorkflows = new StandaloneWorkflows();
        standaloneWorkflows.CreateClick();

        let workflowCard = new StandAloneWorkflowCard();

        workflowCard.SetName(name);

        workflowCard.SaveWorkflow();

        workflowCard.Close();

    };

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

    it("Basic Workflow Start and Edit", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_1_2sKlhEF ');

        let defaultNameStep = 'Approval step';
        let newStep1 = 'testtest';
        let newStep2 = 'QA_QA_QA';

        let existingApprover2 = "Test Auto";

        let overView = new OverviewPage();
        overView.HamburgerClick();

        overView.AddNewCompany(companyName);
        overView.HamburgerClick();

        overView.OpenWorkFlowTab(companyName);
        let standaloneWorkflows = new StandaloneWorkflows();
        standaloneWorkflows.CreateFirstClick();

        let workflowCard = new StandAloneWorkflowCard();

        let workflowStep1 = new WorkflowStep(defaultNameStep);
        workflowStep1.RenameStep(newStep1);
        workflowStep1.AddExistingApprover(existingApprover2, [ existingApprover2]);

        let workflowStep2 = workflowCard.AddNewStep(newStep2);
        workflowStep2.AddExistingApprover(existingApprover2, [ existingApprover2]);

        workflowCard.SetName("testSAWorkflow1");

        workflowCard.SaveWorkflow();

        workflowCard.ActivateWorkflow();

        workflowCard.Close();

        let logoMenu = new LogoMenu();
        logoMenu.LogoMenuClick(DropDownState.Open);
        //15 Sign out
        logoMenu.LogoutCLick();
        browser.sleep(3000);


        //16 Log in
        LoginForm.Login(Page.Config.testUser);


        browser.sleep(3000);
        overView.HamburgerClick();
        overView.OpenWorkFlowTab(companyName);


        //17 Open the Workflow and verify the contents
        standaloneWorkflows = new StandaloneWorkflows(["testSAWorkflow1"]);
        standaloneWorkflows.WorkflowClick("testSAWorkflow1");

        workflowStep1 = new WorkflowStep(newStep1, [ existingApprover2]);
        workflowStep2 = new WorkflowStep(newStep2, [ existingApprover2]);


        workflowCard.Close();


        /*
        standaloneWorkflows = new StandaloneWorkflows(["testSAWorkflow1"]);

        addSAWorkflow("testSAWorkflow2");


        standaloneWorkflows = new StandaloneWorkflows(["testSAWorkflow1", "testSAWorkflow2"]);

        addSAWorkflow("testQA1");

        standaloneWorkflows = new StandaloneWorkflows(["testQA1", "testSAWorkflow1", "testSAWorkflow2"]);

        addSAWorkflow("testZ");

        standaloneWorkflows = new StandaloneWorkflows(["testQA1", "testSAWorkflow1", "testSAWorkflow2", "testZ"]);

        standaloneWorkflows.SearchBtnClick();

        standaloneWorkflows.SetFilter("test", ["testQA1", "testSAWorkflow1", "testSAWorkflow2", "testZ"]);
        standaloneWorkflows.SetFilter("testQA", ["testQA1"]);
        standaloneWorkflows.SetFilter("QA", ["testQA1"]);
        standaloneWorkflows.SetFilter("QQQ", new Array());
        standaloneWorkflows.SetFilter("testS", ["testSAWorkflow1", "testSAWorkflow2"]);
        standaloneWorkflows.SetFilter("testZ", ["testZ"]);
        standaloneWorkflows.SearcheClose();
        standaloneWorkflows.CheckWorkFlows(["testQA1", "testSAWorkflow1", "testSAWorkflow2", "testZ"]);*/
    });

});
