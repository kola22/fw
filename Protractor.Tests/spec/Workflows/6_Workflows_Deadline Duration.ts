import { Page } from "../../Pages/Page";
import { LoginForm } from "../../Pages/Forms/LogIn";
import { LogoMenu } from "../../Pages/Forms/LogoMenu";
import { MainPage } from "../../Pages/MainPage";
import { OverviewPage } from "../../Pages/OverviewPage";
import { XeroWorkflows } from "../../Pages/Forms/XeroWorkflows";
import { CompanySetting } from "../../Pages/CompanySetting";
import { DropDownState, Validation, DisplayState, WorkFlowType, CloseState, EnabledState, XeroLoginMethod } from "../../Common/Enums";
import { Common } from "../../Common/Common";
import { RandomGenerator } from "../../Common/RandomGenerator";
import { WorkflowStep } from "../../Pages/Forms/WorkflowStep";
import { CompanyMenuGroup } from "../../Pages/Controls/CompanyMenuGroup";
import { MatrixLine } from "../../Pages/Matrix/MatrixLine";
import { MatrixPopup } from "../../Pages/Matrix/MatrixPopup";
import { DurationEditor } from "../../Pages/Popup/DurationEditor";
import { XeroSyncPopup } from "../../Pages/Popup/XeroSyncPopup";
import { XeroWorkflowCard } from "../../Pages/Forms/WorkflowCard";


describe("6_Workflows_Deadline Duration . ts", function () {

    let companyName = "XtestX" + RandomGenerator.generate(6);

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

    it("Deadline Duration", function () {

        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_6_2h3dHQp');

        let defaultNameStep = Page.Config.defaultStepName;
        let newStep2 = 'QA_QA_QA';
        let existingApprover2 = "Test Auto";

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

        let workflowStep1 = new WorkflowStep(defaultNameStep);
        defaultNameStep = 'step1';
        workflowStep1.RenameStep(defaultNameStep);

        workflowStep1.AddExistingApprover(existingApprover2, [existingApprover2]);
        workflowStep1.DeadLineIconCheck(EnabledState.Disabled);

        let workflowCard = new XeroWorkflowCard();
        let workflowStep2 = workflowCard.AddNewStep(newStep2);

        workflowStep2.AddExistingApprover(existingApprover2, [existingApprover2]);

        workflowStep2.DeadLineIconCheck(EnabledState.Disabled);


        workflowStep1.DeadLineClick();
        workflowStep1.DeadLineIconCheck(EnabledState.Disabled);

        workflowStep1.DeadLineClick();
        workflowStep1.DeadLineIconCheck(EnabledState.Disabled);

        workflowStep2.DeadLineClick();
        workflowStep2.DeadLineIconCheck(EnabledState.Disabled);

        let durationEditor = new DurationEditor();
        durationEditor.HoursUpClick(1, 0, 1);
        workflowStep2.CheckDeadlineValue(0, 1);
        workflowStep2.DeadLineIconCheck(EnabledState.Enabled);
        durationEditor.HoursDownClick(1, 0, 0);
        workflowStep2.DeadLineIconCheck(EnabledState.Disabled);
        durationEditor.HoursUpClick(25, 1, 1);
        workflowStep2.CheckDeadlineValue(1, 1);
        durationEditor.HoursDownClick(1, 1, 0);
        workflowStep2.CheckDeadlineValue(1, 0);
        durationEditor.HoursDownClick(1, 0, 23);
        workflowStep2.CheckDeadlineValue(0, 23);
        durationEditor.DaysUpClick(1, 1, 23);
        durationEditor.HoursUpClick(2, 2, 1);
        workflowStep2.CheckDeadlineValue(2, 1);
        durationEditor.HoursUpClick(1, 2, 2);
        workflowStep2.CheckDeadlineValue(2, 2);

        workflowStep1.DeadLineClick();
        durationEditor.DaysUpClick(5, 5, 0);
        durationEditor.HoursUpClick(5, 5, 5);
        workflowStep1.CheckDeadlineValue(5, 5);

        workflowCard.SaveWorkflow();
        workflowStep1.CheckDeadlineValue(5, 5);
        workflowStep2.CheckDeadlineValue(2, 2);

        workflowCard.Close();

        let logoMenu = new LogoMenu();
        logoMenu.LogoMenuClick(DropDownState.Open);
        //15 Sign out
        logoMenu.LogoutCLick();
        browser.sleep(3000);

        LoginForm.Login(Page.Config.testUser);
        browser.sleep(3000);
        overView.HamburgerClick();
        overView.ExpandCompanyMenu(companyName);
        overView.OpenWorkFlowTab(companyName);
        xeroWorkflows.PayableWorkflows.BillClick();

        workflowStep1.CheckDeadlineValue(5, 5);
        workflowStep2.CheckDeadlineValue(2, 2);

        workflowCard.Close();

    });
});
