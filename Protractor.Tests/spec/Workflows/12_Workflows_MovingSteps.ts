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


describe(" ", function () {

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

    it(" ", function () {
        Common.LogNameTestPlan('Test-plan: ');

        let defaultNameStep = Page.Config.defaultStepName;
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
        browser.sleep(2000);
        xeroWorkflows.PayableWorkflows.BillClick();

        let workflowCard = new XeroWorkflowCard();
        let workflowStep1 = new WorkflowStep(defaultNameStep);
        let newStepName = 'QAQAQA';
        workflowCard.AddNewStep(newStepName);
        let workflowStep2 = new WorkflowStep(newStepName);

        Common.Log('0000000000000000000000');
        workflowStep2.AddExistingApprover(existingApprover2);
        Common.Log('1111111111111111111111');
        //
        // workflowStep2.MoveStep(defaultNameStep);
        // workflowStep2.CheckApprovers([existingApprover2]);
        // workflowStep1.CheckApprovers([],true);
        // workflowStep2.MoveStep(defaultNameStep);
        //
        // workflowStep1.RenameStep('1111');
        workflowStep2.RenameStep('SCND');

        // workflowStep1.AddExistingApprover(existingApprover2);
        // let step3name = 'nEW_3';
        // workflowCard.AddNewStep(step3name);
        // let workflowStep3 = new WorkflowStep(step3name);
        // workflowStep3.MoveStep(workflowStep1);
        // workflowStep1.CheckAllStep([step3name,defaultNameStep,newStepName]);







    });
});
