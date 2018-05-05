import { Page } from "../../Pages/Page";
import { LoginForm } from "../../Pages/Forms/LogIn";
import { LogoMenu } from "../../Pages/Forms/LogoMenu";
import { MainPage } from "../../Pages/MainPage";
import { OverviewPage } from "../../Pages/OverviewPage";
import { CompanySetting } from "../../Pages/CompanySetting";
import { DropDownState, Validation, DisplayState, WorkFlowType ,CloseState} from "../../Common/Enums";
import { Common } from "../../Common/Common";
import { RandomGenerator } from "../../Common/RandomGenerator";
import { WorkflowStep } from "../../Pages/Forms/WorkflowStep";
import { StandAloneWorkflowCard } from "../../Pages/Forms/WorkflowCard";
import { StandaloneWorkflows } from "../../Pages/Forms/StandaloneWorkflows";

describe("5_Workflows_SeveralWorkflowAndFilter . ts", function () {

    let companyName = "test" + RandomGenerator.generate(6);
    let addSAWorkflow = function (name: string, clickSave = true) {
        let standaloneWorkflows = new StandaloneWorkflows();
        standaloneWorkflows.CreateClick();

        let workflowCard = new StandAloneWorkflowCard();

        if(name != null) {workflowCard.SetName(name);}

        if (clickSave){
            workflowCard.SaveWorkflow();
            workflowCard.Close();
        }else{
            workflowCard.Close(CloseState.DiscardChanges);
        }

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

    it("Several Standalone Workflow and filter", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_5_2gZfvdf ');

        let defaultNameStep = 'Approval step';
        let existingApprover2 = "Test Auto";

        let overView = new OverviewPage();
        overView.HamburgerClick();

        overView.AddNewCompany(companyName);
        overView.HamburgerClick();

        overView.OpenWorkFlowTab(companyName);
        let standaloneWorkflows = new StandaloneWorkflows();
        standaloneWorkflows.CreateFirstClick();

        let workflowCard = new StandAloneWorkflowCard();

        workflowCard.SetName("123");

        workflowCard.SaveWorkflow();

        workflowCard.Close();

        standaloneWorkflows = new StandaloneWorkflows(["123"]);

        addSAWorkflow(null);

        standaloneWorkflows = new StandaloneWorkflows(["123","Unnamed workflow"]);


        addSAWorkflow("TestQA@$$$$___+++Yy");

        standaloneWorkflows = new StandaloneWorkflows(["123","TestQA@$$$$___+++Yy","Unnamed workflow"]);

        addSAWorkflow("disappearing12",false);

        standaloneWorkflows = new StandaloneWorkflows(["123","TestQA@$$$$___+++Yy","Unnamed workflow"]);

        addSAWorkflow("QA qa");
        addSAWorkflow("Test 2");
        addSAWorkflow("+++3");
        addSAWorkflow("testqa1");

        standaloneWorkflows = new StandaloneWorkflows(["+++3","123","QA qa","Test 2","TestQA@$$$$___+++Yy","testqa1","Unnamed workflow"]);

        standaloneWorkflows.SearchBtnClick();
        standaloneWorkflows.SetFilter("1", ["123", "testqa1"]);
        standaloneWorkflows.SetFilter("qa", ["QA qa","TestQA@$$$$___+++Yy","testqa1"]);
        standaloneWorkflows.SetFilter("QA", ["QA qa","TestQA@$$$$___+++Yy","testqa1"]);
        standaloneWorkflows.SetFilter("TeSt", ["Test 2","TestQA@$$$$___+++Yy", "testqa1"]);
        standaloneWorkflows.SetFilter(" ", ["QA qa","Test 2"]);
        standaloneWorkflows.SetFilter("$$__", ["TestQA@$$$$___+++Yy"]);
        standaloneWorkflows.SearcheClose();

        standaloneWorkflows.WorkflowClick("testqa1");
        workflowCard.Delete();

        browser.sleep(3500);
        standaloneWorkflows.SearchBtnClick();
        standaloneWorkflows.SetFilter("qa", ["QA qa","TestQA@$$$$___+++Yy"]);

    });

});
